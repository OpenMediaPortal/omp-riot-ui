/*
 * @author ojourmel
 */
<omp-welcome>
    <script>
        var self = this;
        this.on("mount", function() {
            logger("omp-welcome: mounted");
        });
        this.on("unmount", function() {
            logger("omp-welcome: unmounted");
        });
    </script>
</omp-welcome>
