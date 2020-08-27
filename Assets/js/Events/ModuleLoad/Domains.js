Centauri.Events.OnModuleLoadEvent.Domains = () => {
    /**
     * Module:domains Buttons
     */
    $("#domainsmodule_buttons button").each(function() {
        $button = $(this);

        $button.on("click", this, function() {
            var btnType = $(this).data("button-type");

            if(btnType == "create") {
                Centauri.fn.Ajax(
                    "Domains",
                    "showModal",

                    {},

                    {
                        success: (data) => {
                            Centauri.fn.Modal(
                                "New Domain",

                                data,

                                {
                                    id: "new_domain",                
                                    size: "xl",
                                    closeOnSave: false,

                                    close: {
                                        label: Centauri__trans.modals.btn_cancel
                                    },

                                    save: {
                                        label: Centauri__trans.modals.btn_create
                                    }
                                },

                                {
                                    save: () => {
                                        Centauri.Modal("close");

                                        Centauri.fn.Ajax(
                                            "Domains",
                                            "create",

                                            {
                                                id: $("#modal-new_domain #id").val(),
                                                domain: $("#modal-new_domain #domain").val(),
                                                rootpageuid: $("#modal-new_domain #rootpageuid").val()
                                            },

                                            {
                                                success: (data) => {
                                                    data = JSON.parse(data);
                                                    Centauri.Notify(data.type, data.title, data.description);

                                                    Centauri.Components.ModulesComponent({
                                                        type: "load",
                                                        module: Centauri.Module
                                                    });
                                                },

                                                error: function(data) {
                                                    console.error(data);
                                                    $(".overlayer").addClass("hidden");
                                                }
                                            }
                                        );
                                    }
                                }
                            );

                            Centauri.NewModel();

                            Centauri.Service.CKEditorInitService();
                        }
                    }
                );
            }
        });
    });

    /**
     * Module:domains Actions
     */
    Centauri.Events.OnModuleLoadEvent.Domains.RegisterActions();
};
