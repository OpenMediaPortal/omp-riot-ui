/*
 * @author ojourmel
 *
 */
<omp-navbar>

    <div class="omp-navitemcontainer">
        <a href="/" class="omp-navitem" if={ Object.keys(DATA.library).length == 0 }>
            <div class="omp-navitem">
                No Libraries
            </div>
        </a>

        <a href="/{ l }" class="omp-navitem" each={ l in DATA.library }>
            <div class="{ active: DATA.libkey === l }" >
                { l }
            </div>
        </a>

    </div>
    <a href="/" class="omp-navmenu">
        <div class="{ active: DATA.libkey == null }">
            Gears
        </div>
    </a>

    <script>
        var self = this;

        this.on("mount", function() {
            $.ajax({
                url: DATA.APIBASE + "/library",
                type: "GET",
                success: function(data){
                    DATA.library = data;
                    logger("omp-navbar: " + JSON.stringify(DATA.library));
                    self.update();

                    omp.routes.update();
                },
                error: function(error){
                     logger("omp-navbar ERROR:");
                     logger(error);
                }
            });
            logger("omp-navbar: mounted");
        });
    </script>
</omp-navbar>

