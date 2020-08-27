Centauri.Helper.CalcuateRatioAspectHelper = (str) => {
    return (str.replace(/\s/g, "").match(/[+\-]?([0-9\.]+)/g) || []).reduce((sum, value) => {
        return parseFloat(sum) / parseFloat(value);
    });
};
