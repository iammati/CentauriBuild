Centauri.Utility.ModalUtility.Validator = function($modal) {
    var $input = $("input", $modal);
    var $select = $("select", $modal);

    $input.on("focusout", function() {
        var required = $(this).attr("required");

        if(Centauri.isNotUndefined(required)) {
            var value = $(this).val();

            if(value == "") {
                $(this).addClass("error");
            }
        }
    });

    $input.on("keyup", function() {
        var required = $(this).attr("required");

        if(Centauri.isNotUndefined(required)) {
            var value = $(this).val();

            if($(this).hasClass("error")) {
                if(value != "") {
                    $(this).removeClass("error");
                }
            } else {
                if(value == "") {
                    $(this).addClass("error");
                }
            }
        }
    });

    $select.on("change", function() {
        let required = $(this).attr("required");
        let $ul = $(this).prev();

        if(Centauri.isNotUndefined(required)) {
            if($("li", $ul).hasClass("active")) {
                $(this).parent().find("input").removeClass("error");
            }
        }
    });

    $("button[data-type='save']").click(function(e) {
        let hasError = false;

        $("input", $modal).each(function() {
            var val = $(this).val();
            var required = $(this).attr("required");

            if(val == "" && Centauri.isNotUndefined(required)) {
                hasError = true;

                if(!$(this).hasClass("error")) {
                    $(this).addClass("error");
                }
            }
        });

        $("select", $modal).each(function() {
            let required = $(this).attr("required");
            let $ul = $(this).prev();

            if(Centauri.isNotUndefined(required)) {
                if(!$("li", $ul).hasClass("active")) {
                    hasError = true;
                    $(this).parent().find("input").addClass("error");
                }
            }
        });

        if(hasError) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();

            Centauri.Notify("error", "Form Validation", "Please fill out all fields!");
        }
    });
};
