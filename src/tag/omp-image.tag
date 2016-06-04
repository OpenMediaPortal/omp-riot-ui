/*
 * @author ojourmel
 */
<omp-image>
    <script>
        var self = this;
        this.on("mount", function() {
            logger("omp-image: mounted at libkey: " + DATA.libkey);
        });
        this.on("unmount", function() {
            logger("omp-image: unmounted");
        });
    </script>
</omp-image>

