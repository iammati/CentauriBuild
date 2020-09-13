Centauri.Events.OnATagAjaxServiceAfter = (type, data) => {
    let handler = data.handler;
    let action = data.action;

    if(handler == "Backend") {
        if(action == "logout") {
            return location.reload();
        }
    }

    if(type == "error") {
        Centauri.Notify("error", "Action failed!", "'" + data.handler + "'-Handler failed for the action '" + data.action + "'");

        console.error("Centauri.Events.OnATagAjaxServiceAfter: The action '" + data.action + "' for Handler '" + data.handler + "' failed due to:");
        console.error("  > " + data.error);

        return;
    }

    if(handler == "Cache") {
        if(action == "flushBackend") {
            Centauri.Modal($(".modal"), "dispose");
            $("body > .ck-rounded-corners").remove();
        }
    }

    if(handler == "Notification") {
        if(action == "deleteAll") {
            Centauri.Components.ModulesComponent({
                type: "load",
                module: Centauri.Module
            });
        }
    }
};
