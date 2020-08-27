Centauri.Events.OnModuleLoadEvent.Notifications.RegisterActions = () => {
    let $action = $("table#notifications .actions .action");

    $action.on("click", this, function() {
        let action = $(this).data("action");
        console.log(action);

        Centauri.fn.Ajax(
            "Notification",
            action,

            {
                uid: Centauri.Components.PagesComponent.uid
            },

            {
                success: (data) => {
                    data = JSON.parse(data);
                    Centauri.Notify(data.type, data.title, data.description);

                    Centauri.Components.ModulesComponent({
                        type: "load",
                        module: "notifications"
                    });
                }
            }
        );
    });
};
