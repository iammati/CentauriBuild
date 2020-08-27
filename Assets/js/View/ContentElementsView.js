Centauri.View.ContentElementsView = ($contentelement) => {
    /** Initializing AccordionComponent for InlineRecords this element may has. */
    Centauri.Components.AccordionComponent();

    $("[data-centauri-btn]").off("click");

    $("[data-centauri-btn]").on("click", this, function(e) {
        e.preventDefault();

        let $btn = $(this);

        let data = $btn.data("centauri-btn");
        let type = data.type;

        if(type == "addfile" || type == "addimage") {
            let fileListType = "file";

            if(type == "addimage") {
                fileListType = "images";
            }

            let $input = $(this).parent().parent().find("input");

            // Currently not used
            let id = $input.attr("data-id");

            let value = $input.val();

            let $accordions = $("> .accordions", $input.parent());

            Centauri.fn.Ajax(
                "File",
                "list",

                {
                    value: value,
                    type: fileListType
                },

                {
                    success: (data) => {
                        let html = data;
                        $("body").append(html);

                        setTimeout(() => {
                            $("#file-selector").removeClass("inactive");
                            $(".overlayer").toggleClass("hidden overlay-modal");
                            $(".overlayer").attr("data-closer", "FileSelectorComponent");

                            setTimeout(() => {
                                if($(".accordion", $accordions).length != 0) {
                                    $(".accordion", $accordions).each(function(index) {
                                        let uid = $(this).attr("data-uid");

                                        if(Centauri.Components.FileSelectorComponent.AnimatedSelectedFiles) {
                                            $("#file-selector .items .item[data-uid='" + uid + "']").delay(165 * index).queue(function() {
                                                $(this).addClass("selected");
                                            });
                                        } else {
                                            $("#file-selector .items .item[data-uid='" + uid + "']").addClass("selected");
                                        }
                                    });
                                }
                            }, (510));
                        }, 150);

                        Centauri.Components.FileSelectorComponent("show", function(data) {
                            let selectedFiles = data.selectedFiles,
                                selectedUids = data.selectedUids;

                            $input.val(selectedUids);

                            Centauri.fn.Ajax(
                                "InlineRecords",
                                "list",

                                {
                                    type: "files",
                                    uids: selectedUids
                                },

                                {
                                    success: (data) => {
                                        $accordions.html(data);

                                        CentauriJS.Utilities.Form.FieldHasValueUtility();

                                        Centauri.Components.AccordionComponent();
                                        Centauri.Components.CreateNewInlineComponent();
                                    }
                                }
                            );
                        });
                    }
                }
            );
        }

        if(type == "button") {
            let action = data.action;

            if(action == "generate-slug") {
                let sourceFieldDataId = data.sourceField;

                let value = Centauri.Helper.GetParentCiFieldValueByDataIdHelper($btn, sourceFieldDataId, $btn.parent());
                seoUrl = Centauri.Utility.SeoUrlUtility(value);

                let $element = Centauri.Helper.GetCiFieldByBtn($btn);
                $element.val(seoUrl);
            } else {
                console.warn("Centauri.View.ContentElementsView: There's no condition-handling for the button-action: '" + action + "'");
                console.warn("Centauri.View.ContentElementsView: Additional Data: ", data);
            }

            return;
        }

        if(type == "cropimage") {
            let $img = $(this).parents(".bottom").find("img");
            let fileReferenceUid = $img.data("uid");
            let imageData = $img.data("data");

            Centauri.fn.Ajax(
                "Image",
                "cropByUid",

                {
                    fileReferenceUid: fileReferenceUid
                },

                {
                    success: (data) => {
                        $("section#module_pages").append(data);

                        CentauriJS.Utilities.Form.FieldHasValueUtility();
                        Centauri.Components.AccordionComponent();

                        let cropper = null;
                        let $croppedImage = $("#cropped-image");
                        let croppedImage = document.getElementById("cropped-image");

                        $croppedImage.cropper({
                            viewMode: 2,
                            aspectRatio: 0,
                            preview: ".img-preview",

                            crop: (e) => {
                                let width = Math.ceil(e.detail.width);
                                let height = Math.ceil(e.detail.height);

                                $("#cropper_imgsizes").text(`${width} x ${height}`);
                            },

                            cropend: (e) => {
                                let cropper = Centauri.Helper.VariablesHelper.__CROPPER.cropper;
                                let view = Centauri.Helper.VariablesHelper.__CROPPER.responsiveView;

                                Centauri.Helper.VariablesHelper.__CROPPER.responsiveViewData[view] = {
                                    base64: cropper.getCroppedCanvas().toDataURL(),
                                    cropBoxData: cropper.getCropBoxData()
                                };
                            }
                        });

                        croppedImage.addEventListener("ready", () => {
                            cropper = $croppedImage.data("cropper");

                            Centauri.Helper.VariablesHelper.__CROPPER = {
                                cropper: cropper,
                                responsiveViewData: {},
                                imageData: imageData
                            };

                            let $btn = $("#cropper-panel button[data-type='SET_RESPONSIVE_VIEW']").parent().eq(0).find("button");
                                $btn.trigger("click");
                        });

                        $("#cropper-panel button").each(function() {
                            let $this = $(this);

                            $this.on("click", this, function() {
                                let $this = $(this);

                                let type = $this.data("type");
                                let value = $this.data("value");

                                let cropper = Centauri.Helper.VariablesHelper.__CROPPER.cropper;

                                if($this.hasClass("cropper-btn")) {
                                    $("#cropper-panel button.cropper-btn.active").removeClass("active");
                                    $this.addClass("active");
                                }

                                if(type == "CROP_IMAGE") {
                                    let responsiveViewDatas = Centauri.Helper.VariablesHelper.__CROPPER.responsiveViewData;

                                    $.each(responsiveViewDatas, (key, responsiveViewData) => {
                                        let base64 = responsiveViewData.base64;
                                        let contentType = base64.split(";base64,")[0].replace("data:", "");

                                        let data = {
                                            cropBoxData: responsiveViewData.cropBoxData
                                        };

                                        let blob = new Blob([
                                            base64
                                        ], {
                                            type: contentType
                                        });

                                        let formData = new FormData();
                                            formData.append("fileReferenceUid", fileReferenceUid);
                                            formData.append("fileName", $("#cropper_file_name").val());
                                            formData.append("data", JSON.stringify(data));
                                            formData.append("image", blob);
                                            formData.append("view", key);

                                        Centauri.fn.FileAjax(
                                            "Image",
                                            "cropImage",

                                            formData,

                                            {
                                                success: (data) => {
                                                    data = JSON.parse(data);
                                                    Centauri.Notify(data.type, data.title, data.description);
                                                }
                                            }
                                        );
                                    });
                                }

                                if(type == "CROP_CLOSE") {
                                    $("section#content > section > #cropper").remove();
                                }

                                if(type == "SET_ASPECT_RATIO") {
                                    value = Centauri.Helper.CalcuateRatioAspectHelper(value);
                                    cropper.setAspectRatio(value);
                                }

                                if(type == "SET_RESPONSIVE_VIEW") {
                                    Centauri.Helper.VariablesHelper.__CROPPER.responsiveView = value;

                                    if(Centauri.isNotUndefined(Centauri.Helper.VariablesHelper.__CROPPER.responsiveViewData[value])) {
                                        let responsiveViewData = Centauri.Helper.VariablesHelper.__CROPPER.responsiveViewData[value];

                                        let cropBoxData = responsiveViewData.cropBoxData;
                                            cropper.setCropBoxData(cropBoxData);
                                    } else {
                                        Centauri.Helper.VariablesHelper.__CROPPER.responsiveView_button = $this;

                                        let view = $this.data("value");
                                        Centauri.Helper.VariablesHelper.__CROPPER.responsiveView = view;

                                        // Centauri.Helper.VariablesHelper.__CROPPER.responsiveViewData[view] = {
                                        //     base64: cropper.getCroppedCanvas().toDataURL(),
                                        //     cropBoxData: cropper.getCropBoxData()
                                        // };
                                    }

                                    if(Centauri.isNotUndefined(imageData[value])) {
                                        cropper.setCropBoxData(imageData[value].cropBoxData);
                                    }
                                }
                            });
                        });
                    }
                }
            );
        }

        else {
            console.warn("Centauri.View.ContentElementsView: There's no condition-handling for the type: '" + type + "'");
        }
    });
};
