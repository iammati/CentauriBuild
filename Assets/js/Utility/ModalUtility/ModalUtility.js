Centauri.Utility.ModalUtility = (title, description, options, callbacks) => {
    let html = "";
    let addHTMLFn = Centauri.Utility.ModalUtility.addHTML;

    let id = "modal";
    let modalSize = "";
    let closeclass = "danger";
    let saveclass = "success";

    let isDialog = true;
    let closeOnSave = true;
    let cached = true;
    let search = false;
    let layout = "";

    if(Centauri.isNotUndefined(options)) {
        if(Centauri.isNotUndefined(options.id)) {
            id = "-" + options.id;
        }

        if(Centauri.isNotUndefined(options.cached)) {
            cached = options.cached;
        }

        if(Centauri.isNotUndefined(options.size)) {
            modalSize = " modal-" + options.size;
        }
        if(Centauri.isNotUndefined(options.isDialog)) {
            isDialog = options.isDialog;
        }
        if(Centauri.isNotUndefined(options.closeOnSave)) {
            closeOnSave = options.closeOnSave;
        }

        if(Centauri.isNotUndefined(options.close)) {
            if(Centauri.isNotUndefined(options.close.class)) {
                closeclass = options.close.class;
            }
        }

        if(Centauri.isNotUndefined(options.save)) {
            if(Centauri.isNotUndefined(options.save.class)) {
                saveclass = options.save.class;
            }
        }

        if(Centauri.isNotUndefined(options.search)) {
            search = options.search;
        }

        if(Centauri.isNotUndefined(options.layout)) {
            layout = " layout-" + options.layout;
        }
    }

    let _showingCached = false;
    if(Centauri.elExists($("#modal" + id)) && cached) {
        _showingCached = true;
        Centauri.Modal($("#modal" + id), "show");

        if(Centauri.isNotUndefined(callbacks)) {
            if(Centauri.isNotUndefined(callbacks.showingCached)) {
                callbacks.showingCached();
            }
        }
    }

    html = "<div class='modal fade" + (!isDialog ? " layout-default" : layout) + "' id='modal" + id + "' tabindex='-1' role='dialog' aria-labelledby='modal" + id + "-label' aria-hidden='true'>|</div>";
    html = addHTMLFn(html, "<div class='modal-dialog" + modalSize + "' role='document'>|</div>");
    html = addHTMLFn(html, "<div class='modal-content'>|</div>");
    html = addHTMLFn(html, "<div class='modal-header'>|</div>&&");
    html = addHTMLFn(html, "<h5 class='modal-title' id='modallabel'>" + title + "</h5>|");    
    html = addHTMLFn(html, "<button type='button' class='close' data-type='close' aria-label='Close'>|</button>");
    html = addHTMLFn(html, "<span aria-hidden='true'>&times;</span>");

    if(search) {
        html = addHTMLFn(html, "<div class='px-3'><div class='ci-field mb-0'><input class='form-control' id='modal_search' /><label for='modal_search'>Search</label></div></div>&&", "&&");
    }

    html = addHTMLFn(html, "<div class='modal-body'>" + description + "</div>&&", "&&");
    html = addHTMLFn(html, "<div class='modal-footer'>|</div>", "&&");
    html = addHTMLFn(html, "<button type='button' data-type='save' class='btn btn-" + saveclass + " waves-effect waves-light mr-3'>" + options.save.label + "</button>&&");
    html = addHTMLFn(html, "<button type='button' data-type='close' class='btn btn-" + closeclass + " waves-effect waves-light'>" + options.close.label + "</button>", "&&");

    if(!_showingCached) {
        $("body").append(html);
        Centauri.Modal();
        CentauriJS.Utilities.Form.FieldHasValueUtility();

        if(search) {
            let events = [
                "keyup",
                "keydown"
            ];

            events.forEach(evt => {
                $("#modal_search").on(evt, this, function() {
                    let val = $(this).val();
                    let length = val.length;

                    $(".modal .modal-body .field").show();

                    if(length != 0) {
                        $(".modal .modal-body .field").each(function() {
                            let text = $.trim($(this).text());

                            if(!text.startsWith(val)) {
                                $(this).hide();
                            }
                        });
                    }
                });
            });
        }
    }

    if(Centauri.isNotUndefined(callbacks)) {
        if(Centauri.isNotUndefined(callbacks.ready)) {
            callbacks.ready();
        }
    }

    $("#modal" + id + " button").off();
    $("#modal" + id + " button").on("click", this, function() {
        let btntype = $(this).data("type");

        if(btntype == "close") {
            Centauri.Modal("close");

            if(Centauri.isNotUndefined(callbacks.close)) {
                callbacks.close();
            }
        }

        if(btntype == "save") {
            if(closeOnSave) {
                Centauri.Modal("close");
            }

            callbacks.save();
        }
    });

    if(_showingCached) {
        return true;
    }

    Centauri.Utility.ModalUtility.Validator($("#modal"));

    // $("#modal" + id + " select.mdb-select.md-form").materialSelect();

    let selectedValue = $("#modal" + id + " select.mdb-select.md-form").val();
    let selectedValueText = $.trim($("#modal" + id + " select option[value='" + selectedValue + "']").text());

    $("#modal" + id + " select.mdb-select.md-form").parent().find("ul > li").each(function() {
        let thisText = $.trim($("span", this).text());

        if(thisText == selectedValueText) {
            $(this).addClass("active selected");
            return;
        }
    });

    /** Giving form fields (e.g. input, selects etc.) unique id & for attributes */
    Centauri.fn.__FormInputFix();

    return true;
};

Centauri.Utility.ModalUtility.addHTML = (crtHTML, html, split = "|") => {
    return (crtHTML.split(split).join(html));
};


/**
 * Example Usage:
 * > Centauri.fn.Modal("Hello...", "...world!", {id: "id", close: {label: "CLOOOSE"}, save: {label: "SAAAAVE"}}, {size: "lg"});
 * with Callback > Centauri.fn.Modal("Hello...", "...world!", {id: "id", close: {label: "Cancel",class: "warning"}, save: {label: "Delete",class: "danger"}}, {save() {}});
 */
Centauri.fn.Modal = (title, description, options, callbacks) => {
    return Centauri.Utility.ModalUtility(title, description, options, callbacks);
};

Centauri.Modal = (arg = null, $this) => {
    if(!Centauri.elExists($this) && Centauri.Utility.ModalUtility.AutofindModalIfNotProvided) {
        $this = $("body > .modal");
    }

    if(Centauri.isNotNull(arg)) {
        if(arg == "show") {
            $this.css("display", "block");
            $this.removeClass("hide");

            setTimeout(() => {
                $this.addClass("show");
            }, 660);
        }

        if(arg == "close") {
            $this.addClass("hide");
            $this.removeClass("show");

            setTimeout(() => {
                $this.remove();
            }, 750);
        }

        if(arg == "hide") {
            $this.addClass("hide");

            setTimeout(() => {
                $this.removeClass("show");
            }, 660);

            setTimeout(() => {
                $this.css("display", "none");
            }, 330);
        }
    } else {
        $this.css("display", "block");
        $this.addClass("hide");

        setTimeout(() => {
            $this.addClass("show");
            $this.removeClass("hide");

            $this.on("click", this, function(e) {
                if(!Centauri.elExists($(e.target).parents($(".modal-dialog")))) {
                    Centauri.Modal("close");
                }
            });
        }, 10);
    }
};

Centauri.Utility.ModalUtility.AutofindModalIfNotProvided = true;
