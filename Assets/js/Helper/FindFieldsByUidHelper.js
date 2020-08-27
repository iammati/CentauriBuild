Centauri.Helper.FindFieldsByUidHelper = ($contentelement, $editBtnElement) => {
    Centauri.fn.Ajax(
        "ContentElements",
        "findFieldsByUid",

        {
            uid: $contentelement.attr("data-uid")
        },

        {
            success: (data) => {
                if(Centauri.elExists($(".data", $contentelement))) {
                    $(".data", $contentelement).remove();
                }

                $(".top .button-view .edit", $contentelement).removeClass("center");
                $(".top .button-view .edit i", $contentelement).removeClass("d-none");
                $(".top .button-view .edit .spinner-grow", $contentelement).remove();

                $(".overlayer").addClass("hidden");

                $contentelement.data("loading-state", "loaded");

                $contentelement.append("<div class='data'></div>");
                $(".data", $contentelement).append(data);

                if($contentelement.data("ctype") == "grids") {
                    $(".data > .fields > .fields", $contentelement).appendTo($(".tab-pane[data-tab-id='grids-tab-ces']"));
                    $(".data > .row", $contentelement).appendTo($(".data > .fields", $contentelement));

                    CentauriJS.Components.TabComponent();
                    CentauriJS.Utilities.Form.Select();
                }

                /** Sorting of Inline-Records */
                if($(".accordions.inline-records:not(.ui-sortable) .accordion", $contentelement).length > 1) {
                    $(".accordions.inline-records:not(.ui-sortable)", $contentelement).sortable({
                        dropOnEmpty: false,
                        cancel: ":input, button, .ck-content, a[role='button'], span, label, .pcr-app, .pcr-color-palette, .pcr-color-chooser, .pcr-color-opacity, .pcr-current-color, .pcr-last-color, img, .nav-tabs",
                        items: ".accordion",

                        update: function(e, ui) {
                            let parent = {
                                el: $(ui.item).parent(),
                                type: $(ui.item).parent().data("type"),
                                parenttype: $(ui.item).parent().data("type-parent")
                            };

                            let uid = parent.el.parents(".content-element").data("uid");

                            let data = [];
                            let $this = $(this);

                            $("> .accordion", parent.el).each(function() {
                                let $record = $(this);

                                let uid = $record.data("uid");
                                let index = $record.index();

                                if(Centauri.isNotNull(uid) && Centauri.isNotNull(index)) {
                                    data.push({
                                        uid: uid,
                                        sorting: index,
                                    });
                                }
                            });

                            Centauri.fn.Ajax(
                                "InlineRecords",
                                "sortRecord",

                                {
                                    uid: uid,
                                    data: data,
                                    type: parent.type,
                                    parenttype: parent.parenttype
                                },

                                {
                                    success: (data) => {
                                        data = JSON.parse(data);
                                        Centauri.Notify(data.type, data.title, data.description);
                                    },

                                    error: (data) => {
                                        $this.sortable("cancel");
                                        Centauri.Notify("error", "Inline-Records Sorting", "An error occurred while trying to sort this element!");
                                    }
                                }
                            );
                        }
                    });
                }

                Centauri.View.ContentElementsView($contentelement);

                Centauri.Components.CreateNewInlineComponent();
                Centauri.Components.AccordionComponent();

                if($contentelement.data("ctype") == "grids") {
                    Centauri.NewContentElementModal();
                }

                CentauriJS.Utilities.Form.Select();
                CentauriJS.Utilities.Form.FieldHasValueUtility();

                /** Initializing CKEditor 5 */
                Centauri.Service.CKEditorInitService();

                /** Initializing ColorPickers */
                CentauriJS.Utilities.Form.Colorpicker();

                /*
                $(".data div[data-renderas='colorpicker']", $contentelement).each(function() {
                    let $_this = $(this);

                    new Pickr({
                        el: ".color-picker",
                        default: "rgba(0, 0, 0, 1)",

                        components: {
                            preview: true,
                            opacity: true,
                            hue: true,

                            interaction: {
                                hex: true,
                                rgba: true,
                                hsla: true,
                                input: true,
                                clear: true,
                                save: true
                            }
                        },

                        onSave: (hsva, instance) => {
                            console.log(instance._root.root);
                            console.log($(instance._root.root));

                            $(instance._root.root).parent().find("> input").val(hsva.toRGBA().toString());
                        }
                    });
                });
                */

                /** Sorting */
                // Centauri.Service.CESortingService();
                Centauri.Events.OnModuleLoadEvent.Pages();

                /** EditorListener */
                Centauri.Listener.EditorListener()

                $(".row button", $contentelement).on("click", this, function() {
                    let $parent = $(this).parent().parent().parent().parent();

                    if($parent.hasClass("data")) {
                        $parent = $parent.parent();
                    }

                    let uid = $parent.data("uid");
                    let trigger = $(this).data("trigger");

                    if(trigger == "saveElementByUid") {
                        let datas = Centauri.Helper.FieldsHelper($(".fields"), ".content-element.active", false);

                        let tempArr = [];
                        let tableInfo = {};
                        let i = 0;

                        Object.keys(datas).forEach((data) => {
                            tempArr.push(datas[data]);
                            tableInfo[i] = data;
                            i++;
                        });

                        let jsonDatas = JSON.stringify(tempArr);

                        Centauri.fn.Ajax(
                            "ContentElements",
                            "saveElementByUid",

                            {
                                uid: uid,
                                datas: jsonDatas,
                                tableInfo: tableInfo
                            },

                            {
                                success: (data) => {
                                    data = JSON.parse(data);
                                    Centauri.Notify(data.type, data.title, data.description);
                                }
                            }
                        );
                    }

                    if(trigger == "hideElementByUid") {
                        let $this = $(this);

                        Centauri.fn.Ajax(
                            "ContentElements",
                            "hideElementByUid",

                            {
                                uid: uid
                            },

                            {
                                success: (data) => {
                                    $parent.toggleClass("hidden");

                                    $this.toggleClass("btn-primary btn-info");
                                    $("i", $this).toggleClass("fa-eye fa-eye-slash");

                                    data = JSON.parse(data);
                                    Centauri.Notify(data.type, data.title, data.description, {
                                        timeOut: 1500
                                    });
                                }
                            }
                        );
                    }

                    if(trigger == "deleteElementByUid") {
                        Centauri.fn.Modal(
                            Centauri__trans.modals.areyousure,
                            "Do you want to continue deleting this element?",

                            {
                                id: "areyousure_deleteelement",

                                close: {
                                    label: Centauri__trans.modals.btn_cancel,
                                    class: "warning"
                                },

                                save: {
                                    label: Centauri__trans.modals.btn_delete,
                                    class: "danger"
                                }
                            },

                            {
                                save() {
                                    Centauri.fn.Ajax(
                                        "ContentElements",
                                        "deleteElementByUid",

                                        {
                                            uid: uid
                                        },

                                        {
                                            success: (data) => {
                                                data = JSON.parse(data);
                                                Centauri.Notify(data.type, data.title, data.description);
                                                Centauri.fn.Ajax.Overlayer = false;
                                                Centauri.Helper.findByPidHelper(Centauri.Components.PagesComponent.uid);
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    }
                });

                setTimeout(() => {
                    $(".data > .fields", $contentelement).slideDown();
                    $editBtnElement.toggleClass("btn-primary btn-info");
                    Centauri.View.ContentElementsView($contentelement);

                    $(".top .button-view .edit i", $contentelement).removeClass("disabled");

                    Centauri.Helper.PagesHelper();
                }, 100);
            },

            complete: (data) => {
                $(".top .button-view .edit", $contentelement).removeClass("center");
                $(".top .button-view .edit i", $contentelement).removeClass("d-none");
                $(".top .button-view .edit .spinner-grow", $contentelement).remove();
            }
        }
    );
};
