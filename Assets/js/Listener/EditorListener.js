/**
 * Listener for the EditorComponent
 * This will mainly fires events e.g. Select-onChange or Input-onKeyDown etc.
 */
Centauri.Listener.EditorListener = () => {
    $(".ci-select", $editor).on("change", this, function() {
        Centauri.Events.EditorComponent.Select.OnChange(this);
    });

    $(".ci-field input.form-control", $editor).on("keydown", this, function(e) {
        Centauri.Events.EditorComponent.Input.OnKeyDown(this, e);
    });
};
