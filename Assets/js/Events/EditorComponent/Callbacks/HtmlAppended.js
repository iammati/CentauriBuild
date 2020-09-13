Centauri.Events.EditorComponent.Callbacks.HtmlAppended = () => {
    $(".bottom .field .accordion", $editor).each(function() {
        let $this = $(this);

        $(".top", $this).on("click", this, function() {
            $(this).parent().find(".bottom").slideToggle();
        });
    });
};
