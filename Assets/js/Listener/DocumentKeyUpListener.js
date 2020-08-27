Centauri.Listener.DocumentKeyUpListener = () => {
    $(document).off("keyup");

    $(document).on("keyup", this, function(e) {
        if(e.key == "Escape" || e.keyCode == 27) {
            if(Centauri.elExists($(".modal"))) {
                Centauri.Modal("close");
            }
        }
    });


    $(window).off("keydown");

    $(window).bind("keydown", function(e) {
        let reload = false;
        let char = String.fromCharCode(e.which).toLowerCase();

        if(e.ctrlKey || e.metaKey) {
            if(char == "s") {
                e.preventDefault();

                let type = "";

                if(Centauri.elExists($(".content-element.active"))) {
                    type = "CE";
                }
                if(Centauri.elExists($(".model"))) {
                    type = "MODEL";
                }

                if(type == "") {
                    return console.error("Centauri.Listener.DocumentKeyUpListener: Could not save since 'type' is an empty string (could not detect current state of your module to save data).");
                }

                let selector = "";
                let fields = "";

                if(type == "MODEL") {
                    selector = ".model";
                    fields = ".bottom";
                }
                if(type == "CE") {
                    selector = ".content-element.active";
                    fields = ".fields";
                }

                let dataFields = null;

                if(type == "MODEL") {
                    dataFields = Centauri.Helper.FieldsHelper($(selector), fields, false);

                    let tableArrData = {};
                    Object.keys(dataFields).forEach((data) => {
                        tableArrData[data] = dataFields[data];
                    });

                    dataFields = tableArrData;

                    let namespace = $(selector).parents(".models").data("namespace");
                    let uid = $(selector).data("uid");

                    Centauri.fn.Ajax(
                        "InlineRecords",
                        "saveModelByUid",

                        {
                            namespace: namespace,
                            uid: uid,
                            data: dataFields
                        },

                        {
                            success: (data) => {
                                data = JSON.parse(data);
                                Centauri.Notify(data.type, data.title, data.description);
                                $(".models .title s").remove();
                            }
                        }
                    );
                }

                if(type == "CE") {
                    dataFields = Centauri.Helper.FieldsHelper($(selector), fields, false);

                    let tempArr = [];
                    let tableInfo = {};
                    let i = 0;

                    Object.keys(dataFields).forEach((data) => {
                        tempArr.push(dataFields[data]);
                        tableInfo[i] = data;
                        i++;
                    });

                    let jsonDatas = JSON.stringify(tempArr);

                    Centauri.fn.Ajax(
                        "ContentElements",
                        "saveElementByUid",

                        {
                            uid: $contentelement.data("uid"),
                            datas: jsonDatas,
                            tableInfo: tableInfo
                        },

                        {
                            success: (data) => {
                                Centauri.Notify("success", "Element saved", "This element has been saved");
                            }
                        }
                    );
                }

                if(Centauri.isNull(dataFields)) {
                    dataFields = Centauri.Helper.FieldsHelper($(selector), fields);
                }
            }

            if(char == "r") {
                reload = true;
            }
        }

        if(e.keyCode == 116 || e.key == "F5") {
            reload = true;
        }

        if(reload) {
            e.preventDefault();

            if(!Centauri.Helper.VariablesHelper.isReloading) {
                Centauri.Helper.VariablesHelper.isReloading = true;

                Centauri.Components.ModulesComponent({
                    type: "load",
                    module: Centauri.Module,

                    cb: () => {
                        Centauri.Helper.VariablesHelper.isReloading = false;
                    }
                });
            }
        }
    });
};
