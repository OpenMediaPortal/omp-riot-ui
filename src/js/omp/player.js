/*
 * HTML5 audio and video player wrapper
 *
 * @author ojourmel
 */

class Player {

    constructor(parent, type, libkey) {
        this.self = null;
        this.parent = parent;
        this.type = type;
        this.libkey = libkey;
        this.isPlaying = false;
        this.isShuffle = true;
        this.isRepeat = false;
        this.current = null;
        this.playlist = null;
        this.playHistory = [];
    };

    init(parent) {
        this.parent = parent;

        if (this.self == null) {
            if (this.type == "audio") {
                this.self = $("<audio controls></audio>");
            } else if (this.type == "video" ) {
                this.self = $("<video controls></video>");
            }
            this.self.source = $("<source></source>");
            this.self.source.appendTo(this.self);

            this.self.artist = $("<p>", {
                text: ""
            });
            this.self.title = $("<p>", {
                text: ""
            });
            this.self.nextBtn = $("<button>", {
                id: "next",
                click: function() {
                    players[DATA.libkey].next();
                },
                text: "next"
            });
            this.self.prevBtn = $("<button>", {
                id: "prev",
                click: function() {
                    players[DATA.libkey].prev();
                },
                text: "prev"
            });
            this.self.shuffleBtn = $("<button>", {
                id: "shuffle",
                click: function() {
                    players[DATA.libkey].shuffle();
                    console.log("player-" + DATA.libkey + " shuffle: " + players[DATA.libkey].isShuffle)
                },
                text: "shuffle"
            });

            this.self.on("ended", function() {
                players[DATA.libkey].next();
            });
        }

        this.self.shuffleBtn.prependTo(this.parent);
        this.self.nextBtn.prependTo(this.parent);
        this.self.prevBtn.prependTo(this.parent);
        $("<br/>").prependTo(this.parent);
        this.self.prependTo(this.parent);
        this.self.title.prependTo(this.parent);
        this.self.artist.prependTo(this.parent);

        if (this.current != null) {
            this.load(this.current);
        }

    };

    /*
     * Get an id ready to play
     */
    load(id) {
        var index = DATA.library[DATA.libkey].f.lookup[id];
        this.self.source.attr("src", DATA.APIBASE + "/stream/" + id);
        this.self.source.attr("type", DATA.library[DATA.libkey].f.files[index].mimetype);
        this.self.title.text(DATA.library[DATA.libkey].f.files[index].title);
        this.self.artist.text(DATA.library[DATA.libkey].f.files[index].artist);
        this.self[0].load();
    }

    /*
     * Play a particular id
     *
     * play() will attempt to unpause if possible
     */
    play(id) {
        if (id == null && this.self[0].readyState >= 3) {
            this.self[0].play();
        } else {
            this.isPlaying = true;
            this.current = id;
            if (this.playHistory[this.playHistory.length - 1] != id) {
                this.playHistory.push(id);
            }
            this.load(id);
            this.self[0].play();
        }
    };

    pause() {
        this.isPlaying = false;
        if (this.self != null) {
            this.self[0].pause();
        }
    };

    stop() {
        this.isPlaying = false;
        if (this.self != null) {
            this.self[0].pause();
            this.self[0].load();
        }
    };

    next() {
        if (this.isRepeat) {
            this.play(this.current);
        } else if (this.isShuffle) {
            this.playRandom();
        } else {
            if (this.current == null) {
                this.playRandom();
            } else {
                var index = DATA.library[this.libkey].f.lookup[this.current];
                index = (index+1) % DATA.library[this.libkey].f.files.length;
                this.play(DATA.library[this.libkey].f.files[index]._id);
            }
        }
    };

    /*
     * A basic implementation that pops the playhistory
     * Does *not* save the poped songs, so
     * prev -> next (may) not play the same file
     * Either track a stack pointer to modify
     * or a playFuture / playQueue stack that
     */
    prev() {
        if (this.isRepeat) {
            this.play(this.current);
        } else {
            var id = this.playHistory.pop();
            if (id == null ) {
                this.playRandom();
            } else if (id == this.current) {

                if (this.self[0].currentTime < 10) {
                    this.prev();
                } else {
                    this.play(id);
                }
            } else {
                this.play(id);
            }
        }
    };

    playRandom() {
            var min = 0;
            var max = DATA.library[this.libkey].f.files.length;

            var id = null;
            var count = 0;

            // Try to avoid picking the same file too often
            // MAGICNUMBER: 1000
            do {
                var n = Math.floor(Math.random() * (max - min)) + min;
                id = DATA.library[this.libkey].f.files[n]._id;
                count++;
            } while((this.playHistory.indexOf(id) != -1) && (count < 1000));

            this.play(id);
    };

    shuffle() {
        this.isShuffle = !this.isShuffle;
    };

    repeat() {
        this.isRepeat = !this.isRepeat;
    };

    show() {
        if ($(this.parent).has(this.type).length != 0) {
            this.self.show();
        }
    };

    hide() {
        if (this.self != null) {
            this.self.hide();
        }
        this.isPlaying = false;
    };
}
