Centauri.Service.ImageService = function(type, id) {
    if(type == "findBlobByID") {
        var file = document.getElementById(id).files[0];
        var imgData = Centauri.Service.ImageService.convertDataURIToBinary(Centauri.Helper.VariablesHelper.__CME__FIELDS[id], file.type);

        return imgData;
    }
};

Centauri.Service.ImageService.convertDataURIToBinary = function(dataURI, fileType="image/png") {
    var BASE64_MARKER = ";base64,";
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for(i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }

    var binaryImg = array;

    var blob = new Blob([binaryImg], {
        type: fileType
    });

    var blobURL = window.URL.createObjectURL(blob);

    return {
        binaryImg: binaryImg,
        blob: blob,
        blobURL: blobURL
    };
};
