/**
 * Centauri HistoryPushLoader / DynamicAjaxPopstate Loader - HPL/DAP
 */
Centauri.DAPLoader = () => {
    let url = location.origin + Centauri.Utility.PathsUtility.root + "centauri";

    window.onpopstate = function() {
        let uid = null;
        let moduleid = location.href.replace(url, "");

        if(moduleid[0] == "/") {
            moduleid = moduleid.substr(1);
        }

        if(Centauri.strContains(moduleid, "/")) {
            let splittedModuleid = moduleid.split("/");

            moduleid = splittedModuleid[0];
            uid = splittedModuleid[1];
        }

        Centauri.DAPLoader.historyPushState = false;

        Centauri.Components.ModulesComponent({
            type: "load",
            module: moduleid
        });
    };
};

Centauri.DAPLoader.historyPushState = true;
