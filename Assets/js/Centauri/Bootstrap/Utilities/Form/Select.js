CentauriJS.Utilities.Form.Select = () => {
    $(".ci-select:not(.initialized)").each(function() {
        let $this = $(this);
        let id = $this.attr("id");

        $this.addClass("initialized");

        $this.hide();
        $this.attr("data-id", id);
        $this.attr("id", id + "-init");

        let optionsHtmlStr = "";
        $("option", $this).each(function() {
            let optVal = $(this).attr("value");
            let optTxt = $.trim($(this).text());

            optionsHtmlStr += "<div data-value='" + optVal + "'" + ">" + optTxt + "</div>";
        });

        let selectLabel = "";
        $("<input id='" + id + "' class='ci-select-toggler form-control' type='text' readonly='true' required='false' value='" + selectLabel + "' />").insertAfter($this);
        $("<div class='ci-select' style='display: none;'>" + optionsHtmlStr + "</div>").insertAfter($this);
    });

    $(".ci-select-toggler:not(.initialized)").each(function() {
        let $this = $(this);

        $this.addClass("initialized");

        $this.on("focus", this, function() {
            $("div.ci-select", $(this).parent()).slideDown();
            $("div.ci-select", $(this).parent()).addClass("active");
        });

        $this.on("focusout", this, function() {
            $("div.ci-select", $(this).parent()).slideUp();
            $("div.ci-select", $(this).parent()).removeClass("active");
        });
    });

    $(".ci-select:not(.initialized)").each(function() {
        let $this = $(this);

        $this.addClass("initialized");

        $("> div", $this).on("click", this, function() {
            let $that = $(this);
            let val = $that.data("value");

            if(Centauri.isNotUndefined(val)) {
                $("> div.active", $that.parent()).removeClass("active");
                $that.addClass("active");

                let txt = $.trim($that.text());

                $that.parents(".ci-field").find("label:last-child").text(txt);
                $that.parents(".ci-field").find("select").val(val);
                $that.parents(".ci-field").find("select").trigger("change");
                $("input.ci-select-toggler").trigger("focusout");
            }
        });
    });

    $(document).off("click");
    $(document).on("click", this, function(e) {
        let eTrgt = $(e.target);
        
        if(!eTrgt.hasClass("ci-select-toggler") && !eTrgt.parent().hasClass("ci-select")) {
            $(".ci-select-toggler").each(function() {
                $("div.ci-select", $(this).parent()).slideUp();
                $("div.ci-select", $(this).parent()).removeClass("active");
            });
        }

        // if(a) {
        //     console.log("SELECT CLICKED");
        // } else {
        //     console.log("NO SELECT CLICKED");
        // }
    });
};
