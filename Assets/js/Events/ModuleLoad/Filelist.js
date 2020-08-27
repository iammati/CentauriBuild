Centauri.Events.OnModuleLoadEvent.Filelist = () => {
    $("#filelistmodule_buttons button").each(function() {
        $button = $(this);

        $button.on("click", this, function() {
            var btnType = $(this).data("button-type");

            if(btnType == "upload") {
                // $("input", $(this))[0].trigger("click");
            }
        });
    });

    /**
     * Module:filelist Actions
     */
    Centauri.Events.OnModuleLoadEvent.Filelist.RegisterActions();
};
