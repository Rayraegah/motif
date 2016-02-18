const FILE_ENCODING = 'utf-8';
const SOURCE_DIR = './src';
const BUILD_DIR = './dist';
const SOURCE_PATH = SOURCE_DIR + '/';
const BUILD_PATH = BUILD_DIR + '/';

var fs = require('fs');
var UglifyJS = require('uglify-js');
var UglifyCSS = require('uglifycss');

var js = {};
var css = {};

/**
 * Asnync function. The callback is the main build thread. 
 * So everything must happen inside it.
 * Yes. EVERYTHING.
 */
fs.readdir(SOURCE_DIR, function(error, files) {
    if (error) throw error;

    console.log('Preparing to build ' + files.length + ' files from ' + SOURCE_DIR);

    var jsfilecount = 0;
    var cssfilecount = 0;
    var $content;

    /** Filter JavaScript files and store file names */
    files.filter(function(filename) {
        return filename.substr(-3) === '.js';
    }).forEach(function(filename) {
		console.log('-*-js--*- ' + filename);
		jsfilecount += 1;
		js[filename] = UglifyJS.minify(SOURCE_PATH + filename);
    });

    /** Filter CSS files and store file names */
    files.filter(function(filename) {
        return filename.substr(-4) === '.css';
    }).forEach(function(filename) {
		console.log('-*-css-*- ' + filename);
		cssfilecount += 1;
		css[filename] = UglifyCSS.processFiles([SOURCE_PATH + filename]);
    });

    /** Create build dir if it does not exist */
    if(!fs.existsSync(BUILD_DIR)) {
    	fs.mkdirSync(BUILD_DIR);
    }

	console.log('Writing ' + jsfilecount + ' javascript file(s) to ' + BUILD_DIR);
    for(var jsfile in js) {
    	$content = js[jsfile].code;
    	fs.writeFile(BUILD_PATH + jsfile, $content, FILE_ENCODING, errorHandler);
    }

	console.log('Writing ' + cssfilecount + ' css file(s) to ' + BUILD_DIR);
    for(var cssfile in css) {
    	$content = css[cssfile];
    	fs.writeFile(BUILD_PATH + cssfile, $content, FILE_ENCODING, errorHandler);
    }

    console.log('done!');
});

function errorHandler(error) {
	if (error) throw error;
}