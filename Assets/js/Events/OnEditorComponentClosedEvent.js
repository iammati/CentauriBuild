Centauri.Events.OnEditorComponentClosedEvent = function() {
    setTimeout(function() {
        Centauri.Components.EditorComponent("clear");
    }, 660);
};
