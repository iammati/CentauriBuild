Centauri.Callbacks.EditorComponent.TagsCallbacks.Permissions = (tagEl) => {
    let uid = $(tagEl).data("uid");
    
    Centauri.fn.Ajax(
        "BackendPermission",
        "findByUid",
    
        {
            uid: uid
        },
    
        {
            success: (data) => {
                data = JSON.parse(data);

                let identifier = data.identifier;
                let permissionText = Centauri__trans.permissions[identifier];

                Centauri.fn.Modal(
                    "Permission » <b>" + identifier + "</b>",
                    "<p class='mb-0'>" + permissionText + "</p>",

                    {
                        id: "permission_" + identifier,

                        close: {
                            label: "Cancel",
                            class: "warning"
                        },

                        save: {
                            label: "Remove",
                            class: "danger"
                        }
                    },

                    {
                        save() {
                            let $tagsEl = $(tagEl).parent();
                            let roleUid = $tagsEl.data("uid");

                            Centauri.fn.Ajax(
                                "BackendRole",
                                "removePermissionByUid",
                            
                                {
                                    roleUid: roleUid,
                                    permissionUid: uid
                                },
                            
                                {
                                    success: (data) => {
                                        console.log(data);
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
};

Centauri.Callbacks.EditorComponent.TagsCallbacks.Permissions.New = (roleUid) => {
    Centauri.fn.Ajax(
        "BackendRole",
        "findByUid",

        {
            uid: roleUid
        },

        {
            success: (data) => {
                let beRole = JSON.parse(data);
                let beRolePermissionUids = JSON.parse(beRole.permissions);

                Centauri.fn.Ajax(
                    "BackendPermission",
                    "list",

                    {
                        uid: roleUid
                    },

                    {
                        success: (data) => {
                            let bePerms = JSON.parse(data);
                            let html = "";

                            bePerms.forEach(bePerm => {
                                let permissionText = Centauri__trans.permissions[bePerm.identifier];
                                let isChecked = false;
                                let additionalHTML = "";

                                if(beRolePermissionUids.includes(bePerm.uid)) {
                                    isChecked = true;
                                }

                                if(Centauri.isNotUndefined(permissionText)) {
                                    additionalHTML = "<p>" + permissionText + "</p>";
                                }

                                html += Centauri.Utility.EditorUtility.getCustomHTMLByType({
                                    id: "be_perm-" + bePerm.uid,
                                    custom: "switch",

                                    data: {
                                        label: bePerm.identifier,
                                        isChecked: isChecked,
                                        additionalHTML: additionalHTML,
                                        onClick: "Centauri.fn.__modalPermissionUpdate(event, this)"
                                    }
                                });
                            });

                            Centauri.fn.Modal(
                                "Backend Role » <b>" + beRole.name + "</b> » Permissions",
                                html,

                                {
                                    id: "permissions_list",
                                    layout: "center",
                                    search: true,
                                    saveOnClose: false,

                                    close: {
                                        label: "Cancel"
                                    },

                                    save: {
                                        label: "Update",
                                        class: "primary"
                                    }
                                },

                                {
                                    save() {
                                        let permissionUidsArr = [];

                                        $(".modal .modal-body .field.ci-switch").each(function() {
                                            let $input = $("input", $(this));
                                            let id = $input.attr("id");
                                            let permissionUid = id.split("-")[1];
                                            let isChecked = $input.prop("checked");
                                            
                                            if(isChecked) {
                                                permissionUidsArr.push(permissionUid);
                                            }
                                        });

                                        Centauri.fn.Ajax(
                                            "BackendRole",
                                            "updatePermissionsByUids",

                                            {
                                                roleUid: beRole.uid,
                                                permissionUids: permissionUidsArr
                                            },

                                            {
                                                success: (data) => {
                                                    if(data) {
                                                        Centauri.Notify("success", "Permissions", beRole.name + "-Permissions updated successfully");
                                                        
                                                        Centauri.Components.EditorComponent("clear");

                                                        $(".be-users-row button[data-uid='" + beRole.uid + "']").trigger("click");
                                                    } else {
                                                        Centauri.Notify("error", "Permissions", "An error occurred while updating permissions for this role!")
                                                    }
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
};
