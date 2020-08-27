Centauri.Events.OnModuleLoadEvent.Domains.RegisterActions = () => {
    let $action = $("table#domains .actions .action");

    $action.on("click", this, function() {
        $tr = $(this).parent().parent().parent().parent();

        let action = $(this).attr("data-action");

        if(action == "actions-trigger") {
            $(this).toggleClass("active");
        }

        if(action == "domain-edit" || action == "domain-delete") {
            let $tr = $(this).parent().parent().parent();

            let id = $.trim($("[data-type='id']", $tr).text());
            let rootpageuid = $(this).attr("data-rootpageuid");
            let domain = $.trim($("[data-type='domain']", $tr).text());

            if(action == "domain-edit") {
                Centauri.fn.Ajax(
                    "Domains",
                    "findById",

                    {
                        id: id.toLowerCase()
                    },

                    {
                        success: (data) => {
                            data = JSON.parse(data);

                            Centauri.fn.Ajax(
                                "Page",
                                "getRootPages",

                                {},

                                {
                                    success: (data) => {
                                        data = JSON.parse(data);
                                        let rootpages = data;

                                        Centauri.Components.EditorComponent("show", {
                                            id: "EditDomain-" + id,
                                            title: "Domain-Editor",

                                            form: [
                                                {
                                                    id: "rootpageuid",
                                                    type: "custom",
                                                    custom: "select",

                                                    data: {
                                                        selectedOptionValue: rootpageuid,
                                                        label: "Rootpages",
                                                        options: rootpages,
                                                        required: true
                                                    }
                                                },

                                                {
                                                    id: "id",
                                                    label: "ID",
                                                    type: "text",
                                                    value: id,
                                                    extraAttr: "disabled"
                                                },

                                                {
                                                    id: "domain",
                                                    label: "Domain",
                                                    type: "text",
                                                    value: domain,
                                                    required: true
                                                },

                                                {
                                                    id: "pageTitlePrefix",
                                                    label: "Page-Title Prefix",
                                                    type: "text",
                                                    value: data.pageTitlePrefix
                                                },

                                                {
                                                    id: "pageNotFound",
                                                    label: "404 UID",
                                                    type: "text",
                                                    value: data.pageNotFound,
                                                    required: true
                                                }
                                            ],

                                            callbacks: {
                                                save: (formData) => {
                                                    Centauri.fn.Ajax(
                                                        "Domains",
                                                        "edit",

                                                        {
                                                            id: id,
                                                            data: formData
                                                        },

                                                        {
                                                            success: (data) => {
                                                                data = JSON.parse(data);
                                                                Centauri.Notify(data.type, data.title, data.description);

                                                                Centauri.Components.EditorComponent("close");

                                                                Centauri.Components.ModulesComponent({
                                                                    type: "load",
                                                                    module: "domains"
                                                                });
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
                );
            }

            if(action == "domain-delete") {
                Centauri.fn.Modal(
                    Centauri__trans.modals.areyousure,
                    "Do you want to continue deleting this domain-record?",

                    {
                        id: "areyousure_deletedomainrecord",

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
                                "Domains",
                                "delete",

                                {
                                    id: id
                                },

                                {
                                    success: (data) => {
                                        data = JSON.parse(data);
                                        Centauri.Notify(data.type, data.title, data.description);

                                        Centauri.Components.ModulesComponent({
                                            type: "load",
                                            module: "domains"
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    });
};
