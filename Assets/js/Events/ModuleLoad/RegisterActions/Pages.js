Centauri.Events.OnModuleLoadEvent.Pages.RegisterActions = () => {
    let $action = $("table#pages .actions .action");

    $action.on("click", this, function() {
        let $tr = $(this).parent().parent().parent().parent();

        Centauri.Components.PagesComponent.uid = $(this).attr("data-uid");
        let action = $(this).attr("data-action");

        Centauri.fn.Ajax(
            "Page",
            "findByUid",

            {
                uid: Centauri.Components.PagesComponent.uid
            },

            {
                success: (data) => {
                    let page = JSON.parse(data);
                    let flagsrc = $.trim($("td[data-type='lid'] img", $tr).attr("src"));

                    if(action == "actions-trigger") {
                        $(this).toggleClass("active");
                    }

                    // old page table action buttons
                    if(action == "page-translations") {
                        Centauri.fn.Ajax(
                            "Page",
                            "getTranslateableLanguages",

                            {
                                uid: Centauri.Components.PagesComponent.uid
                            },

                            {
                                success: (data) => {
                                    data = JSON.parse(data);
                                    let languages = data;

                                    Centauri.Components.EditorComponent("show", {
                                        id: "TranslatePage-" + Centauri.Components.PagesComponent.uid,
                                        title: "Page-Editor - Translation",

                                        form: [
                                            {
                                                id: "language",
                                                type: "custom",
                                                custom: "select",

                                                data: {
                                                    label: Centauri__trans.global.label_language,
                                                    options: languages
                                                }
                                            },

                                            {
                                                id: "copyelements",
                                                type: "custom",
                                                custom: "checkbox",

                                                data: {
                                                    label: "Copy elements?",
                                                    isChecked: true
                                                }
                                            },

                                            {
                                                id: "title",
                                                label: Centauri__trans.global.label_title,
                                                type: "text",
                                                value: title,
                                                required: true
                                            },

                                            {
                                                id: "url",
                                                label: "URL",
                                                type: "text",
                                                value: url,
                                                required: true
                                            }
                                        ],

                                        callbacks: {
                                            save: () => {
                                                var lid = $("#language", $editor).val();
                                                var title = $("#title", $editor).val();
                                                var url = $("#url", $editor).val();

                                                Centauri.fn.Ajax(
                                                    "Page",
                                                    "createTranslatedPage",

                                                    {
                                                        uid: Centauri.Components.PagesComponent.uid,
                                                        lid: lid,
                                                        title: title,
                                                        url: url
                                                    },

                                                    {
                                                        success: (data) => {
                                                            console.log(data);
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    });
                                }
                            }
                        );
                    }
                }
            }
        );
    });
};
