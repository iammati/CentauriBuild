Centauri.Events.OnModuleLoadEvent.Pages = () => {
    /**
     * Pagetree
     */
    $("#pagetree div[data-type]").off("click");

    $("#pagetree div[data-type]").each(function() {
        let $this = $(this);

        $this.on("click", this, function(e) {
            e.stopPropagation();
            $this = $(this);

            let $rootpage = null;
            if($this.data("type") != "root") {
                $rootpage = $this.parents(".root").find("> div:first-child");
            }

            let rootpageid = null;
            if(Centauri.isNotNull($rootpage)) {
                rootpageid = $rootpage.data("uid");
            }

            $("#pagetree div.active").removeClass("active");
            $this.addClass("active");

            let uid = $this.data("uid");
            let pid = $this.data("pid");

            Centauri.Components.PagesComponent.uid = uid;

            Centauri.fn.Ajax(
                "Page",
                "findByUid",

                {
                    uid: uid
                },

                {
                    success: (data) => {
                        let page = JSON.parse(data);
                        let flagsrc = "";

                        let module = Centauri.Module;

                        history.pushState(
                            {
                                page: 1
                            },

                            // identifier
                            module,

                            // URI
                            Centauri.Utility.PathsUtility.root + "centauri/" + module// + "/" + uid
                        );

                        Centauri.Helper.findByPidHelper(
                            Centauri.Components.PagesComponent.uid,
                            $("#pagecontent"),
                            rootpageid,
                        () => {
                            Centauri.Events.OnModuleLoadEvent.Pages.RegisterPageDetailButtons();
                        });
                    }
                }
            );
        });
    });

    /**
     * Module:pages Buttons
     */
    $("#module_buttons button").off("click");

    $("#module_buttons button").each(function() {
        $button = $(this);

        $button.on("click", this, function() {
            let btnType = $(this).data("button-type");

            if(btnType == "create") {
                Centauri.fn.Ajax(
                    "Page",
                    "getRootPages",

                    {},

                    {
                        success: (data) => {
                            data = JSON.parse(data);
                            let rootpages = data;

                            Centauri.fn.Ajax(
                                "Page",
                                "getLanguages",

                                {},

                                {
                                    success: (data) => {
                                        data = JSON.parse(data);
                                        let languages = data;

                                        if(languages.length == 0) {
                                            Centauri.Notify("primary", "No languages detected", "Please create a language in order to create (root)pages!", {
                                                timeOut: 10000
                                            });

                                            Centauri.Components.ModulesComponent({
                                                type: "load",
                                                module: "languages"
                                            });
                                        } else {
                                            Centauri.fn.Ajax(
                                                "BackendLayouts",
                                                "findAll",

                                                {},

                                                {
                                                    success: (data) => {
                                                        data = JSON.parse(data);
                                                        let beLayouts = data;

                                                        Centauri.Components.EditorComponent("show", {
                                                            id: "CreateNewPage",
                                                            title: "Page-Editor - New",

                                                            form: [
                                                                {
                                                                    id: "parent",
                                                                    type: "custom",
                                                                    custom: "select",

                                                                    data: {
                                                                        label: "Parent-Page",
                                                                        selectedOptionValue: "1",
                                                                        options: rootpages
                                                                    }
                                                                },

                                                                {
                                                                    id: "language",
                                                                    type: "custom",
                                                                    custom: "select",

                                                                    data: {
                                                                        label: Centauri__trans.global.label_languages,
                                                                        selectedOptionValue: 1,
                                                                        options: languages
                                                                    }
                                                                },

                                                                {
                                                                    id: "title",
                                                                    type: "text",
                                                                    label: Centauri__trans.global.label_title,
                                                                    required: true
                                                                },

                                                                {
                                                                    id: "url",
                                                                    type: "text",
                                                                    label: "URL",
                                                                    required: true
                                                                },
/*
                                                                {
                                                                    id: "page_type",
                                                                    type: "custom",
                                                                    custom: "radio",
                                                                    additionalFieldClasses: "newpage-pagetype",

                                                                    data: {
                                                                        callbacks: {
                                                                            onChange: "Centauri.Events.EditorComponent.Radio.OnClick(this)"
                                                                        },

                                                                        items: [
                                                                            {
                                                                                id: "rootpage",
                                                                                isChecked: true,
                                                                                label: Centauri__trans.EditorComponent.label_rootpage + "?"
                                                                            },

                                                                            {
                                                                                id: "subpage",
                                                                                label: Centauri__trans.EditorComponent.label_subpage + "?"
                                                                            }
                                                                        ],
                                                                    }
                                                                },
*/

                                                                {
                                                                    id: "page_type",
                                                                    type: "custom",
                                                                    custom: "select",

                                                                    data: {
                                                                        selectedOptionValue: "page",
                                                                        label: "Page-Type",
                                                                        options: [
                                                                            {
                                                                                name: "Page",
                                                                                value: "page"
                                                                            },

                                                                            {
                                                                                name: "Root-Page",
                                                                                value: "rootpage"
                                                                            },

                                                                            {
                                                                                name: "Storage",
                                                                                value: "storage"
                                                                            }
                                                                        ]
                                                                    }
                                                                },

                                                                {
                                                                    id: "be_layout",
                                                                    type: "custom",
                                                                    custom: "select",

                                                                    data: {
                                                                        label: "Backend-Layout",
                                                                        selectedOptionValue: "default",
                                                                        options: beLayouts
                                                                    }
                                                                }
                                                            ],

                                                            callbacks: {
                                                                loadModuleAfterSaved: "languages",

                                                                beforeLoaded: ($editor) => {
                                                                    if(rootpages.length == 0) {
                                                                        $("#is_rootpage", $editor).prop("checked", true);
                                                                        $("#is_rootpage", $editor).attr("disabled", " ");
                                                                        $("form .field #language", $editor).parent().parent().removeAttr("style");
                                                                        $("form .field #parent", $editor).parent().parent().attr("style", "display: none!important;");
                                                                    }
                                                                },

                                                                save: (formData) => {
                                                                    Centauri.fn.Ajax.Overlayer = false;

                                                                    let _formData = JSON.parse(formData);

                                                                    if($("#parent-init").parent().css("display") == "none") {
                                                                        $.each(_formData, (index, value) => {
                                                                            if(index == "parent") {
                                                                                _formData[index] = undefined;
                                                                            }
                                                                        });
                                                                    }

                                                                    formData = JSON.stringify(_formData);

                                                                    Centauri.fn.Ajax(
                                                                        "Page",
                                                                        "newPage",

                                                                        {
                                                                            data: formData
                                                                        },

                                                                        {
                                                                            success: (data) => {
                                                                                data = JSON.parse(data);
                                                                                Centauri.Notify(data.type, data.title, data.description);

                                                                                Centauri.Components.EditorComponent("clear");
                                                                                Centauri.Components.EditorComponent("hide");

                                                                                Centauri.Components.ModulesComponent({
                                                                                    type: "load",
                                                                                    module: "pages"
                                                                                });
                                                                            },

                                                                            complete: () => {
                                                                                Centauri.fn.Ajax.Overlayer = true;
                                                                            }
                                                                        }
                                                                    );
                                                                }//,cancel: () => {}
                                                            }
                                                        });
                                                    },

                                                    error: (data) => {
                                                        console.error(data);
                                                    }
                                                }
                                            );
                                        }
                                    },

                                    error: function(data) {
                                        console.error(data);
                                    }
                                }
                            );
                        }
                    }
                );
            }
        });
    });

    /**
     * Module:pages Actions
     */
    Centauri.Events.OnModuleLoadEvent.Pages.RegisterActions();
};

