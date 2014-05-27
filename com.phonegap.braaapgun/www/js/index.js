"use strict";

if (!window.DeviceMotionEvent) {
     window.alert('Your browser doesn\'t support the device motion event');
}

var t=0,
    min,
    max,
    braaap_enabled = true,
    maxelem = document.getElementById("maxelem"),
    minelem = document.getElementById("minelem"),
    bars = {
        gamma: document.getElementById("bar-gamma")
    },

    texts = {
        gamma: document.getElementById("text-gamma")
    };

function trans(val) {
    return Math.min(100, Math.max(0, Math.abs(val)*100/20));
}

function bar(barnum, val, checklimits) {
    if (checklimits) {
        if (val > max) {
            max = val;
        }
        if (val < min) {
            min = val;
        }
    }

    bars[barnum].style.height = trans(val)+"%";
    texts[barnum].innerHTML = Math.floor(val);

    maxelem.innerHTML = max;
    minelem.innerHTML = min;
}

function braaap() {
    braaaps++;
    new Media('/android_asset/www/audio/brap.mp3').play();
    document.getElementById("reset").innerHTML = braaaps;
}

function reset() {
    max = -Infinity;
    min = Infinity;
    braaaps = 0;
}

document.addEventListener("deviceready", function() {

        //events
        document.getElementById("reset").addEventListener("click", function(){
            reset();
        });

        window.addEventListener('devicemotion', function(motionevent) {
            bar("gamma", motionevent.rotationRate.gamma, true);

            if (motionevent.rotationRate.gamma > 9 && braaap_enabled) {
                braaap();
                braaap_enabled = false;
            } else if (motionevent.rotationRate.gamma <= 5 && braaap_enabled === false) {
                braaap_enabled = true;
            }
        }, false);

        //init
        reset();
});