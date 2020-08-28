const DefaultTask = require("./DefaultTask");

module.exports = class MainTask extends DefaultTask
{
    constructor(Gulp)
    {
        super(Gulp);
    }

    call = (type) => {
        return this[type];
    }

    syncPackages = () => {
        this.execute("cp -r " + this.GulpInstance.getSource("Build", "Packages") + " " + this.GulpInstance.getSource("output", "Packages"));
    }
}
