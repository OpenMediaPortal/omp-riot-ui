/*
 * @author ojourmel
 */
<omp-audio>
    <input type="checkbox" id="omp-player-toggle"> </input>
    <div class="omp-player">
        <div class="omp-player-content">
        </div>
        <div class="omp-player-controls">
            <div class="omp-player-details">
            </div>
            <div class="omp-player-slider">
                <progress value="22" max="100"></progress>
            </div>
            <div class="omp-player-buttons">
                <i class="fa fa-repeat"></i>
                <i class="fa fa-backward"></i>
                <i class="fa fa-play"></i>
                <i class="fa fa-forward"></i>
                <i class="fa fa-random"></i>
                <i class="fa fa-download"></i>
                <label for="omp-player-toggle" id="omp-player-toggle-label" class="fa fa-flip-horizontal fa-expand"></label>
            </div>
        </div>
    </div>
    <div class="omp-explorer">
    </div>

    <script>
        var self = this;
        var files = null;


        this.on("mount", function() {
            self.libkey = DATA.libkey;

            // Init a player for each library instance of the tag
            if (( self.libkey ) && (! players[self.libkey])) {
                players[self.libkey] = new Player($(".omp-player")[0], DATA.library[self.libkey].libmime, self.libkey);
            }

            if (files == null) {
                var files = new Files(document.getElementsByClassName("omp-explorer")[0]);
            }

            // Get all libkey files with a default grouping of artist,album
            $.ajax({
                url: DATA.APIBASE + "/library/" + self.libkey,
                type: "GET",
                data: {"group":"artist,album" , "sort":""},
                success: function(data){
                    DATA.library[self.libkey].f = data;

                    players[self.libkey].init($(".omp-player")[0]);

                    files.init("list");
                    self.update();
                },
                error: function(error){
                     logger("omp-audio/" + self.libkey + " ERROR:");
                     logger(error);
                }
            });

            logger("omp-audio: mounted at libkey: " + self.libkey);
        });

        this.on("unmount", function() {
            if (players[self.libkey] != null) {
                players[self.libkey].hide();
            }
            logger("omp-audio: unmounted");
        });
    </script>
</omp-audio>
