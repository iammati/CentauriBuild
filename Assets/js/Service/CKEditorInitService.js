Centauri.Service.RTEInitService = () => {
	$("body > .pcr-app").remove();

	Centauri.Service.RTEInitService.COLOR_SAVING = null;

	Centauri.Service.RTEInitService.toolbarOptions = [
		/** H-Tags and Font-Sizes */
		[
			{
				"header": [
					1,
					2,
					3,
					4,
					5,
					6,
					false
				]
			}
		],

		[
			{
				"size": [
					"small",
					false,
					"large",
					"huge"
				]
			}
		],

		/** Default Formatting-Buttons */
		[
			"bold",
			"italic",
			"underline",
			"strike"
		],


		[
			"blockquote",
			"code-block"
		],


		/** Custom Button Values */
		[
			{
				"header": 1
			},

			{
				"header": 2
			}
		],

		[
			{
				"list": "ordered"
			},

			{
				"list": "bullet"
			}
		],


		/** Superscript / Subscript */
		[
			{
				"script": "sub"
			},

			{
				"script": "super"
			}
		],


		/** Outdent / Indent */
		[
			{
				"indent": "-1"
			},

			{
				"indent": "+1"
			}
		],


		/** Text Direction */
		[
			{
				"direction": "rtl"
			}
		],


		/** Dropdown with defaults from theme */
		[
			{
				"color": [
					"color-picker"
				]
			},

			{
				"background": [
					"color-picker"
				]
			}
		],

		[
			{
				"font": []
			}
		],

		[
			{
				"align": [
					"",
					"center",
					"right",
					"justify"
				]
			}
		],


		/** Remove-Formatting Button */
		[
			"clean"
		]
	];

	Centauri.Service.RTEInitService.rteEditorInstances = [];

	$(".ci-textarea").each(function(index, value) {
		$this = $(this);

		let html = $(this).data("html");
		$(this).html(JSON.parse(html));

		var editorInstance = new Quill(".ci-textarea:not(.ql-container)", {
			modules: {
				toolbar: Centauri.Service.RTEInitService.toolbarOptions
			},

			theme: "snow"
		});

		Centauri.Service.RTEInitService.rteEditorInstances[index] = {
			quill: editorInstance,
			pickr: null
		};
	});

	$(".ql-color .ql-picker-options, .ql-background .ql-picker-options").hide();

	$.each(Centauri.Service.RTEInitService.rteEditorInstances, function(index, instance) {
		/** Initialization of Color-Pickr */
		var pickrSelector = "rte-color-picker-" + index;
		$("body").append("<div id='" + pickrSelector + "'></div>");

		Centauri.Service.RTEInitService.rteEditorInstances[index]["pickr"] = Pickr.create({
			el: "#" + pickrSelector,
			theme: "nano",

			components: {
				/** Main components */
				preview: true,
				opacity: true,
				hue: true,

				/** Input / output Options */
				interaction: {
					hex: true,
					rgba: true,
					hsla: true,
					hsva: true,
					cmyk: true,
					input: true,
					clear: true,
					save: true
				}
			}
		});

		Centauri.Service.RTEInitService.rteEditorInstances[index]["pickr"].on("save", (colorObj, pickrInstance) => {
			Centauri.Service.RTEInitService.rteEditorInstances[index]["quill"].format(Centauri.Service.RTEInitService.COLOR_SAVING, colorObj.toHEXA());

			Centauri.Service.RTEInitService.rteEditorInstances[index]["pickr"].hide();
		});


		$(".ql-color.ql-picker.ql-color-picker, .ql-background.ql-picker.ql-color-picker").off("click");
		$(".ql-color.ql-picker.ql-color-picker, .ql-background.ql-picker.ql-color-picker").on("click", this, function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();

			if($(this).hasClass("ql-background")) {
				Centauri.Service.RTEInitService.COLOR_SAVING = "background";
			} else {
				Centauri.Service.RTEInitService.COLOR_SAVING = "color";
			}

			$(this).parent().find(".pickr button").trigger("click");

			return false;
		});
	});

	var i = 0;
	$("body > div.pickr").each(function() {
		$(this).prependTo($(".ql-toolbar").eq(i).find(".ql-formats:nth-child(10)"));

		i++;
	});

	$(".ql-editor *").each(function() {
		let color = $(this).css("color");

		if(color == "#fff" || color == "#ffffff" || color == "white" || color == "rgb(255, 255, 255)") {
			$(this).css("text-shadow", "0px 1px 5px black");
		}
	});
};
