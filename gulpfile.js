/**
 * Requiring and making an instance of GulpClass.
 */
let GulpClass = require("./Gulp/Gulp.js");
const GulpInstance = new GulpClass;

/**
 * Configuring the GulpInstance - adding sources.
 */
GulpInstance.addSource("build", "./");
GulpInstance.addSource("input", "./Assets/");
GulpInstance.addSource("output", "./../public/backend/");
GulpInstance.addSource("nodeModules", "./node_modules/");
GulpInstance.addSource("fileName", "centauri.min");
GulpInstance.addSource("rev", "./../public/rev-manifest.json");
GulpInstance.addSource("packages", "./Packages/");

/**
 * Adding required node_modules.
 */
GulpInstance.addNodeModule("jquery/dist/jquery.min.js");
GulpInstance.addPackage("jquery-ui/jquery-ui.min.js");
GulpInstance.addNodeModule("jquery-focuspoint/js/jquery.focuspoint.min.js");
GulpInstance.addPackage("waves/dist/waves.min.js");
GulpInstance.addPackage("jquery-cropper/dist/jquery-cropper.js");
GulpInstance.addPackage("cropperjs/dist/cropper.min.js");
GulpInstance.addPackage("pickr/dist/pickr.min.js");
GulpInstance.addPackage("quill/js/quill.js");

GulpInstance.revInBuildMode = false;


/**
 * Build and Deploy Tasks for CSS / JS.
 */
let gulp = GulpInstance.gulp;

let ScssTaskClass = require("./Gulp/Tasks/ScssTask.js");
let JsTaskClass = require("./Gulp/Tasks/JsTask.js");
let MainTaskClass = require("./Gulp/Tasks/MainTask.js");

const ScssTask = GulpInstance.makeInstance(ScssTaskClass, GulpInstance);
const JsTask = GulpInstance.makeInstance(JsTaskClass, GulpInstance);
const MainTask = GulpInstance.makeInstance(MainTaskClass, GulpInstance);

gulp.task("css:build", ScssTask.call("build"));
gulp.task("js:build", JsTask.call("build"));

gulp.task("css:deploy", ScssTask.call("deploy"));
gulp.task("js:deploy", JsTask.call("deploy"));

gulp.task("sync:packages", MainTask.call("packages"));

/**
 * Watch-Task Configuration - Build and Deploy.
 */
gulp.task("watch:build:task", () => {
	gulp.watch(GulpInstance.getSource("input", "scss/**/*.{sass,scss}"), gulp.series("css:build"));
	gulp.watch(GulpInstance.getSource("input", "js/**/*.js"), gulp.series("js:build"));
});

gulp.task("watch:build", gulp.series("css:build", "js:build",
	gulp.parallel("watch:build:task")
));

gulp.task("build", gulp.series("watch:build"));

gulp.task("deploy", gulp.series("css:deploy", "js:deploy"));
