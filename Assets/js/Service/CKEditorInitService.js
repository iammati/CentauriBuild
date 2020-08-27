Centauri.Service.CKEditorInitService = () => {
	console.log("CKEDITORINITSERVICE: @todo CUSTOM CKEDITOR?");

	/*
    if(!!$(".ck.ck-reset_all.ck-body.ck-rounded-corners").length) {
        $(".ck.ck-reset_all.ck-body.ck-rounded-corners").remove();
	}

	let $textareas = $(".ci-textarea");
	$textareas.each(function() {
		if(!$(this).hasClass("rte-initialized")) {
			$(this).addClass("rte-initialized");

			let textareaNode = $(this).get(0);

			let html = $(this).attr("data-html");
			let parseJson = $(this).attr("data-parsejson");

			if(Centauri.isUndefined(parseJson)) {
				if(Centauri.isNotUndefined(html)) {
					html = JSON.parse(html);
				}
			}

			DecoupledDocumentEditor.create(textareaNode, {
				language: "en",

                toolbar: {
					items: [
						"heading",
						"|",
						"fontSize",
						"fontFamily",
						"fontColor",
						"fontBackgroundColor",
						"|",
						"bold",
						"italic",
						"underline",
						"strikethrough",
						"removeFormat",
						"highlight",
						"|",
						"alignment",
						"pageBreak",
						"|",
						"numberedList",
						"bulletedList",
						"|",
						"indent",
						"outdent",
						"|",
						"todoList",
						"link",
						"blockQuote",
						"imageUpload",
						"insertTable",
						"mediaEmbed",
						"|",
						"undo",
						"redo"
					]
				},

                heading: {
                    options: [
                        { model: "paragraph", title: 'Paragraph', class: 'ck-heading_paragraph' },
                        { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
                        { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
                        { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
                        { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
                    ]
                },

				image: {
					toolbar: [
						"imageTextAlternative",
						"imageStyle:full",
						"imageStyle:side"
					]
				},

				table: {
					contentToolbar: [
						"tableColumn",
						"tableRow",
						"mergeTableCells"
					]
				},

				licenseKey: ""
			})
            .then(editor => {
                window.editor = editor;

                const viewFragment = editor.data.processor.toView(html);
				const modelFragment = editor.data.toModel(viewFragment);
				
                editor.model.insertContent(modelFragment);

				// Set a custom container for the toolbar.
                $(this).parent().find(".document-editor__toolbar").append(editor.ui.view.toolbar.element);
                $(this).parent().find(".ck-toolbar").addClass("ck-reset_all");
			})
            .catch(error => {
                console.error(error);
            });
		}
	});
	*/
};
