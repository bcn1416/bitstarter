#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var URLADDRESS = 'A';
var HTMLFILE = 'F';
var url = ' ';

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

// Load html file content
var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

// Process HTML address
var checkHtmlURL = function(urladdress, checksfile) {
	// Retrieve URL Address content
        restler.get(urladdress).on('complete',
                function(result) {
                        if (result instanceof Error) {
                                console.log('Error: ' + result.message);
                                process.exit(1);
                        } else {
 				outCheckHtml(cheerioURLAddress(result), checksfile);
                        }
                }
        );
};

// Out Check file
var outCheckHtml = function(data, checksfile) {
	var checks = loadChecks(checksfile).sort();
        var out = {};
        for(var ii in checks) {
        	var present = data(checks[ii]).length > 0;
                out[checks[ii]] = present;
        }
        var outJson = JSON.stringify(out, null, 4);
        console.log(outJson);
};

// Load URL Address content
var cheerioURLAddress = function(htmldata) {
	return cheerio.load(htmldata);
};

// Load tags for validate
var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
	outCheckHtml(cheerioHtmlFile(htmlfile), checksfile);
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists))
	.option('-u, --url <url_adress>', 'Page URL')
        .parse(process.argv);
		
	// Only File either URL
	if ((program.file) && (program.url)) {
		console.log("Select --File <html_file either --url <url-adress");
        	process.exit(1);
	}
	
	// If select URL Address
       if (program.url) {
		checkHtmlURL(program.url, program.checks);
	}
	
	// If select HTML File
	if (program.file) {
		checkHtmlFile(program.file, program.checks);
	}
	
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
