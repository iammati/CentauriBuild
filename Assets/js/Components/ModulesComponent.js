Centauri.Components.ModulesComponent = (data) => {
    if(data.type == "init") {
        $("#dashboard #modules .module").each(function() {
            $module = $(this);

            $module.on("click", this, function() {
                let $thismodule = $(this);

                if(Centauri.Components.EditorComponent("isOpen")) {
                    Centauri.fn.Modal(
                        Centauri__trans.modals.areyousure,
                        Centauri__trans.modals.editorcomponent_switch,

                        {
                            id: "areyousure_switch_editorcomponent_to_dashboard",

                            close: {
                                label: Centauri__trans.modals.btn_cancel,
                                class: "warning"
                            },

                            save: {
                                label: Centauri__trans.modals.btn_switch,
                                class: "danger"
                            }
                        },

                        {
                            save() {
                                Centauri.Components.EditorComponent("close");

                                Centauri.Components.ModulesComponent({
                                    type: "switch",
                                    moduleEl: $thismodule
                                });
                            }
                        }
                    );
                } else {
                    Centauri.Components.ModulesComponent({
                        type: "switch",
                        moduleEl: $thismodule
                    });
                }
            });
        });

        setTimeout(() => {
            if(Centauri.elExists("#dashboard #modules .module.active")) {
                $("#dashboard #modules .module.active").trigger("click");
            } else {
                if((location.href + "/" == location.origin + Centauri.Utility.PathsUtility.root + Centauri.Utility.PathsUtility.centauri)) {
                    $("#dashboard #modules .module[data-module-id='" + Centauri.defaultModule + "']").trigger("click");
                }
            }

            Centauri.Events.OnModuleLoadEvent(Centauri.defaultModule);
        }, 333);

        $("#dashboard #user i").on("click", this, function() {
            $("#dashboard #user").toggleClass("active");
            $("#dashboard #user .dropdown-view").slideToggle();
        });
    }

    if(data.type == "switch") {
        $(".overlayer").removeClass("hidden");

        var $module = $(data.moduleEl);
        var moduleID = $module.data("module-id");

        Centauri.fn.Ajax(
            "Modules",
            "show",

            {
                moduleid: moduleID
            },

            {
                success: (data) => {
                    $("#dashboard #modules .module.active").removeClass("active");
                    $module.addClass("active");

                    $(".overlayer").addClass("hidden");
                    $("#content").html(data);

                    Centauri.Events.OnModuleLoadEvent(moduleID);
                },

                error: (data) => {
                    $(".overlayer").addClass("hidden");
                }
            }
        );
    }

    if(data.type == "load") {
        let module = data.module;

        let _ = {
            moduleid: module
        };

        Centauri.fn.Ajax(
            "Modules",
            "show",

            _,

            {
                success: function(sData) {
                    $(".overlayer").addClass("hidden");
                    $("#content").html(sData);

                    Centauri.Events.OnModuleLoadEvent(module);

                    Centauri.DAPLoader.historyPushState = true;

                    if(Centauri.isNotUndefined(data.cb)) {
                        data.cb();
                    }
                },

                error: function(data) {
                    $(".overlayer").addClass("hidden");
                    console.error(data);
                }
            }
        );
    }
};
