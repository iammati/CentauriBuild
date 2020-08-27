Centauri.Events.OnModuleLoadEvent.Forms.RegisterActions = () => {
    let $action = $("table#forms .actions .action");

    $action.on("click", this, function() {
        let action = $(this).data("action");
        let uid = $(this).parents("tr").data("uid");

        Centauri.fn.Ajax(
            "Forms",
            action,

            {
                uid: uid
            },

            {
                success: (data) => {
                    let html = data.html;

                    let name = data.form["name"];
                    let formConfig = data.form["config"];

                    if(Centauri.isNotNull(formConfig)) {
                        console.log(formConfig);
                    }

                    Centauri.Components.EditorComponent("show", {
                        id: "EditForm-" + uid,
                        title: "Form-Editor - " + name,

                        html: html,
                        size: "fluid",

                        options: {
                            htmlAndFields: true,
                            closeOnSave: false
                        },

                        callbacks: {
                            htmlAppended: () => {
                                $(".bottom > .p-2", $editor).css("height", "80%");
                            },

                            save: (formData) => {
                                console.table(formData);
                            }
                        }
                    });
                }
            }
        );
    });
};
