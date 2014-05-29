"use strict";

if (!window.DeviceMotionEvent) {
     window.alert('Your browser doesn\'t support the device motion event');
}

var t=0,
    min,
    max,
    gun_position = false,
    braaap_array,
    max_speed = 8,
    revert_speed = 5,
    braaap_enabled = true,
    body = document.querySelector("body"),
    maxelem = document.getElementById("maxelem"),
    minelem = document.getElementById("minelem"),
    touchesEl = document.getElementById("touchesEl"),
    touchesAvgEl = document.getElementById("touchesAvgEl"),
    touchLine = document.getElementById("touchLine"),
    resetBut = document.getElementById("reset"),
    handDetectorContainer = document.getElementById("hand-detector-container"),
    braaaps,
    can_enable_braaap,
    braaap_min_timeout = 200,
    window_width = window.innerWidth,
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

    bars[barnum].style.width = trans(val)+"%";
    texts[barnum].innerHTML = val.toFixed(2);

    maxelem.innerHTML = max.toFixed(2);
    minelem.innerHTML = min.toFixed(2);
}

function get_random_braaap(){
    return braaap_array[Math.floor(Math.random() * braaap_array.length)];
}

function braaap() {
    if (gun_position !== false) {
        braaaps++;
        new Media(get_random_braaap()).play();
        resetBut.innerHTML = braaaps;
    }
}

function hide_interface() {
    body.className="no-interface";
}

function show_interface(pos) {
    body.className="gun-"+pos;
}

function drawGun(pos) {
    if (pos === false) {
        hide_interface();
    } else {
        show_interface(pos);
    }
}

function set_gun_position(pos) {
    gun_position = pos;
    drawGun(pos);
}

function reset() {
    max = -Infinity;
    min = Infinity;
    braaaps = 0;
    can_enable_braaap = true;
    hide_interface();
    set_gun_position(false);
    touchesAvgEl.innerHTML = 0;
    touchesEl.innerHTML = 0;
    touchLine.style.left = 0;
}

function set_gun_properties(e) {
    e.preventDefault();
    e.stopPropagation();

    var pos = 0, i;


    if (e.touches.length) {
        for (i=0; i<e.touches.length; i++) {
            pos+=e.touches[i].clientX;
        }
        pos = pos / e.touches.length;

        touchesAvgEl.innerHTML = Math.floor(pos);
        touchesEl.innerHTML = e.touches.length;
        touchLine.style.left = pos * 100 / window_width+"%";

        if (pos < window_width / 2) {
            if (gun_position !== "left") {
                body.className = "gun-left";
                set_gun_position("left");
            }
        } else if (gun_position !== "right") {
            body.className = "gun-right";
            set_gun_position("right");
        }
    } else {
        if (gun_position !== false) {
            pos = false;
            set_gun_position(false);
        }
    }

    return false;
}

document.addEventListener("deviceready", function() {

        handDetectorContainer.addEventListener("touchmove", set_gun_properties, false);
        handDetectorContainer.addEventListener("touchstart", set_gun_properties, false);
        handDetectorContainer.addEventListener("touchend", set_gun_properties, false);

        document.addEventListener("backbutton", function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, false);

        //init braaap_array
        braaap_array = [
            '/android_asset/www/audio/brap.mp3'
        ];

        //events
        resetBut.addEventListener("click", function(){
            reset();
        });

        window.addEventListener('devicemotion', function(motionevent) {
            if (gun_position !== false) {
                var val;
                if (gun_position === "left") {
                    val = motionevent.rotationRate.gamma;
                } else {
                    val = -motionevent.rotationRate.gamma;
                }

                bar("gamma", val, true);

                if (val > max_speed && braaap_enabled) {
                    braaap();
                    braaap_enabled = false;
                    can_enable_braaap = false;
                    setTimeout(function() {
                        can_enable_braaap = true;
                    }, braaap_min_timeout);
                } else if (motionevent.rotationRate.gamma <= revert_speed && can_enable_braaap &&braaap_enabled === false) {
                    braaap_enabled = true;
                }
            }
        }, false);

        //init
        reset();
});