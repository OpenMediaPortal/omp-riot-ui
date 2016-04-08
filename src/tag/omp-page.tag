/*
 * @author ojourmel
 */
<omp-page>

    <omp-navbar id="omp-navbar" class="omp-navbar"></omp-navbar>

    <div if={ home == true }>
        <span > { welcometext } </span> </br>
        <span > { updatetext } </span>
    </div>

    <span if={notfound == true}> Oh No! Something Broke! </span>

    <omp-audio class="omp-app"></omp-audio>
    <omp-video class="omp-app"></omp-video>
    <omp-image class="omp-app"></omp-image>

    <script>
        var self = this;
        app = this;

        self.notfound = false;
        self.home = true;
        self.welcometext = "";
        self.updatetext = "";

        this.on('mount', function() {
            riot.compile(function() {
                riot.mount('omp-navbar');
            });
            safe_riot_unmount(self.tags, 'omp-audio');
            safe_riot_unmount(self.tags, 'omp-video');
            safe_riot_unmount(self.tags, 'omp-image');
            logger('omp-app: mounted');
        });


        routes.home = function () {
            safe_riot_unmount(self.tags, 'omp-audio');
            safe_riot_unmount(self.tags, 'omp-video');
            safe_riot_unmount(self.tags, 'omp-image');

            self.update({
                home: true,
                notfound: false,
                welcometext: "Welcome to an OpenMediaPortal!",
                updatetext: "Early Alpha Release"
            });
        }
        routes.audio= function () {
            safe_riot_unmount(self.tags, 'omp-video');
            safe_riot_unmount(self.tags, 'omp-image');
            safe_riot_mount(self.tags, 'omp-audio', 'omp-app', 'omp-page');
            self.update({
                home: false,
                notfound: false
            });
        };
        routes.video = function () {
            safe_riot_unmount(self.tags, 'omp-audio');
            safe_riot_unmount(self.tags, 'omp-image');
            safe_riot_mount(self.tags, 'omp-video', 'omp-app', 'omp-page');
            self.update({
                home: false,
                notfound: false
            });
        };
        routes.image = function () {
            safe_riot_unmount(self.tags, 'omp-audio');
            safe_riot_unmount(self.tags, 'omp-video');
            safe_riot_mount(self.tags, 'omp-image', 'omp-app', 'omp-page');
            self.update({
                home: false,
                notfound: false
            });
        };
        routes.notfound = function () {
            safe_riot_unmount(self.tags, 'omp-audio');
            safe_riot_unmount(self.tags, 'omp-image');
            safe_riot_unmount(self.tags, 'omp-video');
            self.update({
                home: false,
                notfound: true
            });
        };

        var r = riot.route.create();
        // Routing is done dynamically based on the value from DATA.library
        // This is filled in by omp-navbar when the /library ajax request comes back
        // based on the above implemented routers
        r('/', routes.home);
        r(routes.notfound);
    </script>
</omp-page>
