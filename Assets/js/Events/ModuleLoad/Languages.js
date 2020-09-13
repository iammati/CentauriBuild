Centauri.Events.OnModuleLoadEvent.Languages = () => {
    $("table#languages tr").on("dblclick", this, function() {
        $(".actions .action[data-action='language-edit']", $(this)).trigger("click");
    });

    $("#module_buttons button").each(function() {
        $button = $(this);

        $button.on("click", this, function() {
            var btnType = $(this).data("button-type");

            if(btnType == "create") {
                Centauri.Components.EditorComponent("show", {
                    id: "CreateNewPage",
                    title: "Language-Editor - New",

                    form: [
                        {
                            id: "title",
                            type: "text",
                            label: Centauri__trans.global.label_title,
                            required: true
                        },

                        {
                            id: "langcode",
                            type: "text",
                            label: "Lang-Code",
                            required: true
                        },

                        {
                            id: "slug",
                            type: "text",
                            label: "Slug",
                            required: true
                        }
                    ],

                    callbacks: {
                        loadModuleAfterSaved: "languages",

                        save: function(data) {
                            Centauri.Helper.VariablesHelper.__closeAjax = true;

                            Centauri.fn.Ajax(
                                "Language",
                                "newLanguage",

                                {
                                    data: data
                                },

                                {
                                    success: function(data) {
                                        data = JSON.parse(data);
                                        Centauri.Notify(data.type, data.title, data.description);

                                        Centauri.Components.ModulesComponent({
                                            type: "load",
                                            module: "languages"
                                        });
                                    },

                                    error: function(data) {
                                        console.error(data);
                                    }
                                }
                            );
                        }
                    }
                });
            }
        });
    });

    /**
     * Module:languages Actions
     */
    Centauri.Events.OnModuleLoadEvent.Languages.RegisterActions();
};
