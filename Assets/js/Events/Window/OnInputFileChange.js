Centauri.Events.Window.OnInputFileChange = (element) => {
    var id = $(element).attr("id");
    var file = document.querySelector("input[type=file]").files[0];

    var reader = new FileReader();
    reader.addEventListener("load", function() {
        var base64 = reader.result;
        Centauri.Helper.VariablesHelper.__CME__FIELDS[id] = base64;
        Centauri.Helper.VariablesHelper.__CME__FIELDS[id] = Centauri.Service.ImageService("findBlobByID", id);

        if(Centauri.Events.Window.OnInputFileChange.ShowImagePreview) {
            // var imgData = Centauri.Service.ImageService("findBlobByID", id);
            var imgData = Centauri.Helper.VariablesHelper.__CME__FIELDS[id];

            $(element).parent().parent().append("<img src='" + imgData.blobURL + "' class='img-fluid' style='margin-top: 30px; margin-right: 30px;' />");
        }

        if(id == "filelist_upload") {
            Centauri.fn.Modal(
                Centauri__trans.modules[Centauri.Module],
                "<div class='md-form'><input id='file_name' type='text' class='form-control' /><label>" + Centauri__trans.global.label_title + "</label></div>",

                {
                    id: "new_filelistupload",

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
                        var name = $("#modal-new_filelistupload #file_name").val();

                        var formData = new FormData();
                        formData.append("_method", "HEAD");
                        formData.append("file", Centauri.Helper.VariablesHelper.__CME__FIELDS[id].blob);
                        formData.append("name", name);

                        $.ajax({
                            type: "POST",
                            url: Centauri.Utility.PathsUtility.root + Centauri.Utility.PathsUtility.centauri + Centauri.Utility.PathsUtility.ajax + "File/upload",
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false,

                            success: (data) => {
                                Centauri.Notify("success", "Filelist - Upload", "File '" + name + "' has been uploaded");

                                Centauri.Components.ModulesComponent({
                                    type: "load",
                                    module: "filelist"
                                });
                            }
                        });
                    }
                }
            );
        }
    }, false);

    // Triggers load-eventListener
    if(file) {
        reader.readAsDataURL(file);
    }
};

Centauri.Events.Window.OnInputFileChange.ShowImagePreview = true;
