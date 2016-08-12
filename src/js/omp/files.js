
/*
 * Generic file display utilities
 *
 * Unfortunate coupling with omp/players.js to modify
 * playHistory and nowPlaying and whatnot.
 *
 * Possible refactoring task to remove this coupling
 *
 * @author ojourmel
 */

class Files {

    constructor(parent) {
        this.parent = parent;
    };

    init(type) {
        this.updateFileNav();
        this.updateFileList(type, null);
    };

    initFileNav() {
        var nav = $("<div>", {
            "class":"omp-file-nav"
        });

        nav.appendTo(this.parent);
        return nav;
    };

    initFileList() {
        var nav = $("<div>", {
            "class":"omp-file-list"
        });

        nav.appendTo(this.parent);
        return nav;
    };

    /*
     * Build group hierarchy represented by nested ul elements
     *
     */
    updateFileNav() {
        var nav = $(".omp-file-nav");
        if (! nav.length) {
            nav = this.initFileNav();
        } else {
            nav = nav[0];
        }

        // For usage in the onclick functions
        var that = this;

        $("<li>", {
            id: "all",
            text: "All",
            class: "hover cursorclick",
            // Hard code "all" functionality
            click: function() {
                that.updateFileList("list", null)
                players[DATA.libkey].nowPlaying = [[0,DATA.library[DATA.libkey].f.files.length-1]];
                players[DATA.libkey].playHistory = [];
                players[DATA.libkey].playHistoryIndex = 0;
            }
        }).appendTo(
            $("<ul>").appendTo(nav)
        );

        // First group gets ul directly on nav
        if (DATA.library[DATA.libkey].f.group.length > 0) {
            var p = $("<ul>", {
                "class": DATA.library[DATA.libkey].f.group[0]
            });
            p.appendTo(nav);
            nav = p;
        }

        // Group iteration
        for (var i=0; i<DATA.library[DATA.libkey].f.group.length; i++) {
            var g = DATA.library[DATA.libkey].f.group[i];


            // Items in a group
            var gitems = Object.keys(DATA.library[DATA.libkey].f.index[g]);
            for (var j=0; j<gitems.length; j++) {
                var iname = gitems[j];

                // Number of contiguous files in item in group
                for (var n=0; n<DATA.library[DATA.libkey].f.index[g][iname].length; n++) {

                    // (ab)use the first line of html text on target as a key into the json data
                    var item = $("<li>", {
                        "class": iname.replace(/[^\w]/g, "") + " hover cursorclick",
                        text: iname,
                        click: function (e) {
                                var group = e.target.parentNode.className;
                                var name = e.target.innerText.split("\n")[0];
                                that.updateFileList("list", DATA.library[DATA.libkey].f.index[group][name]);
                                players[DATA.libkey].nowPlaying = DATA.library[DATA.libkey].f.index[group][name];
                                players[DATA.libkey].playHistory = [];
                                players[DATA.libkey].playHistoryIndex = 0;
                                return false;
                            }
                        });

                    // The last group doesn't get another ul child
                    if (i < DATA.library[DATA.libkey].f.group.length-1) {
                        var p = $("<ul>", {
                            "class": DATA.library[DATA.libkey].f.group[i+1]
                        });
                        p.appendTo(item);
                    }

                    // First level appends to nav
                    if (i == 0) {
                        item.appendTo(nav);
                    // Other level go up one - check index positions
                    } else {

                        // Look at nth [start,end] pair
                        var itemstart = DATA.library[DATA.libkey].f.index[g][iname][n][0];
                        var itemend = DATA.library[DATA.libkey].f.index[g][iname][n][1];

                        // use json object to get parent group items
                        var pargroup = DATA.library[DATA.libkey].f.group[i-1]
                        var parlist = DATA.library[DATA.libkey].f.index[pargroup];

                        // get the parents. (keys in the parlist)
                        var parkeys = Object.keys(parlist);
                        for (var x=0; x<parkeys.length; x++) {
                            var paritem = parlist[parkeys[x]];

                            // for each tuple that parent has, find indexes that
                            // are contained in the tuple, or indexes that span more than the tuple
                            for (var y=0; y<paritem.length; y++){

                                if ((itemstart >= paritem[y][0] && itemstart <= paritem[y][1]) ||
                                    (itemend >= paritem[y][0] && itemend <= paritem[y][1]) ||
                                    (itemstart <= paritem[y][0] && itemend >= paritem[y][1])) {

                                    // HACK: Strip non alphanumerics for CSS class search
                                    var insert = $("." + parkeys[x].replace(/[^\w]/g, "") + ">ul");

                                    // if the parent item appears more than once, use the tuple count (y)
                                    // to insert this item into the correct one.
                                    item.clone().appendTo(insert[y]);
                                }
                            }
                        }
                    }
                }
            }
        }
    };


    /*
     * @params
     *  type: list, details, thumbnail, strip, fullscreen (slider)
     *  indexes: [[a,b], [c,d], ..., [x,y]]
     *
     */
    updateFileList(type, indexes) {
        var list = $(".omp-file-list");
        if (list.length == 0) {
            list = this.initFileList();
        } else {
            list = list[0];
        }

        if (type === "list") {

            var p = $(".files");
            if (p.length != 0) {
                p.remove();
            }
            var p = $("<ul>", {
                "class": "files"
            });
            p.appendTo(list);

            if (! indexes) {
                indexes = [[0,DATA.library[DATA.libkey].f.files.length-1]];
            }

            for (var x=0; x<indexes.length; x++) {
                for (var i=indexes[x][0]; i<=indexes[x][1]; i++) {
                    if (i<DATA.library[DATA.libkey].f.files.length) {
                        var f = DATA.library[DATA.libkey].f.files[i];

                        var display;
                        if ( f.title ) {
                            display = f.title;
                        } else {
                            display = f.name;
                        }

                        // Clicking a file will trigger a play history update
                        // Remove "future" play history data with a splice
                        // Make this new item the most recent played thing.
                        $("<li>", {
                            id: f._id,
                            text: display,
                            "class": "hover cursorclick",
                            click: function(id) {
                                return function () {
                                    players[DATA.libkey].playHistoryIndex++;
                                    players[DATA.libkey].playHistory.splice(players[DATA.libkey].playHistoryIndex, players[DATA.libkey].playHistory.length);
                                    players[DATA.libkey].playHistory.push(id);
                                    players[DATA.libkey].play(id);
                                }
                            }(f._id)
                        }).appendTo(p);
                    } else {
                        logger("files.js: attempted index " + i + " on library " + DATA.libkey + " out of range");
                    }
                }
            }
        } else {
            logger("files.js: file list type " + type + " is not supported");
        }
    };
};
