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
        this.nowPlaying = [];
        this.playHistory = [];
        this.playHistoryIndex = -1;

        this.playlist = null;
    };

    init(parent) {
        this.parent = parent;

        if (this.type == "audio") {
            if (this.self == null) {
                this.self = $("<audio></audio>");
                this.self.source = $("<source></source>");
                this.self.source.appendTo(this.self);

                this.self.on("ended", function() {
                    players[this.libkey].next();
                });
            }

            this.self.artist = $("<p>", {
                text: ""
            });
            this.self.album = $("<p>", {
                text: ""
            });
            this.self.title = $("<p>", {
                text: ""
            });

            this.self.artist.prependTo($(".omp-player-content"));
            this.self.album.prependTo($(".omp-player-content"));
            this.self.title.prependTo($(".omp-player-details"));

            /* Register callbacks on custom buttons */
            var that = this;
            $(".omp-player-buttons > i").each(function () {
                if (this.className.match("play")) {
                    that.self.playBtn = $(this);
                    that.self.playBtn.on("click", function () {
                        if (players[that.libkey].isPlaying) {
                            players[that.libkey].pause();
                        } else {
                            players[that.libkey].play();
                        }
                    });
                } else if (this.className.match("repeat")) {
                    that.self.repeatBtn = $(this);
                    that.self.repeatBtn.on("click", function () {
                        players[that.libkey].repeat();
                    });
                } else if (this.className.match("random")) {
                    that.self.randomBtn = $(this);
                    that.self.randomBtn.on("click", function () {
                        players[that.libkey].shuffle();
                    });
                } else if (this.className.match("backward")) {
                    that.self.prevBtn = $(this);
                    that.self.prevBtn.on("click", function () {
                        players[that.libkey].prev();
                    });
                } else if (this.className.match("forward")) {
                    that.self.nextBtn = $(this);
                    that.self.nextBtn.on("click", function () {
                        players[that.libkey].next();
                    });
                } else if (this.className.match("download")) {
                    that.self.linkBtn = $(this);
                }
            });

            this.nowPlaying = [[0,DATA.library[this.libkey].f.files.length-1]];
            if (this.current == null) {
                this.current = this.getRandomId();
            }
            this.load(this.current);

        } else {
            console.log("Unsupported Player type!");
        }
    };

    /*
     * Get an id ready to play
     */
    load(id) {
        if (id) {
            var index = DATA.library[this.libkey].f.lookup[id];
            this.self.source.attr("src", DATA.APIBASE + "/stream/" + id);
            this.self.source.attr("type", DATA.library[this.libkey].f.files[index].mimetype);
            this.self.title.text(DATA.library[this.libkey].f.files[index].title);
            this.self.artist.text(DATA.library[this.libkey].f.files[index].artist);
            this.self.album.text(DATA.library[this.libkey].f.files[index].album);
            this.self.linkBtn.on("click", function() {
                location.href = DATA.APIBASE + "/stream/" + id;
            });
            this.self[0].load();
        }
    };

    /*
     * Play a particular id
     *
     * play(id)
     *  play a thing
     *  no assumptions are made as to the playHistory, shuffle, or anything
     */
    play(id) {
        if (id != null) {
            this.isPlaying = true;
            this.self.playBtn.removeClass("fa-play");
            this.self.playBtn.addClass("fa-pause");
            this.load(id);
            this.current = id;
            this.self[0].play();

        } else if (this.current) {
            this.play(this.current);
        } else {
            this.next();
        }
    };

    pause() {
        this.isPlaying = false;
        this.self.playBtn.removeClass("fa-pause");
        this.self.playBtn.addClass("fa-play");
        if (this.self != null) {
            this.self[0].pause();
        }
    };

    stop() {
        this.isPlaying = false;
        this.self.playBtn.removeClass("fa-pause");
        this.self.playBtn.addClass("fa-play");
        if (this.self != null) {
            this.self[0].pause();
            this.self[0].load();
        }
    };

    /*
     * Plays the next logical song, saving playHistory
     *
     * - next song from history if we have it
     * - random(ish) song when shuffling
     * - incremental song from nowPlaying
     *
     * There are several edge cases for when this.current is null,
     * or we are at the ends of the playHistory.
     */
    next() {
        if (this.isRepeat) {
            this.play(this.current);
            return;
        }

        this.playHistoryIndex++;

        if (this.playHistoryIndex >= this.playHistory.length) {
            // no more playHistory to "pop"

            var id;

            if (this.isShuffle) {
                id = this.getRandomId();
            } else {

                // If there is nothing to go "next" from, use index 0
                // otherwise, find the next logical item in nowPlaying
                var index;
                if (this.current == null) {
                    index = this.nowPlaying[0][0];
                } else {
                    index = DATA.library[this.libkey].f.lookup[this.current];

                    for (var i=0; i<this.nowPlaying.length; i++) {

                        // Found the correct sub-array
                        if (index >= this.nowPlaying[i][0] && index <= this.nowPlaying[i][1]) {
                            // If the index rolled past the end of the current sub array,
                            // safe increment the sub array index (i), and use it's smallest value
                            if (index == this.nowPlaying[i][1]) {
                                i = (i+1) % this.nowPlaying.length;
                                index = this.nowPlaying[i][0];
                            } else {
                                index++;
                            }
                            break;
                        } else {
                            // this.current refers to something outside of nowPlaying
                            // Use the first thing from nowPlaying...
                            index = this.nowPlaying[0][0];
                            break;
                        }
                    }
                }
                id = DATA.library[this.libkey].f.files[index]._id;
            }

            this.playHistory.push(id);
            this.play(id);

        } else {
            this.play(this.playHistory[this.playHistoryIndex]);
        }
    };

    /*
     * Plays the prev logical song, restoring from playHistory
     *
     * - prev song from history if we have it
     * - random(ish) song when shuffling
     * - decremental song from nowPlaying
     *
     * There are several edge cases for when this.current is null,
     * or we are at the ends of the playHistory.
     */
    prev() {
        if (this.isRepeat) {
            this.play(this.current);
            return;
        }


        // Since the currently playing song is always in the playHistory,
        // So playHistory[0] == this.current
        // Thus, get a new index once we get to 1
        if (this.playHistoryIndex <= 1) {
            // no more playHistory to "pop"

            var id;

            if (this.isShuffle) {
                id = this.getRandomId();
            } else {

                // If there is nothing to go "prev" from, use index 0
                // otherwise, find the prev logical item in nowPlaying
                var index;
                if (this.current == null) {
                    index = this.nowPlaying[0][0];
                } else {
                    index = DATA.library[this.libkey].f.lookup[this.current];
                    for (var i=0; i<this.nowPlaying.length; i++) {

                        // Found the correct sub-array
                        if (index >= this.nowPlaying[i][0] && index <= this.nowPlaying[i][1]) {

                            if (index == this.nowPlaying[i][0]) {
                                i = (i-1) % this.nowPlaying.length;
                                index = this.nowPlaying[i][1];
                            } else {
                                index--;
                            }
                        } else {
                            // this.current refers to something outside of nowPlaying
                            // Use the first thing from nowPlaying...
                            index = this.nowPlaying[0][0];
                            break;
                        }
                    }
                }

                id = DATA.library[this.libkey].f.files[index]._id;
            }

            this.playHistory.unshift(id);
            this.play(id);
            this.playHistoryIndex = 0;

        } else {
            this.playHistoryIndex--;
            this.play(this.playHistory[this.playHistoryIndex]);
        }
    };


    // Generate a new random id from the nowPlaying array(s)
    //
    // This method breaks down after the playHistory has been filled
    // with all of nowPlaying. At that point, it simply picks random
    // numbers with no regard for duplicates.

    // A player.js refactor would generate complete nowPlaying lists
    // once and then iterate through them, shuffle or not.
    // This has an issue when crossing nowPlaying boundaries, with
    // unrepeatable next/prev songs, but would greatly simplify
    // the code.
    getRandomId() {
        var id;
        var count = 0;
        do {
            var rtotal=0;
            // Total up the id ranges
            for (var i=0; i<this.nowPlaying.length; i++){
                rtotal+= (this.nowPlaying[i][1] - this.nowPlaying[i][0] + 1);
            }

            // Pick a random one
            var r = Math.floor((Math.random() * rtotal));

            // find the appropriate range it belongs in
            for (var i=0; i<this.nowPlaying.length; i++){
                var range = this.nowPlaying[i][1] - this.nowPlaying[i][0] + 1;
                if (r > range) {
                    r-= range;
                } else {
                    // calculate the correct id via the range offset
                    var index = r + this.nowPlaying[i][0];
                    id = DATA.library[this.libkey].f.files[index]._id;
                    break;
                }
            }
            count++;
        } while(count < 1000 && this.playHistory.indexOf(id) != -1);
        return id;
    };

    shuffle() {
        return this.isShuffle = !this.isShuffle;
    };

    repeat() {
        return this.isRepeat = !this.isRepeat;
    };

    show() {
        if ($(this.parent).has(this.type).length != 0) {
            this.self.show();
        }
    };

    hide() {
        this.stop();
        this.isPlaying = false;
    };
}
