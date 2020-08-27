CentauriJS.Components.TabComponent = () => {
    $(".nav-tabs").each(function() {
        let $this = $(this);

        $("li.nav-item", $this).each(function() {
            let $li = $(this);

            $li.off("click");

            $li.on("click", this, function(e) {
                e.preventDefault();

                $(this).parent().find("li.nav-item.active").removeClass("active");
                $(this).addClass("active");

                let $tabcontent = $(this).parent().parent().find(".tab-content");
                $(".tab-pane:not([data-tab-id='" + $li.data("tab-id") + "'])", $tabcontent).hide();
                $(".tab-pane[data-tab-id='" + $li.data("tab-id") + "']", $tabcontent).show();
            });
        });
    });
};
