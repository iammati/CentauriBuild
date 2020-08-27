/**
 * This function is to easier AJAX-calls when sending file(s) as POST-request.
 * 
 * @param {string} ajax The name of the AjaxCLass.
 * @param {string} method Name of the method called inside the AjaxClass (ajax-argument).
 * @param {FormData} formData The FormData-Object which contains the file itself (as blob-format/-type!) and optional more data.
 * @param {object} callbacks JSON-Object of scopes e.g. success, error and complete.
 * 
 * @returns {void}
 */
Centauri.fn.FileAjax = (ajax, method, formData, callbacks) => {
    if(Centauri.isUndefined(callbacks.success)) {
        return console.error("Centauri.fn.FileAjax: Can't call an (File-)AJAX without a callback-handler for the success-scope!");
    }

    let url = Centauri.Helper.AjaxHelper.buildAjaxURL(Centauri.Utility.PathsUtility, ajax, method);

    if(Centauri.fn.Ajax.Overlayer) {
        $("#maincontent .overlayer").removeClass("hidden");
        $("#maincontent .overlayer .loader").removeClass("hidden");
    }

    formData.append("_method", "HEAD");

    Centauri.Helper.VariablesHelper.file_xhr = $.ajax({
        type: "POST",
        url: url,
        data: formData,

        cache: false,
        contentType: false,
        processData: false,

        success: (data) => {
            if(Centauri.fn.Ajax.Overlayer) {
                $("#maincontent .overlayer").addClass("hidden");
                $("#maincontent .overlayer .loader").addClass("hidden");
            }

            callbacks.success(data);
        },

        error: (data) => {
            $("#maincontent .overlayer").addClass("hidden");

            if(Centauri.fn.Ajax.Overlayer) {
                $("#maincontent .overlayer .loader").addClass("hidden");
            }

            if(!navigator.onLine) {
                Centauri.Notify("error", "Internet-Connection lost", "Make sure your connection is stable to execute this action.");
            }

            if(Centauri.isNotUndefined(callbacks.error)) {
                callbacks.error(data);
            } else {
                console.error(data);
            }
        },

        complete: (data) => {
            if(Centauri.isNotUndefined(callbacks.complete)) {
                callbacks.complete(data);
            }
        }
    });
};
