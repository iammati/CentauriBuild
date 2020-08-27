Centauri.Events.OnModuleLoadEvent.Models = () => {
    $("#modelsmodule_buttons button").each(function() {
        $button = $(this);

        $button.on("click", this, function() {
            var btnType = $(this).data("button-type");

            if(btnType == "create") {
                Centauri.fn.Ajax(
                    "Models",
                    "getModelConfigs",

                    {},

                    {
                        success: (data) => {
                            Centauri.fn.Modal(
                                "New Model",

                                data,

                                {
                                    id: "new_model",
                                    size: "xl",
                                    closeOnSave: false,
                                    isDialog: false,

                                    close: {
                                        label: Centauri__trans.modals.btn_cancel
                                    },

                                    save: {
                                        label: Centauri__trans.modals.btn_create
                                    }
                                },

                                {
                                    ready: () => {
                                        Centauri.View.ContentElementsView();
                                    },

                                    save: () => {
                                        if(Centauri.isNull(Centauri.Helper.ModalHelper.Element)) {
                                            toastr["error"]("Models Error", "Please select any model in order to create one!");
                                            return;
                                        }

                                        Centauri.Modal("close");
                                        let datas = Centauri.Helper.FieldsHelper($(Centauri.Helper.ModalHelper.Element), ".bottom");

                                        Centauri.fn.Ajax(
                                            "Models",
                                            "newModel",

                                            {
                                                model: Centauri.Helper.ModalHelper.Element.data("model"),
                                                datas: datas
                                            },

                                            {
                                                success: (data) => {
                                                    data = JSON.parse(data);
                                                    Centauri.Notify(data.type, data.title, data.description);

                                                    Centauri.Components.ModulesComponent({
                                                        type: "load",
                                                        module: Centauri.Module
                                                    });
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
     * Module:models Actions
     */
    Centauri.Events.OnModuleLoadEvent.Models.RegisterActions();
};
