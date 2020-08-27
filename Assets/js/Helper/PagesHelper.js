Centauri.Helper.PagesHelper = function($container) {
    let $tops = $(".content-element > .top", $container);

    $tops.each(function() {
        let $top = $(this);

        if(!$top.hasClass("has-init")) {
            $top.addClass("has-init");

            $(".sort", $top).on("mousedown", this, function() {
                let $this = $(this);
                let $top = $this.parent().parent();
                $contentelement = $top.parent();

                $this.toggleClass("btn-primary btn-info");
                Centauri.Helper.VariablesHelper.__isSorting = true;
                Centauri.Helper.VariablesHelper.__sortingElement = $contentelement;
            });

            $top.on("click", this, function() {
                let $this = $(this);
                let $top = $this;

                if($this.hasClass("title")) {
                    $this = $(".button-view .edit", $this);
                }

                $contentelement = $top.parent();

                $contentelement.toggleClass("active");

                if(!Centauri.elExists($(".data > .fields", $contentelement))) {
                    if(Centauri.isUndefined($contentelement.data("loading-state"))) {
                        $(".top .button-view .edit", $contentelement).addClass("center");
                        $(".top .button-view .edit i", $contentelement).addClass("d-none disabled");
                        $(".top .button-view .edit", $contentelement).append("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>");

                        Centauri.Helper.FindFieldsByUidHelper($contentelement, $this);
                    }
                } else {
                    $fields = $contentelement.find(".data > .fields");

                    $fields.slideToggle(function() {
                        $this.toggleClass("btn-primary btn-info");
                    });
                }
            });
        }
    });

    $(document).on("mouseup", this, function() {
        $(".top .sort", $(Centauri.Helper.VariablesHelper.__sortingElement)).toggleClass("btn-primary btn-info");

        Centauri.Helper.VariablesHelper.__isSorting = false;
        Centauri.Helper.VariablesHelper.__sortingElement = null;
    });
};
