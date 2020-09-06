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
                        let newHTMLDoc = document.open("text/html", "replace");
                        newHTMLDoc.write(data.html);
                        newHTMLDoc.close();

                        Centauri.Notify(data.type, data.title, data.description);

                        Centauri.load();
                    }
                }
            }
        );

        return false;
    });
};
