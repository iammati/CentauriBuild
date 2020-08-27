Centauri.Events.OnModuleLoadEvent.Filelist.RegisterActions = () => {
    let $action = $("table#filelist .actions .action");

    $action.on("click", this, function() {
        let $tr = $(this).parent().parent().parent().parent();

        Centauri.Components.PagesComponent.uid = $(this).attr("data-uid");
        let action = $(this).attr("data-action");

        let uid  = $.trim($("td[data-type='uid']", $tr).text());
        uid  = Centauri.strReplace(uid, "# ", "");

        let name = $.trim($("td[data-type='name']", $tr).text());
        let path = $.trim($("td[data-type='path']", $tr).text());

        if(action == "actions-trigger") {
            $(this).toggleClass("active");
        }

        if(action == "file-edit") {
            Centauri.fn.Modal(
                Centauri__trans.modules[Centauri.Module] + " - Editor",
                "<div class='md-form'><input id='file_name' type='text' value='" + name + "' class='form-control' /><label class='active'>" + Centauri__trans.global.label_title + "</label></div>",

                {
                    id: "NO_ID_MODAL",
                    size: "xl",

                    close: {
                        label: "",
                        class: "danger fas fa-times"
                    },

                    save: {
                        label: "",
                        class: "success fas fa-save"
                    }
                },

                {
                    save() {
                        Centauri.fn.Ajax(
                            "File",
                            "edit",

                            {
                                uid: uid,
                                oldName: name,
                                name: $("#modal-new_filelistupload #file_name").val()
                            },

                            {
                                success: (data) => {
                                    data = JSON.parse(data);
                                    Centauri.Notify(data.type, data.title, data.description);

                                    Centauri.Components.ModulesComponent({
                                        type: "load",
                                        module: "filelist"
                                    });
                                }
                            }
                        );
                    }
                }
            );
        }

        if(action == "file-crop") {
            Centauri.fn.Modal(
                Centauri__trans.modules[Centauri.Module] + " - Editor",
                "<div class='md-form'><input id='file_name' type='text' value='" + name + "' class='form-control' /><label class='active'>" + Centauri__trans.global.label_title + "</label></div><img id='croppableimage' src='" + path + "' class='img-fluid' />",

                {
                    id: "NO_ID_MODAL",
                    size: "xl",

                    close: {
                        label: "",
                        class: "danger fas fa-times"
                    },

                    save: {
                        label: "",
                        class: "success fas fa-save"
                    }
                },

                {
                    save() {
                        var fileData = Centauri.Helper.VariablesHelper.fileData;

                        var formData = new FormData();
                        formData.append("_method", "HEAD");
                        formData.append("image", fileData.blob);
                        formData.append("name", $("#modal-new_filelistupload #file_name").val());

                        $.ajax({
                            type: "POST",
                            url: Centauri.Utility.PathsUtility.root + Centauri.Utility.PathsUtility.centauri + Centauri.Utility.PathsUtility.ajax + "File/crop",
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false,

                            success: (data) => {
                                Centauri.Notify("success", "Filelist - Crop", "Image '" + name + "' has been cropped");

                                Centauri.Components.ModulesComponent({
                                    type: "load",
                                    module: "filelist"
                                });
                            }
                        });
                    }
                }
            );

            Centauri.Service.ImageCroppingService($("#modal #croppableimage"));
        }

        if(action == "file-show") {
            window.open(path, "_blank");
        }

        if(action == "file-delete") {
            Centauri.fn.Modal(
                Centauri__trans.modals.areyousure,
                "Do you want to continue deleting this file?",

                {
                    id: "areyousure_deletefile",

                    close: {
                        label: Centauri__trans.modals.btn_cancel,
                        class: "warning"
                    },

                    save: {
                        label: Centauri__trans.modals.btn_delete,
                        class: "danger"
                    }
                },

                {
                    save() {
                        Centauri.fn.Ajax(
                            "File",
                            "delete",

                            {
                                uid: uid
                            },

                            {
                                success: (data) => {
                                    data = JSON.parse(data);
                                    Centauri.Notify(data.type, data.title, data.description);

                                    Centauri.Components.ModulesComponent({
                                        type: "load",
                                        module: "filelist"
                                    });
                                }
                            }
                        );
                    }
                }
            );
        }
    });
};
