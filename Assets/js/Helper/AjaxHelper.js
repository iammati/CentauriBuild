Centauri.Helper.AjaxHelper = {};

Centauri.Helper.AjaxHelper.buildAjaxURL = (pathsUtil, ajax, method) => {
    return pathsUtil.root + pathsUtil.centauri + pathsUtil.ajax + ajax + "/" + method;
}
