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
                            toplevel: true,

                            reserved: [
                                "Centauri"
                            ]
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

    // syncPackages = () => {
    //     this.execute("cp -r " + this.GulpInstance.getSource("Build", "Packages") + " " + this.GulpInstance.getSource("output", "Packages"));
    // }

    /**
     * @param {string} command A shell command to execute
     * @return {Promise<string>} A promise that resolve to the output of the shell command, or an error
     * @example const output = await execute("ls -alh");
     */
    execute = (command) => {
        let childProcess = this.GulpInstance.childProcess;

        /**
         * @param {Function} resolve A function that resolves the promise
         * @param {Function} reject A function that fails the promise
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
         */
        return new Promise(function(resolve, reject) {
            /**
             * @param {Error} error An error triggered during the execution of the childProcess.exec command
             * @param {string|Buffer} standardOutput The result of the shell command execution
             * @param {string|Buffer} standardError The error resulting of the shell command execution
             * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
             */
            childProcess.exec(command, function(error, standardOutput, standardError) {
                if (error) {
                    reject();

                    return;
                }

                if (standardError) {
                    reject(standardError);

                    return;
                }

                resolve(standardOutput);
            });
        });
    }
}
