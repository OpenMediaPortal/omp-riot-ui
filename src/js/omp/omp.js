/*
 * Application data cache
 * Helper functions
 * Requires riotjs for safe_riot_* functions
 * @author ojourmel
 */

var DATA = {
    SERVERADDRESS: window.location.protocol + "//" + window.location.hostname,
    SERVERPORT: 8001,
    library: {},
    sync: [],
    DEBUG: true
};

var logger = function (l) {
    if (DATA.DEBUG == true){
        console.log(l);
    }
};

var routes = {};
var app = {};

/*
 * p - the parent tag
 * t - the tag to be mounted
 * tc- the tag class
 * r - the root id if the tag needs to be added
 *
 * disallows duplicate tags
 * assume all tags are appended to 'omp-page'
 */
function safe_riot_mount( p, t, tc, r){
    if (! p[t]) {
        if (tc && r) {
            var e = document.createElement(t);
            e.setAttribute("class", tc);
            document.getElementById(r).appendChild(e);
        }
        riot.compile(function() {
            p[t] = riot.mount(t)[0];
        });
    }
}

/*
 * p - the parent tag
 * t - the tag to be mounted
 */
function safe_riot_unmount( p, t ){
    if (p[t]) {
        p[t].unmount();
        if (p[t]) {
            p[t] = undefined;
        }
    }
}
