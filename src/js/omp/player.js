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
            this.self.linkBtn = $("<input>", {
                type: "button",
                onclick: "",
                value: "direct link"
            });

            this.self.on("ended", function() {
                players[DATA.libkey].next();
            });
        }

        this.self.linkBtn.prependTo(this.parent);
        this.self.shuffleBtn.prependTo(this.parent);
        this.self.nextBtn.prependTo(this.parent);
        this.self.prevBtn.prependTo(this.parent);
        $("<br/>").prependTo(this.parent);
        this.self.prependTo(this.parent);
        this.self.title.prependTo(this.parent);
        this.self.artist.prependTo(this.parent);

        this.nowPlaying = [[0,DATA.library[DATA.libkey].f.files.length-1]];
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
        this.self.linkBtn.attr("onclick", "location.href='" + DATA.APIBASE + "/stream/" + id + "'");
        this.self[0].load();
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
            this.load(id);
            this.current = id;
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
                    index = DATA.library[DATA.libkey].f.lookup[this.current];

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
                id = DATA.library[DATA.libkey].f.files[index]._id;
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
                    index = DATA.library[DATA.libkey].f.lookup[this.current];
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

                id = DATA.library[DATA.libkey].f.files[index]._id;
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
                    id = DATA.library[DATA.libkey].f.files[index]._id;
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
        if (this.self != null) {
            this.self.hide();
        }
        this.isPlaying = false;
    };
}
