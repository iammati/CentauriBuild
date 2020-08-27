Centauri.Events.OnModuleLoadEvent.Models.RegisterActions = () => {
    let $action = $("table#models .actions .action");

    $action.on("click", this, function() {
        let $tr = $(this).parent().parent().parent().parent();

        Centauri.Components.PagesComponent.uid = $(this).attr("data-uid");
        let action = $(this).attr("data-action");

        if(action == "actions-trigger") {
            $(this).toggleClass("active");
        }

        if(action == "models-list") {
            let modelNamespace = $.trim($("td[data-type='namespace']", $tr).text());
            let modelLabel = $.trim($("td[data-type='label']", $tr).text());

            Centauri.fn.Ajax(
                "InlineRecords",
                "list",

                {
                    type: "models",
                    namespace: modelNamespace
                },

                {
                    success: (data) => {
                        Centauri.Components.EditorComponent("show", {
                            id: "ListModels",
                            title: "Models-Editor",

                            size: "fluid",
                            container: "container",
                            html: data,

                            callbacks: {
                                htmlAppended: ($editor) => {
                                    /** Models Search-Filter */
                                    $("input#filter_modelitems", $editor).on("keyup", function(e) {
                                        let value = $(this).val();

                                        if(value != "") {
                                            $(".model", $editor).css("display", "none");

                                            $(".model", $editor).each(function() {
                                                let $item = $(this);
                                                let text = $.trim($item.text());

                                                if(Centauri.strContains(text, value)) {
                                                    $item.css("display", "block");
                                                }
                                            });
                                        } else {
                                            $(".model", $editor).css("display", "block");
                                        }
                                    });

                                    /** Model Edit Function */
                                    $(".model", $editor).each(function() {
                                        let $model = $(this);

                                        $(".top .edit", $model).on("click", this, function() {
                                            let $this = $(this);
                                            let $originModelEl = $this.parent().parent().parent();

                                            if(!Centauri.elExists($("> .bottom", $originModelEl))) {
                                                let namespace = $originModelEl.parent().parent().parent().data("namespace");
                                                let uid = $originModelEl.data("uid");

                                                $(".top .button-view .edit").addClass("center");
                                                $(".top .button-view .edit i", $originModelEl).addClass("d-none disabled");
                                                $(".top .button-view .edit", $originModelEl).append("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>");

                                                Centauri.fn.Ajax(
                                                    "InlineRecords",
                                                    "edit",

                                                    {
                                                        namespace: namespace,
                                                        uid: uid
                                                    },

                                                    {
                                                        success: (data) => {
                                                            $originModelEl.append(data);

                                                            CentauriJS.Utilities.Form.FieldHasValueUtility();

                                                            Centauri.View.ContentElementsView();
                                                            Centauri.Components.CreateNewInlineComponent();
                                                            Centauri.Service.CKEditorInitService();
                                                            Centauri.Listener.DocumentKeyUpListener();

                                                            $(".spinner-grow", $this).remove();
                                                            $("i", $this).removeClass("d-none");

                                                            /** Parent-Models Input Preview */
                                                            $(".models .model .bottom .ci-field > input").on(
                                                                "keydown",
                                                                this,
                                                            function(e) {
                                                                Centauri.Events.EditorComponent.Input.OnKeyUp($(this), e);
                                                            });

                                                            $(".models .model .bottom .ci-field > input").on(
                                                                "keyup",
                                                                this,
                                                            function(e) {
                                                                Centauri.Events.EditorComponent.Input.OnKeyUp($(this), e);
                                                            });


                                                            /** Child-Accordions Input Preview */
                                                            $(".accordions.inline-records .accordion .bottom .ci-field > input").on(
                                                                "keydown",
                                                                this,
                                                            function(e) {
                                                                Centauri.Events.EditorComponent.Input.OnKeyUp($(this), e);
                                                            });

                                                            $(".accordions.inline-records .accordion .bottom .ci-field > input").on(
                                                                "keyup",
                                                                this,
                                                            function(e) {
                                                                Centauri.Events.EditorComponent.Input.OnKeyUp($(this), e);
                                                            });

                                                            setTimeout(() => {
                                                                $("> .bottom", $originModelEl).slideDown(function() {
                                                                    $this.removeClass("center");
                                                                    $this.toggleClass("btn-primary btn-info");
                                                                });
                                                            }, 100);

                                                            $(".bottom > .row button", $originModelEl).each(function() {
                                                                let $btn = $(this);

                                                                $btn.on("click", this, function() {
                                                                    $originModelEl = $(this).parents(".model");

                                                                    let $this = $(this);
                                                                    let trigger = $this.data("trigger");

                                                                    let datas = {
                                                                        trigger: trigger
                                                                    };

                                                                    if(trigger == "saveModelByUid") {
                                                                        let dataFields = Centauri.Helper.FieldsHelper($originModelEl, ".bottom", false);

                                                                        let tableArrData = {};
                                                                        Object.keys(dataFields).forEach((data) => {
                                                                            tableArrData[data] = dataFields[data];
                                                                        });

                                                                        datas["data"] = tableArrData;
                                                                    }

                                                                    Centauri.fn.Ajax(
                                                                        "InlineRecords",
                                                                        trigger,

                                                                        datas,

                                                                        {
                                                                            success: (data) => {
                                                                                data = JSON.parse(data);
                                                                                Centauri.Notify(data.type, data.title, data.description);
                                                                                $(".models .title s").remove();
                                                                            }
                                                                        }
                                                                    );
                                                                });
                                                            });
                                                        }
                                                    }
                                                );
                                            } else {
                                                $("> .bottom", $originModelEl).slideToggle(function() {
                                                    $this.toggleClass("btn-primary btn-info");
                                                    $this.removeClass("center");
                                                });
                                            }
                                        });
                                    });
                                },

                                save: (formData) => {
                                    console.log(formData);
                                }
                            }
                        });
                    }
                }
            );
        }
    });
};
