Centauri.View.PagesView = function() {
    $("a[data-ajax]").each(function() {
        $a = $(this);

        $a.on("click", function(e) {
            e.preventDefault();

            var uid = $(this).data("uid") ? $(this).data("uid") : undefined;

            Centauri.fn.Ajax(
                "Modal",
                "pageedit",

                {
                    uid: uid
                },

                {
                    success: function(data) {
                        $("#content").html(data);
                    },

                    error: function(data) {
                        console.error(data);
                    }
                }
            );
        });
    });
};
