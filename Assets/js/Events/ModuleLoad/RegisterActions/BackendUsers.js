Centauri.Events.OnModuleLoadEvent.BackendUsers.RegisterActions = () => {
    let $action = $("table#be_users .actions .action");

    $action.on("click", this, function() {
        $tr = $(this).parent().parent().parent().parent();

        let action = $(this).attr("data-action");

        if(action == "actions-trigger") {
            $(this).toggleClass("active");
        }

        if(action == "edit") {
            Centauri.fn.Ajax(
                "BackendUser",
                "findByUid",

                {
                    uid: 1
                },

                {
                    success: (data) => {
                        let beUser = JSON.parse(data);

                        Centauri.Components.EditorComponent("show", {
                            id: "EditBeUser",
                            title: "Backend Users - Editing '" + beUser.username + "'",

                            form: [
                                {
                                    id: "hidden",
                                    type: "custom",
                                    custom: "switch",

                                    data: {
                                        label: "Hidden",
                                        isChecked: beUser.hidden
                                    }
                                },

                                {
                                    id: "username",
                                    label: "Username",
                                    type: "text",
                                    value: beUser.username
                                },

                                {
                                    id: "firstname",
                                    label: "Firstname",
                                    type: "text",
                                    value: beUser.firstname
                                },

                                {
                                    id: "lastname",
                                    label: "Lastname",
                                    type: "text",
                                    value: beUser.lastname
                                },

                                {
                                    id: "roles",
                                    type: "custom",
                                    custom: "html",

                                    data: {
                                        label: "Roles",
                                        html: $(".be-users-row").parent().html()
                                    }
                                }
                            ],

                            callbacks: {
                                save: (formData) => {
                                    console.log(formData);
                                }
                            }
                        });
                    }
                }
            );
        }
    });
};
