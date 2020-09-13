Centauri.Events.OnModuleLoadEvent.Schedulers = () => {
    let $table = $("table#schedulers");

    $(".exec-btn", $table).each(function() {
        let $btn = $(this);

        $btn.on("click", this, function() {
            let $tr = $(this).parents("tr");
            let uid = $tr.data("uid");

            Centauri.fn.Ajax(
                "Scheduler",
                "execute",

                {
                    uid: uid
                },

                {
                    success: (data) => {
                        data = JSON.parse(data);
                        Centauri.Notify(data.type, data.title, data.description);

                        let scheduler = data.scheduler;

                        $("td:nth-child(3)", $tr).text(scheduler.last_runned);

                        let _class = "success";
                        if(scheduler.state == "FAILED") {
                            _class = "danger";
                        }

                        $("td:nth-child(4) a", $tr).text(scheduler.state);
                        $("td:nth-child(4) a", $tr).attr("class", "btn btn-" + _class + " p-2 m-0 float-left");
                    }
                }
            );
        });
    });

    /**
     * Module:schedulers Buttons
     */
    $("#module_buttons button").each(function() {
        $button = $(this);

        $button.on("click", this, function() {
            let btnType = $(this).data("button-type");

            if(btnType == "create") {
                Centauri.fn.Ajax(
                    "Scheduler",
                    "getSchedulers",

                    {},

                    {
                        success: (schedulerNamespaces) => {
                            schedulerNamespaces = JSON.parse(schedulerNamespaces);

                            Centauri.Components.EditorComponent("show", {
                                id: "CreateNewScheduler",
                                title: "Scheduler-Editor - New",

                                form: [
                                    {
                                        id: "name",
                                        label: "Name",
                                        type: "text"
                                    },

                                    {
                                        id: "namespace",
                                        type: "custom",
                                        custom: "select",

                                        data: {
                                            label: "ID (Namespace)",
                                            options: schedulerNamespaces
                                        }
                                    },

                                    {
                                        id: "time",
                                        type: "custom",
                                        custom: "select",

                                        data: {
                                            label: "Time",

                                            options: [
                                                {
                                                    name: "Every minute",
                                                    value: "everyMinute"
                                                },

                                                {
                                                    name: "Every 5 minutes",
                                                    value: "everyFiveMinutes"
                                                },

                                                {
                                                    name: "Every hour",
                                                    value: "hourly"
                                                },

                                                {
                                                    name: "Daily",
                                                    value: "daily"
                                                }
                                            ]
                                        }
                                    }
                                ],

                                callbacks: {
                                    save: (formData) => {
                                        Centauri.fn.Ajax(
                                            "Scheduler",
                                            "create",

                                            {
                                                formData: formData
                                            },

                                            {
                                                success: (data) => {
                                                    data = JSON.parse(data);
                                                    Centauri.Notify(data);

                                                    Centauri.Components.ModulesComponent({
                                                        type: "load",
                                                        module: "schedulers"
                                                    });
                                                }
                                            }
                                        );
                                    }
                                }
                            });
                        }
                    }
                );
            }
        });
    });

    /**
     * Actions
     */
    $(".action", $table).each(function() {
        let $action = $(this);

        $action.on("click", this, function() {
            let $this = $(this);
            let action = $this.data("action");

            let uid = $this.parents("tr").data("uid");

            Centauri.fn.Ajax(
                "Scheduler",
                "findByUid",

                {
                    uid: uid
                },

                {
                    success: (scheduler) => {
                        if(action == "edit") {
                            Centauri.fn.Ajax(
                                "Scheduler",
                                "getSchedulers",
            
                                {},
            
                                {
                                    success: (schedulerNamespaces) => {
                                        schedulerNamespaces = JSON.parse(schedulerNamespaces);

                                        Centauri.Components.EditorComponent("show", {
                                            id: "Scheduler-" + uid,
                                            title: "Scheduler-Editor - " + scheduler.name,

                                            form: [
                                                {
                                                    id: "name",
                                                    label: "Name",
                                                    type: "text",
                                                    value: scheduler.name
                                                },

                                                {
                                                    id: "namespace",
                                                    label: "ID (Namespace)",
                                                    type: "custom",
                                                    custom: "select",

                                                    data: {
                                                        label: "ID (Namespace)",
                                                        selectedOptionValue: scheduler.namespace,
                                                        options: schedulerNamespaces
                                                    }
                                                },

                                                {
                                                    id: "time",
                                                    type: "custom",
                                                    custom: "select",

                                                    data: {
                                                        label: "Time",
                                                        selectedOptionValue: scheduler.time,

                                                        options: [
                                                            {
                                                                name: "Every minute",
                                                                value: "everyMinute"
                                                            },

                                                            {
                                                                name: "Every 5 minutes",
                                                                value: "everyFiveMinutes"
                                                            },

                                                            {
                                                                name: "Every hour",
                                                                value: "hourly"
                                                            },

                                                            {
                                                                name: "Daily",
                                                                value: "daily"
                                                            }
                                                        ]
                                                    }
                                                }
                                            ],

                                            callbacks: {
                                                save: (formData) => {
                                                    Centauri.fn.Ajax(
                                                        "Scheduler",
                                                        "saveByUid",

                                                        {
                                                            uid: uid,
                                                            formData: formData
                                                        },

                                                        {
                                                            success: (data) => {
                                                                data = JSON.parse(data);
                                                                Centauri.Notify(data.type, data.title, data.description);

                                                                Centauri.Components.ModulesComponent({
                                                                    type: "load",
                                                                    module: "schedulers"
                                                                });
                                                            }
                                                        }
                                                    )
                                                }
                                            }
                                        });
                                    }
                                }
                            );
                        }
                    }
                }
            );
        });
    });
};
