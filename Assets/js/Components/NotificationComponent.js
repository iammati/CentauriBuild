Centauri.Components.NotificationComponent = (title, description, level, options = {}) => {
    let iconHTML = "";

    if(Centauri.isNotUndefined(options.icon)) {
        iconHTML = "<i class='fas fa-" + options.icon + "'></i>";
    } else {
        // switch(level) {
        //     case "default":
                
        //         break;

        //     default:
        //         break;
        // }
    }

    let html = "<div class='notify' data-level='" + level + "'><div class='row'><div class='icon-view'>" + iconHTML + "</div><div class='text-view'>" + textHTML + "</div></div></div>";
};
