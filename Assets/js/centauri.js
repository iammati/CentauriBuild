/**
 * Centauri
 * 
 * @website https://centauricms.de/
 * @author m.sediqi@centauricms.de
 * @file Centauri Core JS file for BE
 * @copyright M.S. 2019-2020
 * 
 * © 2019-2020 All rights reserved.
 */
var Centauri = {};

/**
 * Centauri Environment
 */
Centauri.Env = "Development";

/**
 * Centauri default ModuleID
 * The default one which will be used when logging into the backend
 */
Centauri.defaultModule = "dashboard";


/**
 * Centauri Core
 */
Centauri.Init = {};

Centauri.Service = {};
Centauri.Utility = {};

Centauri.Module = Centauri.defaultModule;

Centauri.fn = {};

Centauri.Helper = {};
Centauri.Helper.VariablesHelper = {};

Centauri.Events = {};
Centauri.Events.Window = {};
Centauri.Events.Window.OnLoad = {};

Centauri.Lib = {};
Centauri.Listener = {};
Centauri.Components = {};
Centauri.Modal = {};
Centauri.View = {};


/**
 * Centauri Core registrations
 * 
 * @function Centauri.load
 * @returns {void}
 */
Centauri.load = () => {
    /**
     * This function is 
     */
    CentauriCoreFunctions();

    /**
     * Condition whether CentauriEnv is defined - since it's for each environment maybe necessary, maybe not - therefor this condition
     * to handle it properly in case CentauriEnv does not exists.
     */
    if(Centauri.isNotUndefined(CentauriEnv)) {
        CentauriEnv();
    }

    /**
     * Creating a new LocalStorage Object to fill in data which can hold temporary BE user values (e.g. fullscreen feature etc.)
     */
    Centauri.LocalStorage = new CentauriLocalStorageService();

    /**
     * Window related stuff (events etc.)
     */
    Centauri.Events.Window.OnLoadResize();

    /**
     * Utilities
     */
    Centauri.Utility.Ajax();

    /**
     * DAP - DynamicAjaxPushLoader
     */
    Centauri.DAPLoader();

    /**
     * Views
     */
    Centauri.View.LoginView();
    Centauri.View.DashboardView();

    /**
     * Initialization of Components
     */
    Centauri.Components.ModulesComponent({type: "init"});
    Centauri.Components.EditorComponent.init();
    Centauri.Components.DropdownsComponent();

    /**
     * Listener handling the overlayer (for EditorComponent or ModalUtility)
     */
    Centauri.Listener.OverlayerListener();

    /**
     * Listener for EditorComponent and ModalUtility (when pressing buttons on keyboard while one of those is active)
     */
    Centauri.Listener.DocumentKeyUpListener();
};


/**
 * Registration of CentauriCore listener for window.onload-event
 */
Centauri.Events.Window.OnLoad.CentauriCore = () => {
    /**
     * Initializing Centauri Core Functions by this such as Centauri Core itself.
     */
    Centauri.load();

    /**
     * Initializing CentauriJS Core
     */
    CentauriJS.init();

    /**
     * Initializations - mainly for functions which should happen after Centauri.load() has been called (async).
     */
    Centauri.Init.HeaderInit();
};
