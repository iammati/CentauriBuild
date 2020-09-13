Centauri.Init.HeaderInit = () => {
    /** Initializing Dropdowns-Component (Button-Dropdown in header) */
    Centauri.Components.DropdownsComponent();

    $("#header nav .has-dropdown button").each(function() {
        let $this = $(this);

        $this.on("click", this, function() {
            let id = $this.attr("id");

            if(Centauri.isNotUndefined(id)) {
                Centauri.Components.ModulesComponent({
                    type: "load",
                    module: id
                });
            }
        });
    });
};
