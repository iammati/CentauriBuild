Centauri.View.LoginView = () => {
    $("#login form").on("submit", this, function(e) {
        e.preventDefault();

        e.stopPropagation();
        e.stopImmediatePropagation();

        Centauri.fn.Ajax(
            "Backend",
            "login",

            {
                username: $("#username").val(),
                password: $("#password").val()
            },

            {
                success: function(data) {
                    data = JSON.parse(data);

                    if(data.type == "success") {
                        // $(document.body).load(window.location.href, function() {
                        //     Centauri.Notify(data.type, data.title, data.description);
                        //     Centauri.Events.OnBackendEvent();

                        //     console.log(data);

                        //     // location.reload();
                        // });

                        let newHTMLDoc = document.open("text/html", "replace");
                        newHTMLDoc.write(data.html);
                        newHTMLDoc.close();

                        Centauri.Notify(data.type, data.title, data.description);
                        // Centauri.Lib.CKEditorLib();

                        Centauri.load();
                    }
                }
            }
        );

        return false;
    });
};
