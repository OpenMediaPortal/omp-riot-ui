/*
 * @author ojourmel
 */
<omp-page>

    <omp-navbar class="omp-navbar"></omp-navbar>

    <omp-welcome class="omp-app"></omp-welcome>
    <omp-audio class="omp-app"></omp-audio>
    <omp-image class="omp-app"></omp-image>
    <omp-video class="omp-app"></omp-video>
    <omp-404 class="omp-app"></omp-404>

    <script>

        /*
         * @see /js/omp/data.js
         */
        omp = this;
        omp.routes = {};

        this.on("mount", function() {
            safe_riot_unmount(omp.tags, "omp-welcome");
            safe_riot_unmount(omp.tags, "omp-audio");
            safe_riot_unmount(omp.tags, "omp-video");
            safe_riot_unmount(omp.tags, "omp-image");
            safe_riot_unmount(omp.tags, "omp-404");
            logger("omp-app: mounted");
        });

        omp.routes.home = function (libkey) {
            DATA.libkey = null;
            safe_riot_unmount(omp.tags, "omp-welcome");
            safe_riot_unmount(omp.tags, "omp-audio");
            safe_riot_unmount(omp.tags, "omp-video");
            safe_riot_unmount(omp.tags, "omp-image");
            safe_riot_unmount(omp.tags, "omp-404");

            safe_riot_mount(omp.tags, "omp-welcome");
            omp.update();
        }
        omp.routes.audio= function (libkey) {
            DATA.libkey = libkey;
            safe_riot_unmount(omp.tags, "omp-welcome");
            safe_riot_unmount(omp.tags, "omp-audio");
            safe_riot_unmount(omp.tags, "omp-video");
            safe_riot_unmount(omp.tags, "omp-image");
            safe_riot_unmount(omp.tags, "omp-404");

            safe_riot_mount(omp.tags, "omp-audio");
            omp.update();
        };
        omp.routes.video = function (libkey) {
            DATA.libkey = libkey;
            safe_riot_unmount(omp.tags, "omp-welcome");
            safe_riot_unmount(omp.tags, "omp-audio");
            safe_riot_unmount(omp.tags, "omp-video");
            safe_riot_unmount(omp.tags, "omp-image");
            safe_riot_unmount(omp.tags, "omp-404");

            safe_riot_mount(omp.tags, "omp-video");
            omp.update();
        };
        omp.routes.image = function (libkey) {
            DATA.libkey = libkey;
            safe_riot_unmount(omp.tags, "omp-welcome");
            safe_riot_unmount(omp.tags, "omp-audio");
            safe_riot_unmount(omp.tags, "omp-video");
            safe_riot_unmount(omp.tags, "omp-image");
            safe_riot_unmount(omp.tags, "omp-404");

            safe_riot_mount(omp.tags, "omp-image");
            omp.update();
        };
        omp.routes.notfound = function (libkey) {
            DATA.libkey = libkey;
            safe_riot_unmount(omp.tags, "omp-welcome");
            safe_riot_unmount(omp.tags, "omp-audio");
            safe_riot_unmount(omp.tags, "omp-video");
            safe_riot_unmount(omp.tags, "omp-image");
            safe_riot_unmount(omp.tags, "omp-404");

            safe_riot_mount(omp.tags, "omp-404");
            omp.update();
        };

        var r = riot.route.create();
        // Routing is done dynamically based on the value from DATA.library
        // This is filled in by omp-navbar when the /library ajax request comes back
        // based on the above implemented route providers
        r("/", omp.routes.home);
        r(omp.routes.notfound);

        // Update routes using the library data in DATA
        // Due to async issues, a double anonymous function is used
        // to maintain closure
        omp.routes.update = function() {

            // Clear current routes
            riot.route.stop();

            r("/", omp.routes.home);
            r(omp.routes.notfound);

            // Look up the mimetype of each library and find the
            // appropriate routes function

            // Wrap riot route functions to pass libkey
            for (libkey in DATA.library) {
                var provider = omp.routes[DATA.library[libkey].libmime];
                if (provider == null) {
                    provider = omp.routes.notfound;
                }

                (function (l, p) {
                    r(l,function() {
                        p(l);
                    });
                })(libkey,provider);
            }

            /*
             * Once all the routes have been put in place, start up the router again.
             * Passing the boolean value "true" forces an exec on the current ulr
             * This is very helpful for recovering from a browser refresh
             * @see http://riotjs.com/api/route/#riotroutestartautoexec
             */
            riot.route.start(true);
        };
    </script>
</omp-page>