Centauri.Events.OnModuleLoadEvent.Pages.RegisterPageDetailButtons = () => {
    $("#pagecontent .right button").each(function() {
        let $btn = $(this);

        $btn.on("click", this, function() {
            let action = $(this).data("action");
            let uid = Centauri.Components.PagesComponent.uid;

            if(action == "edit") {
                Centauri.fn.Ajax(
                    "Page",
                    "findByUid",

                    {
                        uid: uid
                    },

                    {
                        success: (data) => {
                            let page = JSON.parse(data);
                            let flagsrc = "";

                            Centauri.fn.Ajax(
                                "BackendLayouts",
                                "findAll",

                                {},

                                {
                                    success: (data) => {
                                        data = JSON.parse(data);
                                        let beLayouts = data;

                                        Centauri.Components.EditorComponent("show", {
                                            id: "EditPage-" + Centauri.Components.PagesComponent.uid,
                                            title: "Page-Editor - Edit",
                                            size: "fluid-lg",

                                            tabs: [
                                                {
                                                    title: Centauri__trans.global.label_page,

                                                    form: [
                                                        {
                                                            id: "title",
                                                            label: Centauri__trans.global.label_title,
                                                            type: "text",
                                                            value: page.title,
                                                            required: true
                                                        },

                                                        {
                                                            id: "slugs",
                                                            label: "Slug",
                                                            type: "text",
                                                            value: page.slugs
                                                        },

                                                        {
                                                            id: "backend_layout",
                                                            type: "custom",
                                                            custom: "select",

                                                            data: {
                                                                selectedOptionValue: page.backend_layout,
                                                                label: "Choose a layout",
                                                                options: beLayouts
                                                            }
                                                        },

                                                        {
                                                            id: "hidden_inpagetree",
                                                            type: "custom",
                                                            custom: "switch",

                                                            data: {
                                                                label: Centauri__trans.others.EditorComponent.hidden_inpagetree,
                                                                isChecked: page.hidden_inpagetree
                                                            }
                                                        }
                                                    ]
                                                },

                                                {
                                                    title: "SEO",

                                                    form: [
                                                        {
                                                            id: "seo_keywords",
                                                            label: Centauri__trans.EditorComponent.SEO.keywords,
                                                            type: "text",
                                                            value: page.seo_keywords
                                                        },

                                                        {
                                                            id: "seo_description",
                                                            type: "custom",
                                                            custom: "textarea",

                                                            data: {
                                                                label: Centauri__trans.global.label_description,
                                                                value: page.seo_description,
                                                                required: true
                                                            }
                                                        },

                                                        [
                                                            {
                                                                config: true,

                                                                row: {
                                                                    title: "Robots"
                                                                }
                                                            },

                                                            {
                                                                id: "seo_robots_indexpage",
                                                                type: "custom",
                                                                custom: "switch",

                                                                data: {
                                                                    label: Centauri__trans.EditorComponent.SEO.robots_indexpage,
                                                                    isChecked: page.seo_robots_indexpage
                                                                }
                                                            },

                                                            {
                                                                id: "seo_robots_followpage",
                                                                type: "custom",
                                                                custom: "switch",

                                                                data: {
                                                                    label: Centauri__trans.EditorComponent.SEO.robots_followpage,
                                                                    isChecked: page.seo_robots_followpage
                                                                }
                                                            }
                                                        ]
                                                    ]
                                                },

                                                {
                                                    title: "Info",

                                                    form: [
                                                        [
                                                            {
                                                                config: true,

                                                                row: {
                                                                    title: "Page-Infos",
                                                                    titleClass: "title",
                                                                    colClasses: "col-lg-6"
                                                                }
                                                            },

                                                            {
                                                                id: "language",
                                                                type: "custom",
                                                                custom: "image",
                                                                colClasses: "col-lg-12",

                                                                data: {
                                                                    label: Centauri__trans.global.label_language,
                                                                    src: flagsrc
                                                                }
                                                            },

                                                            {
                                                                id: "uid",
                                                                label: "UID",
                                                                type: "text",
                                                                value: page.uid,
                                                                extraAttr: "disabled"
                                                            },

                                                            {
                                                                id: "pid",
                                                                label: "PID",
                                                                type: "text",
                                                                value: page.pid,
                                                                extraAttr: "disabled"
                                                            },

                                                            {
                                                                id: "created_at",
                                                                label: Centauri__trans.global.label_createdat,
                                                                type: "text",
                                                                value: page.created_at,
                                                                extraAttr: "disabled"
                                                            },

                                                            {
                                                                id: "updated_at",
                                                                label: Centauri__trans.global.label_modifiedat,
                                                                type: "text",
                                                                value: page.updated_at,
                                                                extraAttr: "disabled"
                                                            }
                                                        ]
                                                    ]
                                                }
                                            ],

                                            callbacks: {
                                                save: (formData) => {
                                                    Centauri.fn.Ajax(
                                                        "Page",
                                                        "updatePage",

                                                        {
                                                            uid: Centauri.Components.PagesComponent.uid,
                                                            data: formData
                                                        },

                                                        {
                                                            success: (data) => {
                                                                data = JSON.parse(data);
                                                                Centauri.Notify(data.type, data.title, data.description);

                                                                Centauri.Components.EditorComponent("close");

                                                                // Centauri.Components.ModulesComponent({
                                                                //     type: "load",
                                                                //     module: "pages"
                                                                // });
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

            if(action == "sort") {
                if(Centauri.Helper.VariablesHelper.__CE_SORTING) {
                    Centauri.Helper.VariablesHelper.__CE_SORTING = false;
                    Centauri.Service.CESortingService(false);
                    $("i", $(this)).css("transform", "none");
                } else {
                    Centauri.Helper.VariablesHelper.__CE_SORTING = true;
                    Centauri.Service.CESortingService();
                    $("i", $(this)).css("transform", "rotate(135deg)");
                }
            }

            if(action == "delete") {
                Centauri.fn.Modal(
                    Centauri__trans.modals.deletePage_title,
                    Centauri__trans.modals.deletePage_body,

                    {
                        id: "areyousure_deletepage",

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
                                "Page",
                                "deletePage",

                                {
                                    uid: Centauri.Components.PagesComponent.uid
                                },

                                {
                                    success: function(data) {
                                        data = JSON.parse(data);

                                        if(Centauri.isNotUndefined(data.request)) {
                                            Centauri.Notify("error", "An error occurred!", "Please contact an administrator to handle this internal error.\nError: " + data.request, {
                                                timeOut: -1
                                            });
                                        } else {
                                            Centauri.Notify(data.type, data.title, data.description);
                                        }

                                        Centauri.Components.ModulesComponent({
                                            type: "load",
                                            module: "pages"
                                        });
                                    },

                                    error: function(data) {
                                        console.error(data);
                                    }
                                }
                            );
                        }
                    }
                );
            }
        });
    });
};
