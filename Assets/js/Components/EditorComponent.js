Centauri.Components.EditorComponent = (type, data) => {
    let lastOpenedId = Centauri.Components.EditorComponent.LastOpenedId;
    let isSameAsLastOpened = false;

    if(Centauri.isNotUndefined(data) && (Centauri.isNotUndefined(data.title))) {
        if(lastOpenedId == data.title) {
            isSameAsLastOpened = true;
        }

        Centauri.Components.EditorComponent.LastOpenedId = data.title;
    }

    $editor = $("#editor");

    if(type == "show") {
        if(!isSameAsLastOpened) {
            Centauri.Components.EditorComponent("clear", {
                forceClear: true
            });
        }

        Centauri.Helper.VariablesHelper.__EditorComponentIsOpen = true;
        Centauri.Components.EditorComponent.FormData = null;
        Centauri.Components.EditorComponent.ButtonsInitialized = false;

        if(Centauri.isNotUndefined(data.size)) {
            $editor.attr("class", "active " + data.size);
            Centauri.Components.EditorComponent.Size = data.size;
        }

        let crtID   = $editor.attr("data-id");
        let id      = data.id,
            title   = data.title;

        let options = {
            closeOnSave: true,
            htmlAndFields: false
        };

        if(Centauri.isNotNull(data.options)) {
            $.each(data.options, (key, value) => {
                options[key] = value;
            });
        }

        $(".top > p", $editor).html(title);

        if(!Centauri.elExists($("> .bottom > form", $editor))) {
            $(".bottom", $editor).append("<form method='POST'></form>");
        }

        if(crtID != id) {
            $editor.attr("data-id", id);

            $(".bottom > form", $editor).empty();

            $(".bottom > .container:not([data-content])", $editor).remove();

            if(Centauri.isNotUndefined(data.html)) {
                if(Centauri.isNotUndefined(data.container)) {
                    $(".bottom", $editor).empty().append("<div class='" + data.container + "'>" + data.html + "</div>");
                } else {
                    $(".bottom", $editor).empty().append(data.html);
                }

                Centauri.Events.EditorComponent.Callbacks.HtmlAppended();

                if(Centauri.isNotUndefined(data.callbacks.htmlAppended)) {
                    data.callbacks.htmlAppended();
                }
            } else {
                if(Centauri.isNotUndefined(data.tabs)) {
                    // $("form", $editor).remove();

                    let tabHTML = "<ul class='nav nav-tabs' id='editorcomponent-tabs' role='tablist'>{LIS}</ul>";
                        tabHTML += "<div class='tab-content card pt-5'>{TABPANES}</div>";

                    let tabLIS = "";
                    let tabPanes = "";

                    let tabI = 0;
                    $.each(data.tabs, function(index, tab) {
                        let tabPaneId = "editorcomponent-tab-" + tabI;

                        let tabPaneClass = "tab-pane fade show";
                        let isActive = false;

                        if(tabI == 0) {
                            tabPaneClass += " active";
                            isActive = true;
                        }

                        let tabPaneHTML = "<div class='" + tabPaneClass + "' data-tab-id='" + tabPaneId + "' role='tabpanel'>{TABPANEHTML}</div>";

                        if(Centauri.isNotUndefined(tab.html)) {
                            tabPaneHTML = tabPaneHTML.replace("{TABPANEHTML}", tab.html);
                        } else {
                            let formHTML = Centauri.Components.EditorComponent.GetHTMLByFormArray(tab.form, data, "#" + tabPaneId);
                            tabPaneHTML = tabPaneHTML.replace("{TABPANEHTML}", formHTML);
                        }

                        tabLIS += "<li class='nav-item waves-effect waves-light" + (isActive ? " active" : "") + "' data-tab-id='" + tabPaneId + "'>" + tab.title + "</li>";
                        tabPanes += tabPaneHTML;

                        tabI++;
                    });

                    tabHTML = tabHTML.replace("{LIS}", tabLIS);
                    tabHTML = tabHTML.replace("{TABPANES}", tabPanes);

                    $(".bottom > form", $editor).append(tabHTML);

                    CentauriJS.Components.TabComponent();
                    Centauri.Components.EditorComponent.CBsAfterFormRendered(".field", data.callbacks);
                } else {
                    if(Centauri.isNotUndefined(data.form)) {
                        Centauri.Components.EditorComponent.GetHTMLByFormArray(data.form, data);
                        Centauri.Components.EditorComponent.CBsAfterFormRendered("form", data.callbacks);
                    }
                }

                Centauri.Events.EditorComponent.Callbacks.HtmlAppended();
            }
        }

        if(Centauri.isNotUndefined(data.container) && Centauri.isUndefined(data.html)) {
            Centauri.Components.EditorComponent.Container = data.container;

            if(Centauri.isNotUndefined(data.cols)) {
                $(".bottom", $editor).append("<div class='" + data.container + "'><div class='row'></div></div>");
                $row = $("> .bottom > .container > .row", $editor);

                $.each(data.cols, function(index, colObj) {
                    let col = "col";

                    if(Centauri.isNotUndefined(colObj.size)) {
                        col = "col-" + colObj.size;
                    }

                    $row.append("<div class='" + col + "'>" + colObj.html + "</div>");
                });
            } else if(!$editor.find(".bottom ." + data.container).length) {
                $(".bottom", $editor).append("<div class='" + data.container + "'></div>");
            }
        }

        if(!Centauri.Components.EditorComponent.ButtonsInitialized) {
            Centauri.Components.EditorComponent.ButtonsInitialized = true;

            $("button[data-id='save']", $editor).on("click", function() {
                let formValErr = false;
                let $inputs = $("input.error", $editor);

                $inputs.each(function() {
                    let $input = $(this);

                    if(!$input.parent().hasClass("mdb-select")) {
                        formValErr = true;
                        return;
                    }
                });

                if(Centauri.elExists($("input.error:not(.select-dropdown)", $editor)) || formValErr) {
                    Centauri.Notify("error", "Form Validation", "Please fill out all fields!");
                    return;
                } else {
                    let formData = Centauri.Helper.EditorComponentFieldHelper();
                    data.callbacks.save(formData);

                    if(Centauri.isNotUndefined(data.loadModuleAfterSaved)) {
                        Centauri.Components.ModulesComponent({
                            type: "load",
                            module: data.loadModuleAfterSaved
                        });
                    }
                }

                if(
                    Centauri.isNotUndefined(options.closeOnSave) &&
                    (options.closeOnSave)
                ) {
                    Centauri.Components.EditorComponent("close");
                    return;
                }
            });

            $("button[data-id='cancel']", $editor).on("click", function() {
                Centauri.Components.EditorComponent("hide");

                $(".overlayer").addClass("hidden");

                let closer = $(".overlayer").attr("data-closer");
                // Centauri.Events.OnOverlayerHiddenEvent(closer);
                Centauri.Events.OnEditorComponentClosedEvent();

                setTimeout(() => {
                    Centauri.Components.EditorComponent("clear", {
                        forceClear: Centauri.Components.EditorComponent.ClearOnClose
                    });
                }, Centauri.Components.EditorComponent.TransitionTime);

                if(Centauri.isNotUndefined(data.callbacks.cancel)) {
                    data.callbacks.cancel();
                }
            });
        }

        if(Centauri.isNotUndefined(data.callbacks.beforeLoaded)) {
            data.callbacks.beforeLoaded($editor);
        }

        $editor.addClass("active");

        setTimeout(() => {
            $(".overlayer").removeClass("hidden");
            $(".overlayer").attr("data-closer", "EditorComponent");

            if(Centauri.isNotUndefined(data.callbacks.loaded)) {
                data.callbacks.loaded($("." + Centauri.Components.EditorComponent.Container, $editor), (crtID == id));
            }
        }, Centauri.Components.EditorComponent.TransitionTime);

        Centauri.Components.EditorComponent.init();
    }

    if(type == "hide") {
        Centauri.Helper.VariablesHelper.__EditorComponentIsOpen = false;
        $editor.removeClass("active");

        setTimeout(() => {
            $(".overlayer").addClass("hidden");
            $(".overlayer").removeAttr("data-closer");
        }, Centauri.Components.EditorComponent.TransitionTime);
    }

    if(type == "clear") {
        if(
            Centauri.Components.EditorComponent.ClearOnClose
        ||
            (Centauri.isNotUndefined(data) && data.forceClear)
        ) {
            $("form", $editor).empty();
            $editor.removeAttr("data-id");
        }

        $editor.removeClass(Centauri.Components.EditorComponent.Size);

        $("button[data-id]", $editor).off();
        Centauri.Components.EditorComponent.ButtonsInitialized = false;
        Centauri.Components.EditorComponent.FormData = null;

        if(Centauri.Components.EditorComponent.Container) {
            Centauri.Components.EditorComponent.Container = "undefined";

            if(Centauri.Components.EditorComponent.ClearOnClose) {
                $(".bottom > .container", $editor).remove();
            }
        }
    }

    if(type == "close") {
        Centauri.Components.EditorComponent("hide");
        Centauri.Components.EditorComponent("clear", {
            forceClear: true
        });
    }

    if(type == "isOpen") {
        return Centauri.Helper.VariablesHelper.__EditorComponentIsOpen;
    }

    if(type == "hasChanged") {
        return Centauri.Helper.VariablesHelper.__EditorComponentHasChanged;
    }
};

