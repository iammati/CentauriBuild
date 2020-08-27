Centauri.Components.AccordionComponent = () => {
    $(".accordions .accordion").each(function() {
        let $accordion = $(this);

        $(".top", $accordion).off("click");
        $(".top > div > button[data-trigger]", $accordion).off("click");

        $(".top", $accordion).on("click", this, function(e) {
            let $this = document.elementFromPoint(e.pageX, e.pageY);

            if($this.classList.contains("top")) {
                let $parent = $(this).parent();

                $parent.find("> .bottom").slideToggle();
                $parent.toggleClass("active");
            }
        });

        $(".top > div > button[data-trigger]", $accordion).on("click", this, function() {
            let $this = $(this);
            let trigger = $this.data("trigger");

            let $origAccordion = $this.parent().parent().parent();

            if(
                trigger == "hideIRByUid" ||
                trigger == "deleteIRByUid"
            ) {
                let data = {
                    uid: $origAccordion.data("uid"),
                    type: $origAccordion.parent().data("type"),
                    parenttype: $origAccordion.parent().data("type-parent")
                };

                if(trigger == "deleteIRByUid") {
                    
                }

                Centauri.fn.Ajax(
                    "InlineRecords",
                    trigger,

                    {
                        data: data
                    },

                    {
                        success: (data) => {
                            data = JSON.parse(data);
                            Centauri.Notify(data.type, data.title, data.description);

                            if(trigger == "hideIRByUid") {
                                $this.toggleClass("btn-primary btn-info");
                                $("i", $this).toggleClass("fa-eye fa-eye-slash");
                            }
                        }
                    }
                );
            }
        });
    });
};
