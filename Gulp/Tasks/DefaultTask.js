module.exports = class DefaultTask
{
    constructor(Gulp)
    {
        if(Gulp != undefined) {
            this.GulpInstance = Gulp;
            this.Gulp = this.GulpInstance.gulp;
        }
    }

    action = (action, options = {}) => {
        if(this.strContains(action, "-")) {
            let splittedAction = action.split("-");

            let type = splittedAction[0];
                action = splittedAction[1];

            if(type == "sass") {
                type = "css";

                if(action == "minify") {
                    return this.GulpInstance.minify(options);
                }
            }

            if(type == "js") {
                if(action == "terser") {
                    return this.GulpInstance.terser({
                        mangle: {
                            toplevel: true
                        }
                    }).on("error", (error) => this.emit("end"));
                }
            }

            if(action == "concat") {
                return this.GulpInstance.concat(this.GulpInstance.getSource("fileName", "." + type));
            }

            if(action == "dest") {
                return this.Gulp.dest(this.GulpInstance.getSource("output", type));
            }

            if(action == "del") {
                return this.GulpInstance.del([
                    this.GulpInstance.getSource("output", type + "/*." + type)
                ], {
                    force: true
                });
            }

            if(action == "rev") {
                const fs = require("fs");

                let unixVal = this.getUnix();
                let fileName = this.GulpInstance.getSource("fileName");
                let srcRev = this.GulpInstance.getSource("rev");

                fs.exists(srcRev, (exists) => {
                    if(!exists) {
                        fs.open(srcRev, "w", (err, file) => {
                            if(err) throw err;
                        });
                    }

                    fs.readFile(srcRev, "utf-8", (err, data) => {
                        if(data.length == 0) {
                            data = "{}";
                        }

                        let jsonData = JSON.parse(data);
                        let newData = [];

                        newData[fileName + "." + type] = fileName + "-" + unixVal + "." + type;

                        newData = {
                            ...jsonData,
                            ...newData
                        };

                        fs.writeFile(srcRev, JSON.stringify(newData), (err) => {
                            if(err) throw err;
                        });
                    });
                });

                return unixVal;
            }
        } else {
            if(action == "sass") {
                return this.GulpInstance.sass(options);
            }
        }
    }

    /**
     * Checks if a string contains a specific (given) char.
     * 
     * @param {string} string
     * @param {string} char
     * 
     * @return {boolean}
     */
    strContains = (string, char) => {
        return (!!~string.indexOf(char));
    }

    getUnix = () => Math.floor(new Date().getTime() / 1000);
}
