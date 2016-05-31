
/*
 * Generic file display utilities
 *
 * @author ojourmel
 */

class Files {

    constructor(parent) {
        this.parent = parent;
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

                    // HACK: Lookup by class name.
                    //       Strip non alphanumerics to make value a valid class
                    var item = $("<li>",{
                        "class": iname.replace(/[^\w]/g, ""),
                        text: iname,
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

                                    // HACK: Strip non alphanumerics for class search
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
     * @note: indexes is not currently used
     */
    updateFileList(type, indexes) {
        var list = $(".omp-file-list");
        if (list.length == 0) {
            list = this.initFileList();
        } else {
            list = list[0];
        }

        if (type === "list") {
            var p = $("<ul>", {
                "class": "files"
            });
            p.appendTo(list);

            for (var i=0; i<DATA.library[DATA.libkey].f.files.length; i++) {
                var f = DATA.library[DATA.libkey].f.files[i];

                var display;
                if ( f.title ) {
                    display = f.title;
                } else {
                    display = f.name;
                }

                $("<li>", {
                    id:f._id,
                    text: display
                }).appendTo(p);
            }
        } else {
            logger("files.js: file list type " + type + " is not supported");
        }
    };
};
