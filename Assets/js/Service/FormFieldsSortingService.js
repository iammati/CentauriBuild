Centauri.Service.FormFieldsSortingService = () => {
    /**
     * Sortable logic (drag 'n drop new or existing fields from the right panel or inside the form)
     */
    $("#ci-forms-currentfields").sortable({
        connectWith: "#ci-forms-fields .fields .row > div, #ci-forms-currentfields .row > div"
    });

    $("#ci-forms-currentfields .row > div").sortable({
        connectWith: "#ci-forms-currentfields, #ci-forms-currentfields .row > div"
    });

    $("#ci-forms-fields .fields").sortable({
        connectWith: "#ci-forms-currentfields, #ci-forms-currentfields .row > div",

        start: function(e, ui) {
            $(this).data("previndex", ui.item.index());
        },

        update: function(e, ui) {
            if($(ui.item).parent().hasClass("fields")) {
                $(this).sortable("cancel");
                return;
            }

            let tab = $(ui.item).data("tab");
            let $fieldsParent = $("#ci-forms-fields .fields[data-tab='" + tab + "']");

            let index = $(this).data("previndex");
            let fields = $fieldsParent.data("fields");

            let $clonedField = $(ui.item).clone();
            let $fieldAtIndex = $("> div", $fieldsParent).eq(index);

            if((fields - 1) == index) {
                $fieldAtIndex = $("> div", $fieldsParent).eq(index - 1);

                if(!Centauri.elExists($fieldAtIndex)) {
                    $fieldsParent.append($clonedField);
                } else {
                    $clonedField.insertAfter($fieldAtIndex);
                }
            } else {
                $clonedField.insertBefore($fieldAtIndex);
            }

            Centauri.Service.FormFieldsSortingService();
        }
    });

    /**
     * Handling of (new created / existing) fields inside the form
     */
    $("#ci-forms-currentfields .ci-field").off("click");

    $("#ci-forms-currentfields .ci-field:not(.active)").on("click", this, function(e) {
        e.stopPropagation();

        $("#ci-forms-currentfields .ci-field.active").removeClass("active");

        let $this = $(this);
        $this.addClass("active");

        $("#ci-forms-tabs").hide();
        $("#ci-forms-fieldconfig").show();

        let $fieldConfig = $("#ci-forms-fieldconfig");
        $(".ci-field", $fieldConfig).remove();

        let config = $this.data("config");
        if(typeof config == "string") {
            config = JSON.parse(config);
        }

        if(config.length == 0) {
            config = {};
            config["text"] = $.trim($(this).text());
        }

        $.each(config, (key, value) => {
            let nKey = key;

            key = key.charAt(0).toUpperCase() + key.slice(1);
            key = key.replace("_", " ");

            let splittedKeys = key.split(" ");
            let splittedKeyIndex = 0;
            splittedKeys.forEach(splittedKeyPart => {
                splittedKeyPart = splittedKeyPart.charAt(0).toUpperCase() + splittedKeyPart.slice(1);
                splittedKeys[splittedKeyIndex] = splittedKeyPart;
                splittedKeyIndex++;
            });
            key = splittedKeys.join(" ");

            if(nKey == "text") {
                $fieldConfig.prepend('<div class="ci-field mt-5" data-key="' + + nKey + '"><div class="document-editor__toolbar"></div><div class="ci-textarea form-control" data-id="" data-html="' + value + '" data-parsejson="false"></div><label class="active" style="top: -10px;">Text</label></div>');
            } else {
                $fieldConfig.prepend("<div class='ci-field' data-key='" + nKey + "'><input type='text' class='form-control' value='" + value + "' /><label class='active'>" + key + "</label></div>")
            }
        });

        Centauri.Service.CKEditorInitService();

        CentauriJS.Utilities.Form.FieldHasValueUtility();

        $("#ci-forms-fieldconfig input, #ci-forms-fieldconfig .ci-textarea").on("keyup", this, function() {
            let $this = $(this);

            let value = $(this).val();

            let $activeField = $("#ci-forms-currentfields .ci-field.active");
            let fieldKey = $(this).data("key");

            console.log(fieldKey);

            if($this.is("input")) {
                fieldKey = $(this).parent().data("key");
            }

            console.log(fieldKey);

            let selector = "";
            let changeType = "ATTR";

            switch(fieldKey) {
                case "label":
                    selector = "label";
                    changeType = "TEXT";
                    break;

                case "text":
                    selector = "> *:not(label):not(div)";
                    changeType = "HTML";
                    break;

                default:
                    selector = "input, textarea";
                    break;
            }

            if(selector != "") {
                if(changeType == "ATTR") {
                    $(selector, $activeField).attr(fieldKey, value);
                }

                if(changeType == "TEXT") {
                    $(selector, $activeField).text(value);
                }

                if(changeType == "HTML") {
                    console.log(value);
                    $(selector, $activeField).html(value);
                }

                if(fieldKey == "placeholder") {
                    if(value == "") {
                        $("label", $activeField).css({
                            "top": "10px",
                            "left": "5px",
                            "margin": "0",
                            "transform": "unset"
                        }).removeClass("active");
                    } else {
                        $("label", $activeField).removeAttr("style").addClass("active");;
                    }
                }
            }
        });
    });

    $("#ci-forms-currentfields").off("click");

    $("#ci-forms-currentfields").on("click", this, function(e) {
        if($(e.target).attr("id") == "ci-forms-currentfields") {
            let $activeField = $("#ci-forms-currentfields .ci-field.active");
            Centauri.Helper.FormResetFieldHelper($activeField);
            $activeField.removeClass("active");

            $("#ci-forms-tabs").show();
            $("#ci-forms-fieldconfig").hide();
            $("#ci-forms-fieldconfig .ci-field").remove();
        }
    });

    $("#ci-forms-fieldconfig .row-buttons button").on("click", this, function() {
        let $activeField = $("#ci-forms-currentfields .ci-field.active");
        let config = {};

        $("#ci-forms-fieldconfig .ci-field").each(function() {
            let key = $(this).data("key");
            let value = "";

            if(Centauri.elExists($("input", $(this)))) {
                value = $("input", $(this)).val();
            }
            if(Centauri.elExists($("textarea", $(this)))) {
                value = $("input", $(this)).text();
            }

            config[key] = value;
        });

        config = JSON.stringify(config);

        // Handling each button type
        if($(this).hasClass("btn-success")) {
            $activeField.data("config", config);
            $activeField.attr("data-config", config);

            $("#ci-forms-currentfields").trigger("click");
        }

        if($(this).hasClass("btn-warning")) {
            $("#ci-forms-currentfields").trigger("click");
            Centauri.Helper.FormResetFieldHelper($activeField, config);
        }

        if($(this).hasClass("btn-danger")) {
            $activeField.remove();
            $("#ci-forms-currentfields").trigger("click");
        }
    });
};
