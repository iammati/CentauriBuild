Centauri.NewModel = () => {
    CentauriJS.Utilities.Form.FieldHasValueUtility();

    $(".element .top").on("click", this, function() {
        let $this = $(this);
        let $element = $this.parent();

        $(Centauri.Helper.ModalHelper.Element).find(".bottom").slideUp();

        if(!$(Centauri.Helper.ModalHelper.Element).is($element)) {
            Centauri.Helper.ModalHelper.Element = $element;

            if(!Centauri.Helper.VariablesHelper.__ModalInputFixList.includes($element)) {
                Centauri.Helper.VariablesHelper.__ModalInputFixList.push($element);

                $("input, select, .md-textarea", $element).each(function() {
                    let id = $(this).attr("id");
                    Centauri.Helper.VariablesHelper.__ModalInputFixCounter++;
                    $(this).attr("id", id + "-" + Centauri.Helper.VariablesHelper.__ModalInputFixCounter);
                });
            }

            $(".bottom", $element).slideToggle();
        } else {
            Centauri.Helper.ModalHelper.Element = null;
        }
    });
};
