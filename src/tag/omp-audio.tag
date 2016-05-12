/*
 * @author ojourmel
 */
<omp-audio>
    <script>
        this.on('mount', function() {
            logger("omp-audio: mounted at libkey: " + DATA.libkey);
        });
        this.on('unmount', function() {
            logger('omp-audio: unmounted');
        });
    </script>
</omp-audio>
