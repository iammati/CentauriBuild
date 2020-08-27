Centauri.Helper.FormResetFieldHelper = ($field) => {
    let config = $field.data("config");

    if(typeof config == "string") {
        config = JSON.parse(config);
    }

    if(Centauri.elExists($field)) {
        let selector = "input, textarea";

        $.each(config, (key, value) => {
            if(key == "placeholder") {
                $(selector, $field).attr(key, value);
            }

            if(key == "label") {
                $(key, $field).text(value);
            }
        });
    }
};
