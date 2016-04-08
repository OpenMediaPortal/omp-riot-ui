/*
 * @author ojourmel
 */
<omp-image>

    <div class="omp-sidebar">
        <p>Sidebar</p>
    </div>

    <div class="omp-main">
        <div class="omp-content">
            <p>Images</p>
        </div>
        <div class="omp-controls">
            Controls
        </div>
    </div>

    <script>
        this.on('mount', function() {
            logger('omp-image: mounted');
        });
        this.on('unmount', function() {
            logger('omp-image: unmounted');
        });
    </script>
</omp-image>