Centauri.Components.EditorComponent.GetHTMLByFormArray = (form, data, formSelector = "form", config = null) => {
    let formHTML = "";

    Centauri.Components.EditorComponent.FormData = form;

    if(Centauri.isNotUndefined(data.callbacks.afterFormInitialized)) {
        data.callbacks.afterFormInitialized($editor);
    }

    $.each(Centauri.Components.EditorComponent.FormData, function(index, inputObj) {
        if(Centauri.isNotUndefined(inputObj)) {
            if(Centauri.isNotUndefined(inputObj[0])) {
                if(Centauri.isNotUndefined(inputObj[0].config)) {
                    let config = inputObj[0];
                    formHTML += (Centauri.isNotUndefined(config["row"]) ? (Centauri.isNotUndefined(config["row"]["title"]) ? "<p" + (Centauri.isNotUndefined(config["row"]["titleClass"]) ? " class='" + config["row"]["titleClass"] + "'" : "") + ">" + config["row"]["title"] + "</p>" : "") + "<div class='row row-wrapper'>" : "") + Centauri.Components.EditorComponent.GetHTMLByFormArray(inputObj, data, formSelector, (Centauri.isNotUndefined(config["row"]) ? config : null)) + (Centauri.isNotUndefined(config["row"]) ? "</div>" : "");
                } else {
                    console.warn("Centauri - EditorComponent: The first array of your FormDatas has to be your config-array!");
                }
            }

            let type = "text";
            let placeholder = "";
            let value = "";
            let extraAttr = "";
            let required = "";
            let label = "";

            if(Centauri.isNotUndefined(inputObj.type)) {
                type = inputObj.type;
            }

            if(Centauri.isNotUndefined(inputObj.placeholder)) {
                placeholder = inputObj.placeholder;
            }

            if(Centauri.isNotUndefined(inputObj.value)) {
                value = inputObj.value;
            }

            if(Centauri.isNotUndefined(inputObj.extraAttr)) {
                extraAttr = " " + inputObj.extraAttr;
            }

            if(Centauri.isNotUndefined(inputObj.required)) {
                if(inputObj.required) {
                    required = " required";
                }
            }

            if(Centauri.isNotUndefined(inputObj.label)) {
                let activeClass = "";

                if(Centauri.isNotNull(value) && (value.length != 0)) {
                    activeClass = " class='active'";
                }

                label = "<label for='" + inputObj.id + "'" + activeClass + ">" + inputObj.label + "</label>";
            }

            let html = "<div class='ci-field'><input class='form-control' type='" + type + "' placeholder='" + placeholder + "' value='" + value + "' id='" + inputObj.id + "'" + extraAttr + required + " />" + label + "</div>";

            if(Centauri.isUndefined(inputObj.id)) {
                html = "";
            }

            if(type == "custom") {
                html = Centauri.Utility.EditorUtility.getCustomHTMLByType(inputObj);
            }

            if(html != "") {
                $(formSelector).append(html);

                if(Centauri.isNotNull(config)) {
                    let colClasses = "";

                    if(Centauri.isNotUndefined(config["row"])) {
                        if(Centauri.isNotUndefined(config["row"]["colClasses"])) {
                            colClasses = config["row"]["colClasses"] + " ";
                        }
                    }

                    if(Centauri.isNotNull(inputObj.colClasses) && Centauri.isNotUndefined(inputObj.colClasses)) {
                        colClasses = inputObj.colClasses + " ";
                    }

                    formHTML += "<div class='" + colClasses + "col'>" + html + "</div>";
                } else {
                    formHTML += html;
                }
            }
        }
    });

    return formHTML;
};

