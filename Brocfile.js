// This is the Brocfile. It sets up all the assets from the input JS/CSS/images
// and so on and converts them to static assets in the output directory or
// preview server.
var fs             = require('fs');
var babel          = require('broccoli-babel-transpiler');
var broccoliSource = require('broccoli-source');
var Sass           = require('sass');
var SassSourceMaps = require('broccoli-sass-source-maps');
var concat         = require('broccoli-concat');
var gzip           = require('broccoli-gzip');
var handlebars     = require('broccoli-handlebars-precompiler');
var helper         = require('./helpers/broccoli');
var pug            = require('broccoli-pug');
var mergeTrees     = require('broccoli-merge-trees');
var uglify         = require('broccoli-uglify-sourcemap');
var UnwatchedDir   = broccoliSource.UnwatchedDir;
var WatchedDir     = broccoliSource.WatchedDir;
var watchify       = require('broccoli-watchify');

// Create tmp directory for builds
if (!fs.existsSync("tmp")) {
  fs.mkdirSync("tmp");
}

const compileSass = SassSourceMaps(Sass);

// Covert main.scss stylesheet to app.css stylesheet in output directory
var styles = new compileSass([new WatchedDir('src/stylesheets')], 'main.scss', 'app.css');

// Process all the JavaScript.
// First we use babel to convert the ES6 to ES5 for web browsers.
// Then use browserify to handle any `require` statements and automatically
// insert the required library inline.
var scripts = new babel(new WatchedDir("src/scripts"));
scripts = new watchify(scripts, {
  browserify: {
    entries: ['./app.js']
  },
  outputFile: 'application.js',
  init: function (b) {
    b.transform('babelify', { presets: ['es2015'] });
  }
});
scripts = new babel(scripts, { browserPolyfill: true });

// == Load External Libraries ==
// Order is important. Scripts will be concatenated in this order, and
// styles will be concatenated in this order (into separate JS and CSS files
// obviously).
// Assets will be funnelled into a single tree with the same name
// as the source asset directory. (e.g. 'img' directory will create 'img'
// directory in output.)
helper.loadLibrary('node_modules/jquery/dist', {
  scripts: ['jquery.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('node_modules/bootstrap/dist', {
  scripts: ['js/bootstrap.js'],
  styles: ['css/bootstrap.css'],
  assets: ['']
});

helper.loadLibrary('node_modules/font-awesome', {
  scripts: [],
  styles: ['css/font-awesome.css'],
  assets: ['fonts']
});

helper.loadLibrary('node_modules/leaflet/dist', {
  scripts: ['leaflet.js'],
  styles: ['leaflet.css'],
  assets: ['images']
});

helper.loadLibrary('node_modules/leaflet.markercluster/dist', {
  scripts: ['leaflet.markercluster.js'],
  styles: ['MarkerCluster.css', 'MarkerCluster.Default.css'],
  assets: []
});

helper.loadLibrary('node_modules/datatables/media', {
  scripts: ['js/jquery.dataTables.min.js'],
  styles: ['css/jquery.dataTables.min.css'],
  assets: ['images']
});

helper.loadLibrary('node_modules/proj4/dist', {
  scripts: ['proj4.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('node_modules/proj4leaflet/src', {
  scripts: ['proj4leaflet.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('node_modules/polarmap', {
  scripts: ['dist/polarmap.js'],
  styles: ['css/polarmap.css'],
  assets: []
});

helper.loadLibrary('node_modules/q', {
  scripts: ['q.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('node_modules/underscore', {
  scripts: ['underscore.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('node_modules/backbone', {
  scripts: ['backbone.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('node_modules/backbone.marionette/lib', {
  scripts: ['backbone.marionette.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('node_modules/handlebars/dist', {
  scripts: ['handlebars.js'],
  styles: [],
  assets: []
});

helper.loadLibrary('src', {
  scripts: [],
  styles: [],
  assets: ['images']
});

// == Build Templates ==
// Combines Handlebars templates into a single file. MUST be loaded after the
// Handlebars library.
var templates = new concat(new handlebars(new WatchedDir('src/templates'), {
  namespace: 'App.Templates',
  srcDir: '.'
}), {
  outputFile: '/templates.js'
});

// == Concatenate script trees ==
// Merge the libraries tree with the app scripts tree, then concatenate into
// a single script file.
var allScripts = new concat(new mergeTrees([helper.getScriptsTree(), scripts, templates]), {
  headerFiles: ['libraries.js', 'application.js', 'templates.js'],
  outputFile: 'app.js'
});

// Apply uglify to minify the javascript in production.
// (The process is too slow to do this on-the-fly in development.)
if (process.env["NODE_ENV"] === "production") {
  allScripts = new uglify(allScripts);
}

// == Concatenate style trees ==
var allStyles = new concat(new mergeTrees([helper.getStylesTree(), styles]), {
  headerFiles: ['libraries.css', 'app.css'],
  outputFile: 'style.css',
  sourceMapConfig: {
    enabled: false,
    extensions: ['css'],
    mapCommentType: 'block'
  }
});

// Compile view files
var views = new pug([new WatchedDir('src/views')], {
  render: true
});

// Build gzipped versions of the files, but only in production.
var doGZIP;
if (process.env["NODE_ENV"] === "production") {
  doGZIP = gzip;
} else {
  doGZIP = function(node) { return node; };
}

module.exports = doGZIP(new mergeTrees([views,
  helper.getAssetsTree(),
  allStyles,
  allScripts
]), {
  extensions: ['css', 'html', 'js'],
  keepUncompressed: true
});
