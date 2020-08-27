Centauri.Events.EditorComponent.Input.OnKeyDown = (input, e) => {
    let dataID = $editor.attr("data-id");
    let id = $(input).attr("id");

    let parentSelector = "> form";
    if(!Centauri.elExists($(parentSelector, $editor))) {
        parentSelector = "> .bottom > div";
    }

    Centauri.Events.EditorComponent.Helpers.selector = parentSelector;

    let value = Centauri.Events.EditorComponent.Helpers.getElById(id).val();

    if(dataID == "CreateNewPage") {
        let $slug = Centauri.Events.EditorComponent.getElById("slug");

        if(id == "title") {
            if(e.which == 9 && value.length >= 2) {
                let slugs = value;
                    slugs = slugs[0] + slugs[1];

                Centauri.Events.EditorComponent.Helpers.getElById("langcode").focus();
                Centauri.Events.EditorComponent.Helpers.getElById("langcode").val(slugs + "-" + slugs.toUpperCase());

                $slug.focus();
                $slug.val(slugs);

                Centauri.Events.EditorComponent.Helpers.getElById("langcode").focus();

                Centauri.Events.EditorComponent.Helpers.getElById("url").val("/" + Centauri.Utility.SeoUrlUtility(value));
            }
        }

        if(id == "langcode") {
            if(e.which == 9 && value.length >= 2) {
                let slugs = Centauri.Events.EditorComponent.Helpers.getElById("langcode").val().split("-")[0].toLowerCase();

                $slug.focus();
                $slug.val(slugs);

                $slug.focus();
            }
        }
    }
};
