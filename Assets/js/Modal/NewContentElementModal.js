Centauri.NewContentElementModal = ($container) => {
    $("button.new-content-element", $container).on("click", this, function() {
        let $btn = $(this);
        let action = $(this).data("action");

        if(action == "newContentElement") {
            $btn.css("cursor", "wait");

            let $this = $(this);
            Centauri.NewContentElementModal.UpdateVars($this);

            // sorting = $element.attr("data-sorting");

            // if(Centauri.elExists("#modal-new_contentelement")) {
            //     $("#modal-new_contentelement").modal("show");
            //     $btn.css("cursor", "pointer");
            //     return;
            // }

            Centauri.fn.Ajax(
                "ContentElements",
                "getConfigCCE",

                {},

                {
                    success: (data) => {
                        Centauri.fn.Modal(
                            "New Content Element",

                            data,

                            {
                                id: "new_contentelement",
                                size: "xl",
                                closeOnSave: false,
                                cached: false,
                                isDialog: false,

                                close: {
                                    label: "",
                                    class: "danger fas fa-times fa-lg btn-floating"
                                },

                                save: {
                                    label: "",
                                    class: "primary fas fa-plus fa-lg btn-floating mr-2"
                                }
                            },

                            {
                                ready: () => {
                                    Centauri.NewContentElementModal.UpdateVars($this);
                                    CentauriJS.Components.TabComponent();

                                    $btn.css("cursor", "pointer");
                                    Centauri.Components.CreateNewInlineComponent();
                                },

                                save: () => {
                                    Centauri.NewContentElementModal.UpdateVars($this);

                                    if(Centauri.isNull(Centauri.Helper.ModalHelper.Element)) {
                                        toastr["error"]("Content Elements Error", "Please select any element in order to create one!");
                                        return;
                                    }

                                    let $modal = $("#modal");
                                    $modal.hide();

                                    Centauri.Modal("close");
                                    let datas = Centauri.Helper.FieldsHelper($(Centauri.Helper.ModalHelper.Element), ".bottom");

                                    Centauri.fn.Ajax(
                                        "ContentElements",
                                        "newElement",

                                        {
                                            pid: Centauri.Components.PagesComponent.uid,
                                            ctype: Centauri.Helper.ModalHelper.Element.data("ctype"),
                                            datas: datas,

                                            rowPos: Centauri.NewContentElementModal.rowPos,
                                            colPos: Centauri.NewContentElementModal.colPos,
                                            insert: Centauri.NewContentElementModal.insert,
                                            sorting: Centauri.NewContentElementModal.sorting,
                                            type: Centauri.NewContentElementModal.type,
                                            gridsparent: Centauri.NewContentElementModal.gridsparent,
                                            grids_sorting_rowpos: Centauri.NewContentElementModal.grids_sorting_rowpos,
                                            grids_sorting_colpos: Centauri.NewContentElementModal.grids_sorting_colpos
                                        },

                                        {
                                            success: (data) => {
                                                data = JSON.parse(data);
                                                Centauri.Notify(data.type, data.title, data.description);

                                                Centauri.Helper.findByPidHelper(Centauri.Components.PagesComponent.uid);
                                            }
                                        }
                                    );
                                }
                            }
                        );

                        /**
                         * Initializing CKEditor 5
                         */
                        Centauri.Service.CKEditorInitService();

                        $(".element .top").off("click");

                        $(".element .top").on("click", this, function() {
                            var $this = $(this);
                            var $element = $this.parent();

                            $(Centauri.Helper.ModalHelper.Element).find("> .bottom").slideUp();

                            if(!$(Centauri.Helper.ModalHelper.Element).is($element)) {
                                Centauri.Helper.ModalHelper.Element = $element;
                                $("> .bottom", $element).slideToggle();

                                if(Centauri.isUndefined($element.attr("initialized"))) {
                                    $element.attr("initialized", "true");
                                    Centauri.View.ContentElementsView($element);
                                }
                            } else {
                                Centauri.Helper.ModalHelper.Element = null;
                            }
                        });
                    }
                }
            );
        }
    });
};

Centauri.NewContentElementModal.rowPos = null;
Centauri.NewContentElementModal.colPos = null;
Centauri.NewContentElementModal.sorting = null;

Centauri.NewContentElementModal.$element = null;
Centauri.NewContentElementModal.insert = null;
Centauri.NewContentElementModal.type = null;

Centauri.NewContentElementModal.gridsparent = null;
Centauri.NewContentElementModal.grids_sorting_rowpos = null;
Centauri.NewContentElementModal.grids_sorting_colpos = null;

Centauri.NewContentElementModal.UpdateVars = ($btn) => {
    Centauri.NewContentElementModal.$element = $btn.parent();

    Centauri.NewContentElementModal.rowPos = $btn.parent().parent().attr("data-rowpos");
    Centauri.NewContentElementModal.colPos = $btn.parent().attr("data-colpos");

    Centauri.NewContentElementModal.insert = $btn.attr("data-insert");
    Centauri.NewContentElementModal.type = (Centauri.isNotUndefined($btn.attr("data-type")) ? $btn.attr("data-type") : "");

    let $elementPrev = $btn.prev();
    let $elementNext = $btn.next();

    if(Centauri.elExists($elementPrev)) {
        Centauri.NewContentElementModal.sorting = $elementPrev.attr("data-sorting");
    } else {
        Centauri.NewContentElementModal.sorting = $elementNext.attr("data-sorting");
    }

    if(Centauri.isNull(Centauri.NewContentElementModal.sorting)) {
        console.log("how?");
    }

    if(Centauri.NewContentElementModal.type == "ingrid") {
        Centauri.NewContentElementModal.gridsparent = $btn.attr("data-gridsparent");
        Centauri.NewContentElementModal.grids_sorting_rowpos = $btn.attr("data-grid-sorting-rowpos");
        Centauri.NewContentElementModal.grids_sorting_colpos = $btn.attr("data-grid-sorting-colpos");
    }
};
