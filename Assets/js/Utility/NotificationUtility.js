Centauri.Utility.NotificationUtility = (severity, title, description, options = {}) => {
    return toastr[severity](title, description, options);
};

Centauri.Notify = (severity, title = "", description = "", options = {}) => {
    if(typeof severity == "object") {
        let config = severity;

        severity = config.type;
        title = config.title;
        description = config.description;
        options = (Centauri.isNotUndefined(config.options)) ? config.options : {};
    }

    return Centauri.Utility.NotificationUtility(severity, title, description, options);
};
