/*
 * @author ojourmel
 *
 */
<omp-nav>

    <a id="omp-nav-home" href="/" class="{ active: DATA.libkey == null }">
        <i class="fa fa-lg fa-home" aria-hidden="true"></i>
    </a>
    <input type="checkbox" id="omp-nav-toggle"> </input>

    <ul class="omp-nav-items">
        <a href="/" class="omp-nav-item" if={ Object.keys(DATA.library).length == 0 }>
            No Libraries
        </a>
        <a href="/{ l }" class="omp-nav-item { active: DATA.libkey === l }" each={ l in DATA.library }>
            { l }
        </a>
    </ul>

    <label for="omp-nav-toggle" id="omp-nav-toggle-label">
        <i class="fa fa-lg fa-bars" aria-hidden="true"></i>
    </label>

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

        // Clear the nav menu when an item is selected
        this.on("updated", function() {
            $(".omp-nav-item").each(function (index) {
                $(this).on( "click", function() {
                    $("#omp-nav-toggle").prop('checked', false);
                });
            });
            $("#omp-nav-home").each(function (index) {
                $(this).on( "click", function() {
                    $("#omp-nav-toggle").prop('checked', false);
                });
            });
        });
    </script>
</omp-nav>

