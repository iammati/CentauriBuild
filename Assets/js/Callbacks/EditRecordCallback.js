Centauri.Callbacks.EditRecordCallback = (data) => {
    Centauri.Components.EditorComponent("show", {
        id: "EditBeRole",
        title: "Backend Roles - Editing '" + data.name + "'",

        form: [
            {
                id: "hidden",
                type: "custom",
                custom: "switch",

                data: {
                    label: "Hidden",
                    isChecked: data.hidden
                }
            },

            {
                id: "name",
                label: "Name",
                type: "text",
                value: data.name
            },

            {
                id: "permissions",
                type: "custom",
                custom: "tags",

                data: {
                    label: "Permissions",
                    tagsLabel: "identifier",
                    tagValue: "uid",
                    tags: data.__permissions,
                    additionalParentData: "data-uid='" + data.uid + "'",

                    controls: {
                        
                    }
                }
            }
        ],

        callbacks: {
            htmlAppended: () => {
                Centauri.Callbacks.EditorComponent.TagsCallback();
            },

            save: (formData) => {
                console.log(formData);
            }
        }
    });
};
