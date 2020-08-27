Centauri.Events.OnModuleLoadEvent.Extensions = () => {
    $("#extensionsmodule_buttons button").each(function() {
        $button = $(this);

        $button.on("click", this, function() {
            var btnType = $(this).data("button-type");
        });
    });
};
