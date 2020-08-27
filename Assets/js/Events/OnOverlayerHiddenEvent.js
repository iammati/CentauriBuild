Centauri.Events.OnOverlayerHiddenEvent = (closer) => {
    let $overlayer = $(".overlayer");

    if($overlayer.hasClass("overlay-modal")) {
        $overlayer.removeClass("overlay-modal");
    }

    let hide = true;

    switch(closer) {
        case "EditorComponent":
            Centauri.Components.EditorComponent("hide");
            break;

        case "DashboardView":
            $("#dashboard, .hamburger").removeClass("active");
            break;

        case "FileSelectorComponent":
            $("#file-selector").addClass("inactive");
            $overlayer.attr("data-closer", "EditorComponent");
            break;

        default:
            hide = false;
            break;
    }

    if(hide) {
        $overlayer.addClass("hidden");
    }
};
