Centauri.Events.EditorComponent.Input.OnKeyUp = (input, e) => {
    let dataID = $editor.attr("data-id");

    let parentSelector = "> form";
    if(!Centauri.elExists($(parentSelector, $editor))) {
        parentSelector = "> .bottom > div";
    }

    let value = $(input).val();

    if(dataID == "ListModels") {
        if($(input).hasClass("preview-update-title")) {
            let $parent = $(input).parent().parent().parent();
            let $title = $("> .top .title", $parent);

            let title = $.trim($title.text());

            if(Centauri.elExists($("s", $title))) {
                title = $.trim($("s", $title).html());
            }

            if(title == value) {
                if(Centauri.elExists($("s", $title))) {
                    $("s", $title).remove();
                }

                $title.html(title);
            } else {
                $title.html("<s class='mr-1' style='margin-top: -5px; font-size: 14px; display: block;'>" + title + "</s>" + value);
            }
        }
    }
};
