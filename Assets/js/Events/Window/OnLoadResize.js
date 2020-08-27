Centauri.Events.Window.OnLoadResize = function() {
    Centauri.Events.Window.OnLoadResize.fn__handle = function(type) {
        Centauri.Helper.VariablesHelper.__Width = $(window).outerWidth();
        Centauri.Helper.VariablesHelper.__Height = $(window).outerHeight();

        if(Centauri.Helper.VariablesHelper.__Width < 767) {
            Centauri.Helper.VariablesHelper.__BreakpointView = "sm";
        }

        if(Centauri.Helper.VariablesHelper.__Width >= 768) {
            Centauri.Helper.VariablesHelper.__BreakpointView = "md";
        }

        if(Centauri.Helper.VariablesHelper.__Width >= 992) {
            Centauri.Helper.VariablesHelper.__BreakpointView = "lg";
        }

        if(Centauri.Helper.VariablesHelper.__Width >= 1200) {
            Centauri.Helper.VariablesHelper.__BreakpointView = "xl";
        }

        if(type == "resize") {
            if(
                (
                    Centauri.Helper.VariablesHelper.__BreakpointView == "xl"
                ||
                    Centauri.Helper.VariablesHelper.__BreakpointView == "lg"
                )
            &&
                $(".overlayer").attr("data-closer") == "DashboardView"
            ) {
                $(".overlayer").addClass("hidden");
                Centauri.Events.OnOverlayerHiddenEvent($(".overlayer").attr("data-closer"));
            }
        }
    };

    $(window).on("load", function() {
        Centauri.Events.Window.OnLoadResize.fn__handle("load");
    });

    $(window).on("resize", function() {
        Centauri.Events.Window.OnLoadResize.fn__handle("resize");
    });
};
