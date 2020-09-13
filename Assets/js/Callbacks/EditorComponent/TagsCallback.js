Centauri.Callbacks.EditorComponent.TagsCallback = () => {
    let $tagsSelector = $(".bottom .tags > *", $editor);

    $tagsSelector.off("click");

    $tagsSelector.each(function() {
        let $this = $(this);

        $this.on("click", this, function() {
            let tagsIdentifier = $(this).parent().attr("id");
            tagsIdentifierSplitted = tagsIdentifier.split("-")[1];
            tagsIdentifier = tagsIdentifierSplitted.substring(0, 1).toUpperCase() + tagsIdentifierSplitted.substring(1);

            if($(this).hasClass("adder")) {
                Centauri.Callbacks.EditorComponent.TagsCallbacks[tagsIdentifier].New($(this).parents(".tags").data("uid"));
            } else {
                Centauri.Callbacks.EditorComponent.TagsCallbacks[tagsIdentifier]($(this));
            }
        });
    });
};