Centauri.Components.EditorComponent.CBsAfterFormRendered = (formSelector = "form", callbacks) => {
    CentauriJS.Utilities.Form.Select();
    CentauriJS.Utilities.Form.FieldHasValueUtility();
    Centauri.Utility.EditorUtility.Validator();
    Centauri.Listener.EditorListener();

    if(Centauri.isNotUndefined(callbacks.htmlAppended)) {
        callbacks.htmlAppended();
    }
};

Centauri.Components.EditorComponent.init = () => {
    // $(".overlayer").on("click", this, function() {
    //     let closer = $(this).attr("data-closer");

    //     if(closer == "EditorComponent") {
    //         setTimeout(() => {
    //             Centauri.Components.EditorComponent("clear", {
    //                 forceClear: true
    //             });
    //         }, Centauri.Components.EditorComponent.TransitionTime);

    //         Centauri.Events.OnOverlayerHiddenEvent(closer);
    //         Centauri.Events.OnEditorComponentClosedEvent();
    //     }
    // });
};

/**
 * Component data
 */
Centauri.Components.EditorComponent.TransitionTime = 660;
Centauri.Components.EditorComponent.Size = null;
Centauri.Components.EditorComponent.Container = "undefined";
Centauri.Components.EditorComponent.ButtonsInitialized = false;
Centauri.Components.EditorComponent.ClearOnClose = true;
Centauri.Components.EditorComponent.FormData = null;
Centauri.Components.EditorComponent.LastOpenedId = null;

/**
 * Variables declared for and as helper
 */
Centauri.Helper.VariablesHelper.__EditorComponentIsOpen = false;
Centauri.Helper.VariablesHelper.__EditorComponentHasChanged = false;
