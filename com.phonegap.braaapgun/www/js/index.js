"use strict";

if (!window.DeviceMotionEvent) {
     window.alert('Your browser doesn\'t support the device motion event');
}

var t=0,
    min,
    max,
    max_speed = 8,
    revert_speed = 6,
    braaap_enabled = true,
    maxelem = document.getElementById("maxelem"),
    minelem = document.getElementById("minelem"),
    braaaps,
    bars = {
        gamma: document.getElementById("bar-gamma")
    },

    texts = {
        gamma: document.getElementById("text-gamma")
    };

function trans(val) {
    return Math.max(0, Math.min(max_speed, val)*100/max_speed);
}

function bar(barnum, val, checklimits) {
    if (val < 0) {
        val = 0;
    }

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

            if (motionevent.rotationRate.gamma > max_speed && braaap_enabled) {
                braaap();
                braaap_enabled = false;
            } else if (motionevent.rotationRate.gamma <= revert_speed && braaap_enabled === false) {
                braaap_enabled = true;
            }
        }, false);

        //init
        reset();
});