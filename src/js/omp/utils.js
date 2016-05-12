/*
 * Helper functions
 * Requires riotjs for safe_riot_* functions
 * @author ojourmel
 */
"use strict";

/*
 * p - the parent tag instance
 * t - the tag to be mounted
 *
 * mounts all instances of t
 * unhides t element
 */
function safe_riot_mount( p, t){
    if (! p[t]) {
        $(t).show();
        p[t] = riot.mount(t)[0];
    }
}

/*
 * p - the parent tag instance
 * t - the tag to be unmounted
 *
 * unmounts t child element of p
 * hides t element
 */
function safe_riot_unmount( p, t ){
    if (p[t]) {
        p[t].unmount(true);
        $(t).hide();
        if (p[t]) {
            p[t] = undefined;
        }
    }
}

var logger = function (l) {
    if (DATA.DEBUG == true){
        console.log(l);
    }
};
