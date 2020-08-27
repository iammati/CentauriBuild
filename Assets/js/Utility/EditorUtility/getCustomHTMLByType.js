Centauri.Utility.EditorUtility.getCustomHTMLByType = (inputObj) => {
    let html = "";
    let type = inputObj.custom;
    let data = inputObj.data;

    let fieldClassName = "field";
    let additionalFieldClasses = "";

    if(type == "select") {
        fieldClassName = "ci-field";

        let defaultLabel = "Choose an option";
        let label = (Centauri.isNotUndefined(data.label) ? data.label : defaultLabel);

        html = "<select class='ci-select' id='" + inputObj.id + "'>|</select>{LABEL_1}<i class='fas fa-chevron-down'></i>{LABEL_2}";

        let optionsHtml = "<option selected disabled>" + label + "</option>";
        if(Centauri.isNotUndefined(data.options)) {
            $.each(data.options, (index, optionObj) => {
                if(Centauri.isNotUndefined(data.selectedOptionValue)) {
                    if(data.selectedOptionValue == optionObj.value) {
                        optionsHtml += "<option value='" + optionObj.value + "' selected>" + optionObj.name;

                        html = html.replace("{LABEL_2}", "<label for='" + inputObj.id + "'>" + optionObj.name + "</label>");
                    } else {
                        optionsHtml += "<option value='" + optionObj.value + "'>" + optionObj.name;
                    }
                } else {
                    optionsHtml += "<option value='" + optionObj.value + "'>" + optionObj.name;
                }
            });
        }

        html = html.replace("{LABEL_1}", "<label for='" + inputObj.id + "'>" + label + "</label>");
        html = html.replace("{LABEL_2}", "<label for='" + inputObj.id + "'>" + defaultLabel + "</label>");

        html = html.split("|").join(optionsHtml);
    }

    if(type == "image") {
        fieldClassName = "ci-field";
        html = "<img src='" + data.src + "' class='img-fluid' style='width: 30px;' /><label style='transform: translateY(-25px) scale(.8);' class='active'>" + data.label + "</label>";
    }

    if(type == "checkbox") {
        let checked = "";

        if(Centauri.isNotUndefined(data.isChecked)) {
            if(data.isChecked) {
                checked = " checked";
            }
        }

        additionalFieldClasses = " custom-control custom-checkbox";
        html = "<input id='" + inputObj.id + "' class='custom-control-input' type='checkbox'" + checked + " /><label class='custom-control-label d-block m-0' for='" + inputObj.id + "'>" + data.label + "</label>";
    }

    if(type == "switch") {
        additionalFieldClasses = " ci-switch";

        let checked = "";
        let onClick = "";

        if(Centauri.isNotUndefined(data.isChecked)) {
            if(data.isChecked) {
                checked = " checked";
            }
        }

        if(Centauri.isNotUndefined(data.onClick)) {
            onClick = " onclick='" + data.onClick + "'";
        }

        html = "<label><input type='checkbox'" + checked + " id='" + inputObj.id + "'" + onClick + " /><span></span>" + data.label + "</label>";
    }

    if(type == "radio") {
        let items = data.items;

        additionalFieldClasses = " radio";

        if(Centauri.isNotUndefined(inputObj.additionalFieldClasses)) {
            additionalFieldClasses += " " + inputObj.additionalFieldClasses;
        }

        items.forEach(item => {
            html += "<div class='form-check'><input type='radio' class='form-check-input' name='" + inputObj.id + "' id='" + item.id + "'" + (item.isChecked ? " checked" : "") + "><label class='form-check-label' for='" + item.id + "'>" + item.label + "</label></div>";
        });
    }

    if(type == "textarea") {
        html += "<div class='ci-field'><textarea" + (Centauri.isNotUndefined(data.required) ? (data.required ? " required" : "") : "") + " id='" + inputObj.id + "' class='md-textarea form-control' rows='3'>" + (Centauri.isNotUndefined(data.value) ? data.value : "") + "</textarea><label" + (Centauri.isNotUndefined(data.value) && data.value.length > 0 ? " class='active'" : "") + " for='" + inputObj.id + "'>" + data.label + "</label></div>";
    }

    return "<div class='" + fieldClassName + "" + additionalFieldClasses + "'" + (Centauri.isNotUndefined(inputObj.extraAttr) ? " " + inputObj.extraAttr : "") + ">" + html + "</div>";
};
