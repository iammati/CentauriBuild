Centauri.Helper.FieldsHelper = (element, parentSelector, returnAsJson = true, secondAttempt = false) => {
    let datas = [];

    if(
        $(element).is(Centauri.Helper.ModalHelper.Element) ||
        $(element).is($(".accordion.active"))
    ) {
        datas = Centauri.Helper.FieldsHelper.findDatasBySelectors([
            $(parentSelector + " .ci-field > input", $(element)),
            $(parentSelector + " .ci-switch input[type='checkbox']", $(element)),
            $(parentSelector + " .ci-field > .ci-textarea", $(element)),
            $(parentSelector + " .ci-field > textarea", $(element)),
            $(parentSelector + " .ci-field > select", $(element))
        ]);
    } else {
        datas = Centauri.Helper.FieldsHelper.findDatasBySelectors([
            $(parentSelector + " .ci-field > input"),
            $(parentSelector + " .ci-switch input[type='checkbox']"),
            $(parentSelector + " .ci-field > .ci-textarea"),
            $(parentSelector + " .ci-field > textarea"),
            $(parentSelector + " .ci-field > select")
        ]);
    }

    if(returnAsJson) {
        let tempArr = [];

        Object.keys(datas).forEach((data) => {
            tempArr.push(datas[data]);
        });

        datas = JSON.stringify(tempArr);
    }

    if(datas.length == 0 && !secondAttempt) {
        // datas = Centauri.Helper.FieldsHelper(element, ".fields", returnAsJson, true);
    }

    return datas;
};

Centauri.Helper.FieldsHelper.findDatasBySelectors = (selectors) => {
    let datas = [];

    selectors.forEach(selector => {
        $(selector).each(function() {
            let id = $(this).data("id");

            if(Centauri.isNotUndefined(id)) {
                let val = $(this).val();
                let uid = $(this).data("uid");
                let isIR = $(this).data("inline-record");
                let table = "elements";
                let parentuid = null;

                /** Handling for specific elements (by checking their classes) the correct way of fetching its current/changed value */
                if($(this).hasClass("ci-textarea")) {
                    val = $("> .ql-editor", $(this)).html();
                }
                if($(this).is("textarea")) {
                    val = $(this).val();
                }

                if($(this).hasClass("image-input")) {
                    if(val == "") {
                        val = null;
                    }
                }

                if($(this).is("input[type='checkbox']")) {
                    val = $(this).prop("checked");
                }

                if($(this).hasClass("form-check-input")) {
                    val = $(this).prop("checked");
                }

                /** In case the User creates a new Element using the Modal we set uid as "NEW" for the datas-Array */
                if($(selector).is(Centauri.Helper.ModalHelper.Element)) {
                    uid = "NEW";
                }

                /** If the current found field is an Inline-Record we set its table in the datas-Array to the parents' data-type-Attribute */
                if(isIR) {
                    table = $(this).parents(".accordions.inline-records").data("type");
                    parentuid = $(this).parents(".accordions.inline-records").parents(".accordion").data("uid");
                }

                if(Centauri.elExists($(this).parents(".models")) && !Centauri.elExists($(this).parents(".accordions.inline-records"))) {
                    table = $(this).parents(".models").data("namespace");
                }

                /** datas-Array logic. */
                if(Centauri.isUndefined(datas[table])) {
                    datas[table] = {};
                }
                if(Centauri.isUndefined(datas[table][uid])) {
                    datas[table][uid] = {};
                }
                datas[table][uid][id] = {
                    value: val
                };
            }
        });
    });

    return datas;
};
