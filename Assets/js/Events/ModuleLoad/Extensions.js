Centauri.Events.OnModuleLoadEvent.Extensions = () => {
    $("#module_buttons button").each(function() {
        $button = $(this);

        $button.on("click", this, function() {
            var btnType = $(this).data("button-type");
        });
    });
};
