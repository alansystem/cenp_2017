"use strict";

var fs    = require('fs');
var path  = require('path');

module.exports = function(context) {
    var encoding = 'utf-8';
    var filepath = 'platforms/ios/cordova/build.xcconfig';

    if (context.opts.cordova.platforms.indexOf('ios') === -1) return;
    if (!context.opts.options) return;
    if (!context.opts.options.buildConfig) return;


    var buildType = context.opts.options.release ? 'release' : 'debug';

    var buildConfigPath = context.opts.options.buildConfig;
    if (!path.isAbsolute(buildConfigPath)) {
      buildConfigPath = path.join(context.opts.projectRoot, context.opts.options.buildConfig);
    }
    var config = require(buildConfigPath);


    if (!config.ios) return;
    if (!config.ios[buildType]) return;
    if (!config.ios[buildType].developmentTeam) return;


    var xcconfig = fs.readFileSync(filepath, encoding);

    if (xcconfig.indexOf('DEVELOPMENT_TEAM') === -1) {
        var content = '\nDEVELOPMENT_TEAM = ' + config.ios[buildType].developmentTeam;

        xcconfig += content;
        fs.writeFileSync(filepath, xcconfig, encoding);
    }
};


//var fs = require("fs");
//var path = require("path");
//var Q;
//var glob;

//module.exports = function (context) {
//    // Only bother if we're on OSX
//    if (process.platform === "darwin") {

//        console.log("Detecting broken symlinks.");

//        // Grab the Q, glob node modules from cordova
//        Q = context.requireCordovaModule("q");
//        glob = context.requireCordovaModule("glob");

//        // Need to return a promise since glob is async
//        var deferred = Q.defer();

//        // Find all custom framework files within plugin source code for the iOS platform
//        glob("platforms/ios/*/Plugins/**/*.framework/**/*", function (err, possibleLinks) {
//            if (err) {
//                deferred.reject(err);
//            } else {
//                // Folder symlinks like "Header" will appear as normal files without an extension if they came from
//                // npm or were sourced from windows. Inside these files is the relative path to the directory the 
//                // symlink points to. So, start detecting them them by finding files < 1k without a file extension.
//                possibleLinks.forEach(function (possibleLink) {
//                    possibleLink = path.join(context.opts.projectRoot, possibleLink);
//                    if (path.basename(possibleLink).indexOf(".") < 0) {
//                        var stat = fs.statSync(possibleLink);
//                        if (stat.isFile() && stat.size < 1024) {

//                            // Now open each of these small files and see if the contents resolves to a valid path
//                            var srcPath = fs.readFileSync(possibleLink, "utf8");
//                            if (fs.existsSync(path.join(possibleLink, "..", srcPath))) {

//                                // If so, convert the file to a symlink
//                                console.log("Reparing symlink " + possibleLink);
//                                fs.unlinkSync(possibleLink);
//                                fs.symlinkSync(srcPath, possibleLink);
//                            }
//                        }
//                    }
//                });
//                deferred.resolve();
//            }
//        });

//        return deferred.promise;
//    }
//}