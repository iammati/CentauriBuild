Centauri.Helper.EditorComponentFieldHelper = () => {
    let datas = [];

    let selectors = [
        $(".bottom .ci-field > input", $editor),
        $(".bottom .ci-switch > label > input", $editor),
        $(".bottom .ci-field > textarea", $editor),
        $(".bottom .ci-field > select", $editor)
    ];

    selectors.forEach(selector => {
        $(selector).each(function() {
            let $this = $(this);

            if(Centauri.isUndefined($this.attr("disabled")) && Centauri.isUndefined($this.attr("readonly"))) {
                let id = $this.attr("id");

                if($this.is("select")) {
                    id = $this.data("id");
                }

                if(Centauri.isNotUndefined(id)) {
                    let value = $this.val();

                    if(Centauri.isNotUndefined($this.attr("type"))) {
                        if($this.attr("type") == "checkbox") {
                            value = $this.prop("checked");
                        }
                    }

                    datas[id] = value;
                }
            }
        });
    });

    var nDatas = $.extend(nDatas, datas);
    return JSON.stringify(nDatas);
};
