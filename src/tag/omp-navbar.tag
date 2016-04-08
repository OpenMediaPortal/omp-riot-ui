/*
 * @author ojourmel
 */
<omp-navbar>

    <div class="omp-navitemcontainer">
        <div class="omp-navitem" if={ Object.keys(DATA.library).length == 0 }>
            <a href="#">No Libraries</a>
        </div>

        <div class="omp-navitem" each={ l in DATA.library }>
            <a href="/{ l }" class={ selected: parent.selectedlib == l }>{ l }</a>
        </div>
    </div>

    <div class="omp-navmenu">
        <a href="/">Gears</a>
    </div>

    <script>
        var self = this;
        var r = riot.route.create();
        r(highlightCurrent);

        function highlightCurrent(lib) {
            self.selectedlib = lib;
            self.update();
        }

        this.on('mount', function() {
            $.ajax({
                url: DATA.SERVERADDRESS + ":" + DATA.SERVERPORT + "/library",
                type: "GET",
                success: function(data){
                    DATA.library = data;
                    logger("omp-navbar: " + JSON.stringify(DATA.library));
                    self.update();

                    // Update the routing based on mime providers
                    for (l in DATA.library) {
                        var provider = DATA.library[l].libmime;
                        if (Object.keys(routes).indexOf(provider) == -1) {
                            provider = routes.notfound;
                        } else {
                            provider = routes[provider];
                        }
                        r(l,provider);
                    }
                },
                error: function(error){
                     logger("omp-navbar ERROR:");
                     logger(error);
                }
            });
            logger('omp-navbar: mounted');
        });
    </script>
</omp-navbar>

