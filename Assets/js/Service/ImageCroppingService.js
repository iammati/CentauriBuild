Centauri.Service.ImageCroppingService = function(img) {
    $image = $(img);

    $image.cropper({
        initialAspectRatio: 16 / 9,
        aspectRatio: 16 / 9,
        dragMode: "move",
        minContainerWidth: 1140,
        minContainerHeight: 450,

        ready: function() {
            var canvas = $image.cropper("getCroppedCanvas", undefined);
            var base64 = canvas.toDataURL("image/jpeg", 1);

            var fileData = Centauri.Service.ImageService.convertDataURIToBinary(base64);
            Centauri.Helper.VariablesHelper.fileData = fileData;
        },

        cropend: function() {
            var canvas = $image.cropper("getCroppedCanvas", undefined);
            var base64 = canvas.toDataURL("image/jpeg", 1);

            var fileData = Centauri.Service.ImageService.convertDataURIToBinary(base64);
            Centauri.Helper.VariablesHelper.fileData = fileData;
        }
    });

    // Get the Cropper.js instance after initialized
    var cropper = $image.data("cropper");
};
