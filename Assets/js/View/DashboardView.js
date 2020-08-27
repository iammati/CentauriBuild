Centauri.View.DashboardView = () => {
    Centauri.View.DashboardView.fn__toggle = function(isOpen = false) {
        if(isOpen) {
            Centauri.Components.EditorComponent("close");

            setTimeout(() => {
                $(".overlayer").removeClass("hidden");
                $(".overlayer").attr("data-closer", "DashboardView");
            }, (Centauri.Components.EditorComponent.TransitionTime + 1));
        } else {
            $(".overlayer").toggleClass("hidden");
            $(".overlayer").attr("data-closer", "DashboardView");
        }

        $(".hamburger").toggleClass("active");
        $("#dashboard").toggleClass("active");
    };

    $(".hamburger").on("click", this, function() {
        if(Centauri.Components.EditorComponent("isOpen")) {
            Centauri.fn.Modal(
                Centauri__trans.modals.areyousure,
                Centauri__trans.EditorComponent.toggleHamburger,

                {
                    id: "areyousure_togglehamburger",

                    close: {
                        label: Centauri__trans.modals.btn_cancel,
                        class: "warning"
                    },

                    save: {
                        label: Centauri__trans.modals.btn_toggle,
                        class: "danger"
                    }
                },

                {
                    save() {
                        Centauri.View.DashboardView.fn__toggle(true);
                        Centauri.Modal("close");
                    }
                }
            );
        } else {
            Centauri.View.DashboardView.fn__toggle();
            Centauri.Modal("close");
        }
    });

    $("#language").on("change", this, function() {
        location.href = Centauri.Utility.PathsUtility.root + Centauri.Utility.PathsUtility.centauri + Centauri.Utility.PathsUtility.action + "Backend/language/" + $("#language").val();
    });
};
