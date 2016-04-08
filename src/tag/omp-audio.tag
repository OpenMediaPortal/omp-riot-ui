/*
 * @author ojourmel
 */
<omp-audio>

    <div class="omp-sidebar">
        <p>Sidebar</p>
    </div>

    <div class="omp-main">
        <div class="omp-content">
            <p>Audio</p>
        </div>
        <div class="omp-controls">
            Controls
        </div>
    </div>

    <script>
        this.on('mount', function() {
            logger('omp-audio: mounted');
        });
        this.on('unmount', function() {
            logger('omp-audio: unmounted');
        });
    </script>
</omp-audio>
