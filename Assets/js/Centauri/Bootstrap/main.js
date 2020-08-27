var CentauriJS = {};

CentauriJS.Components = {};

CentauriJS.Utilities = {};
CentauriJS.Utilities.Form = {};

CentauriJS.init = () => {
    CentauriJS.Components.RippleEffectComponent();

    CentauriJS.Utilities.Form.FieldHasValueUtility();
    CentauriJS.Utilities.Form.Select();
    // CentauriJS.Utilities.Form.Colorpicker();
};
