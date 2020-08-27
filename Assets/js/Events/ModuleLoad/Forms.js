Centauri.Events.OnModuleLoadEvent.Forms = () => {
    $("#formsmodule_buttons button").each(function() {
        let $button = $(this);

        $button.on("click", this, function() {
            let btnType = $(this).data("button-type");

            if(btnType == "create") {
                Centauri.Components.EditorComponent("show", {
                    id: "CreateNewForm",
                    title: "Forms-Editor - New",

                    form: [
                        {
                            id: "name",
                            label: "Name",
                            type: "text"
                        }
                    ],

                    callbacks: {
                        save: (formData) => {
                            Centauri.fn.Ajax(
                                "Forms",
                                "create",

                                formData,

                                {
                                    success: (data) => {
                                        data = JSON.parse(data);
                                        Centauri.Notify(data);
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
     * Module:forms Actions
     */
    Centauri.Events.OnModuleLoadEvent.Forms.RegisterActions();
};
