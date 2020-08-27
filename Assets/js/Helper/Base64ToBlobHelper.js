const Base64ToBlobHelper = (base64) => {
    if(Centauri.strContains(base64, ";base64,")) {
        base64 = base64.split(";base64,")[1];
    }

    return atob(base64);
};
