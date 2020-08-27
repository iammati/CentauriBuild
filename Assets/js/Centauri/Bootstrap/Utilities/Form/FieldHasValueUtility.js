CentauriJS.Utilities.Form.FieldHasValueUtility = () => {
    $(".ci-field").each(function() {
        let $ciForm = $(this);

        $("input:not(.ci-select-toggler), textarea, select.ci-select", $ciForm).on("focusout focus keyup", this, function() {
            let value = $(this).val();
            let required = $(this).attr("required");

            if(Centauri.isUndefined(required)) {
                required = false;
            }

            if(value.length > 0) {
                $("+ label", $(this)).addClass("active");

                if(required) {
                    $(this).removeClass("error");
                }
            } else {
                let hasPlaceholder = false;

                if(Centauri.isNotUndefined($(this).attr("placeholder"))) {
                    if($(this).attr("placeholder") != "") {
                        hasPlaceholder = true;
                    }
                }

                if(!hasPlaceholder) {
                    $("+ label", $(this)).removeClass("active");
                }

                if(required && !$(this).hasClass("error")) {
                    $(this).addClass("error");
                }
            }
        });
    });
};
