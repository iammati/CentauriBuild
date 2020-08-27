Centauri.Events.OnModuleLoadEvent = (module) => {
    CentauriJS.Components.RippleEffectComponent();

    $("#dashboard #modules .module.active").removeClass("active");
    $("#dashboard #modules .module[data-module-id='" + module + "']").addClass("active");

    Centauri.Module = module;
    Centauri.Components.PagesComponent(module);

    let splittedTitle = $.trim($("title", $(document.head)).text()).split("»");
    let _moduleName = Centauri.Module;
    let moduleName = (Centauri.isNotUndefined(Centauri__trans.modules[_moduleName]) ? Centauri__trans.modules[_moduleName] : _moduleName.charAt(0).toUpperCase() + _moduleName.slice(1));

    if(Centauri.isUndefined(moduleName)) moduleName = "";
    let title = splittedTitle[0] + "» " + moduleName
    $("title", document.head).text(title);

    /**
     * Initialize a-tags turning into AJAX-calls
     */
    Centauri.Service.ATagAjaxService();

    /**
     * DAPLoader
     */
    if(Centauri.DAPLoader.historyPushState) {
        history.pushState(
            {
                page: 1
            },

            // identifier
            module,

            // URI
            Centauri.Utility.PathsUtility.root + "centauri/" + module
        );
    }

    /**
     * Hamburger-Toggler
     */
    if(
        (
            Centauri.Helper.VariablesHelper.__BreakpointView == "sm" ||
            Centauri.Helper.VariablesHelper.__BreakpointView == "md"
        )
    &&
        $(".overlayer").attr("data-closer") == "DashboardView"
    ) {
        $(".hamburger").trigger("click");
        $(".overlayer").addClass("hidden");
        Centauri.Events.OnOverlayerHiddenEvent($(".overlayer").attr("data-closer"));
    }

    /**
     * Table Search-Filter
     */
    $("#content input#filter").on("keyup", function(e) {
        var value = $(this).val();

        if(value != "") {
            $("table tbody tr").css("display", "none");

            $("table tbody td").each(function() {
                var $td = $(this);

                var text = $.trim($td.text());

                if(Centauri.strContains(text, value)) {
                    $td.parent().css("display", "table-row");
                }
            });
        } else {
            $("table tbody tr").css("display", "table-row");
        }
    });

    /**
     * Refresh Button
     */
    $("#content > section button[data-button-type='refresh']").on("click", function() {
        Centauri.Components.ModulesComponent({
            type: "load",
            module: Centauri.Module
        });
    });

    /**
     * FieldHasValue Utility (for labels listening for value to style the label properly)
     */
    CentauriJS.Utilities.Form.FieldHasValueUtility();

    let nModule = module.charAt(0).toUpperCase() + module.slice(1);

    if(Centauri.isFunction(Centauri.Events.OnModuleLoadEvent[nModule])) {
        Centauri.Events.OnModuleLoadEvent[nModule]();
    } else {
        console.warn("Centauri.Events.OnModuleLoadEvent: Module '" + nModule + "' has not been registered with Centauri.Events.OnModuleLoadEvent." + nModule + " as an own function!");
    }

    /**
     * Actions ellipsis-icon button
     */
    $(".actions > .action[data-action='actions-trigger']").on("click", this, function() {
        $(this).toggleClass("active");
    });
};
