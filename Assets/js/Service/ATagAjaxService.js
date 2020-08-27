Centauri.Service.ATagAjaxService = () => {
    $("a[data-ajax='true']").off("click");

    $("a[data-ajax='true']").on("click", this, function(e) {
        e.preventDefault();

        let handler = $(this).data("ajax-handler");
        let action = $(this).data("ajax-action");
        let data = $(this).data("ajax-data");

        if(Centauri.isUndefined(data)) {
            data = null;
        }

        Centauri.Events.OnATagAjaxServiceBefore({
            handler,
            action
        });

        Centauri.fn.Ajax(
            handler,
            action,

            data,

            {
                success: (data) => {
                    try {
                        data = JSON.parse(data);
                        Centauri.Notify(data.type, data.title, data.description);

                        Centauri.Events.OnATagAjaxServiceAfter("success", {
                            handler: handler,
                            action: action
                        }); 
                    } catch(SyntaxError) {
                        Centauri.Events.OnATagAjaxServiceAfter("error", {
                            handler: handler,
                            action: action,
                            error: SyntaxError,
                            data: data
                        });
                    }
                }
            }
        );
    });

    $("a[data-module='true']").on("click", this, function(e) {
        e.preventDefault();
        let moduleid = $(this).data("moduleid");
    
        Centauri.Components.ModulesComponent({
            type: "load",
            module: moduleid
        });
    });
};
