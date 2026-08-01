/* statsCalculator.js
   Calcolatore statistiche GURPS 4e.
   Gestisce:
   - punti totali / punti rimanenti
   - spesa punti per ST, DX, IQ, HT (costo per livello personalizzabile)
   - statistiche derivate: HP, Basic Lift, Dmg (Thr/Sw), FP, Will,
     Basic Speed, Basic Move, Dodge
*/

(function () {
    "use strict";

    var STATS = ["st", "dx", "iq", "ht"];

    // --- Tabella Thrust/Swing per ST 1-18 / 1-11 (zona irregolare,
    //     presa dalla Damage Table del Basic Set). Oltre questi valori
    //     si applica la formula ufficiale di estensione del ciclo. ---
    var THRUST_LOW = {
        1: { n: 1, mod: -6 }, 2: { n: 1, mod: -6 },
        3: { n: 1, mod: -5 }, 4: { n: 1, mod: -5 },
        5: { n: 1, mod: -4 }, 6: { n: 1, mod: -4 },
        7: { n: 1, mod: -3 }, 8: { n: 1, mod: -3 },
        9: { n: 1, mod: -2 }, 10: { n: 1, mod: -2 },
        11: { n: 1, mod: -1 }, 12: { n: 1, mod: -1 },
        13: { n: 1, mod: 0 }, 14: { n: 1, mod: 0 },
        15: { n: 1, mod: 1 }, 16: { n: 1, mod: 1 },
        17: { n: 1, mod: 2 }, 18: { n: 1, mod: 2 }
    };

    var SWING_LOW = {
        1: { n: 1, mod: -5 }, 2: { n: 1, mod: -5 },
        3: { n: 1, mod: -4 }, 4: { n: 1, mod: -3 },
        5: { n: 1, mod: -3 }, 6: { n: 1, mod: -2 },
        7: { n: 1, mod: -2 }, 8: { n: 1, mod: -1 },
        9: { n: 1, mod: 0 }, 10: { n: 1, mod: 1 },
        11: { n: 1, mod: 2 }
    };

    function thrustDice(st) {
        st = Math.max(1, Math.round(st));
        if (st <= 18) return THRUST_LOW[st];
        // Estensione ciclica ufficiale: ogni 8 ST un dado in più,
        // il modificatore ricicla -1, 0, +1, +2 ogni 2 ST.
        var steps = st - 19;
        var dice = 2 + Math.floor(steps / 8);
        var mod = -1 + Math.floor((steps % 8) / 2);
        return { n: dice, mod: mod };
    }

    function swingDice(st) {
        st = Math.max(1, Math.round(st));
        if (st <= 11) return SWING_LOW[st];
        // Estensione ciclica ufficiale: ogni 4 ST un dado in più,
        // il modificatore ricicla -1, 0, +1, +2 ogni 1 ST.
        var steps = st - 12;
        var dice = 2 + Math.floor(steps / 4);
        var mod = -1 + (steps % 4);
        return { n: dice, mod: mod };
    }

    function fmtDice(d) {
        var s = d.n + "d";
        if (d.mod > 0) s += "+" + d.mod;
        else if (d.mod < 0) s += d.mod;
        return s;
    }

    function basicLift(st) {
        var raw = (st * st) / 5;
        var lbs = raw < 10 ? Math.round(raw * 10) / 10 : Math.round(raw);
        var kg = Math.round(lbs * 0.453592 * 10) / 10;
        return lbs + " lbs / " + kg + " kg";
    }

    function getNum(id, fallback) {
        var el = document.getElementById(id);
        var v = parseFloat(el.value);
        return isNaN(v) ? fallback : v;
    }

    function setText(id, text) {
        document.getElementById(id).textContent = text;
    }

    function recalc() {
        var totalPoints = getNum("total-points", 100);
        var totalSpesa = 0;
        var values = {};

        STATS.forEach(function (stat) {
            var value = getNum(stat + "-value", 10);
            var costo = getNum(stat + "-costo", 0);
            var spesa = (value - 10) * costo;
            values[stat] = value;
            totalSpesa += spesa;
            setText(stat + "-spesa", spesa);
        });

        setText("total-attributi", totalSpesa);
        setText("points-remaining", totalPoints - totalSpesa);

        var st = values.st;
        var dx = values.dx;
        var iq = values.iq;
        var ht = values.ht;

        setText("hp", st);
        setText("bl", basicLift(st));
        setText("dmg", fmtDice(thrustDice(st)) + "/" + fmtDice(swingDice(st)));
        setText("fp", ht);
        setText("will", iq);

        var basicSpeedRaw = (dx + ht) / 4;
        var basicSpeed = basicSpeedRaw.toFixed(2);
        var basicMove = Math.floor(basicSpeedRaw);
        var dodge = basicMove + 3;

        setText("basic-speed", basicSpeed);
        setText("basic-move", basicMove);
        setText("dodge", dodge);
    }

    document.addEventListener("DOMContentLoaded", function () {
        var inputs = ["total-points"];
        STATS.forEach(function (stat) {
            inputs.push(stat + "-value");
            inputs.push(stat + "-costo");
        });

        inputs.forEach(function (id) {
            document.getElementById(id).addEventListener("input", recalc);
        });

        recalc();
    });
})();
