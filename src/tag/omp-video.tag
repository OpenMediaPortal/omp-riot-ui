/*
 * @author ojourmel
 */
<omp-video>

    <div class="omp-sidebar">
        <p>Sidebar</p>
    </div>

    <div class="omp-main">
        <div class="omp-content">
            <p>Video</p>
        </div>
        <div class="omp-controls">
            Controls
        </div>
    </div>

    <script>
        this.on('mount', function() {
            logger('omp-video: mounted');
        });
        this.on('unmount', function() {
            logger('omp-video: unmounted');
        });
    </script>
</omp-video>

