/*
 * Front end data cache
 *
 * @author ojourmel
 */
"use strict";

var DATA = {
    SERVERADDRESS: window.location.protocol + "//" + window.location.hostname,
    SERVERPORT: 8001,
    libkey: "",
    library: {},
    sync: [],
    DEBUG: true
};
DATA.apibase = DATA.SERVERADDRESS + ":" + DATA.SERVERPORT;

/*
 * Exernal reference to the omp-page riot instance
 * Check 'omp.tags' for child tag instances
 */
var omp = {};
