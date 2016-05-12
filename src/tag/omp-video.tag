/*
 * @author ojourmel
 */
<omp-video>
    <script>
        this.on('mount', function() {
            logger("omp-video: mounted at libkey: " + DATA.libkey);
        });
        this.on('unmount', function() {
            logger('omp-video: unmounted');
        });
    </script>
</omp-video>

