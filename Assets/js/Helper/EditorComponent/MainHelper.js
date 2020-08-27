/** 
 * Helpers for this input-events (keydown and keyup)
 */

Centauri.Events.EditorComponent.Helpers.selector = null;

Centauri.Events.EditorComponent.Helpers.getElById = (id) => {
    if(Centauri.isNull(Centauri.Events.EditorComponent.selector)) {
        return false;
    }

    return $(Centauri.Events.EditorComponent.Helpers.selector + " #" + id, $editor);
};
