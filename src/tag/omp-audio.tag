/*
 * @author ojourmel
 */
<omp-audio>
<div class="omp-playercontainer">
    <div class="omp-player"></div>
</div>
    <script>
        var self = this;

        var files = new Files(self.root);

        this.on("mount", function() {

            // Init a player for each library instance of the tag
            if (( DATA.libkey ) && (! players[DATA.libkey])) {
                players[DATA.libkey] = new Player($(".omp-player")[0], DATA.library[DATA.libkey].libmime, DATA.libkey);
            }

            // Get all libkey files with a default grouping of artist,album
            $.ajax({
                url: DATA.APIBASE + "/library/" + DATA.libkey,
                type: "GET",
                data: {"group":"artist,album" , "sort":""},
                success: function(data){
                    DATA.library[DATA.libkey].f = data;

                    players[DATA.libkey].init($(".omp-player")[0]);
                    players[DATA.libkey].show();

                    files.init("list");
                    self.update();
                },
                error: function(error){
                     logger("omp-audio/" + DATA.libkey + " ERROR:");
                     logger(error);
                }
            });

            logger("omp-audio: mounted at libkey: " + DATA.libkey);
        });

        this.on("unmount", function() {
            if (players[DATA.libkey] != null) {
                players[DATA.libkey].hide();
            }
            logger("omp-audio: unmounted");
        });
    </script>
</omp-audio>
