Centauri.Init.HeaderInit = () => {
    if(!Centauri.Init.HeaderInit.Initialized) {
        Centauri.Init.HeaderInit.Initialized = true;

        /**
         * Initializing Dropdowns-Component (Button-Dropdown in header)
         */
        Centauri.Components.DropdownsComponent();
    }
};

Centauri.Init.HeaderInit.Initialized = false;
