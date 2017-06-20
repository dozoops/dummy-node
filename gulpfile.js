var angularSort = require('gulp-angular-filesort');
var combinedStream = require('combined-stream');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var runSequence = require('run-sequence');
var del = require('del');
var es = require('event-stream');
var fs = require('fs');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gp = require('gulp-protractor');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var jshintCheckstyle = require('gulp-jshint-xml-file-reporter');
var karma = require('karma').server;
var less = require('gulp-less');
var bowerFiles = require('main-bower-files');
var minifyCSS = require('gulp-minify-css');
var minimist = require('minimist');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var sftp = require('gulp-sftp');

// --- Environment
var env = minimist(process.argv.slice(2)).env || 'LOCAL';
var prod = (env === 'PROD');
gutil.log('env = ' + env);

// --- Settings
var buildFolder = 'build';
var distFolder = 'dist';
var srcFolder = 'app';
var testFolder = 'test';
var sources = srcFolder + '/**/*'; 
var environmentConfig = 'config/config.'+env.toLowerCase()+'.js';
var javascriptSources = [environmentConfig, srcFolder + '/**/*.js'];
var lessEntryPoints = srcFolder + '/app.less';

// --- Tasks

// Builds the app and starts a local HTTP server
gulp.task('default', function (cb) {
  runSequence('clean', 'bundle', 'server', 'watch', cb);
});

gulp.task('watch', function () {
  // Rebuild the project when sources change
  gulp.watch(sources, ['bundle']).on('change', function(event) {
    gutil.log('File ' + event.path + ' was ' + event.type);
  });
});

gulp.task('dist', function(cb) {
  runSequence('clean', 'bundle', cb);
});

// Fichier .ftppass
// {
//   "main": {
//     "user": "appadm01",
//     "pass": "***"
//   }
// }

//gulp.task('deploy', ['dist'], function() { 
//  return gulp.src(distFolder+'/**/*')
//    .pipe(sftp({
//      host: '10.179.1.2',
//      auth: 'main',
//      remotePath: '/app/list/.../'
//    }));
//});

//gulp.task('deploy', ['dist'], function() { 
//  return gulp.src(distFolder+'/**/*')
//    .pipe(sftp({
//      host: '10.179.139.66',
//      user: "appadm01",
//      pass: "4W8@s92r",
//      remotePath: '/app/list/l002mys5803d1/apache_httpd/httpd/htdocs/redmine-taskboard/'
//    }));
//});

gulp.task('lint', function () {
  return gulp.src(javascriptSources.concat('./gulpfile.js'))
    .pipe(jshint())
    .pipe(gulpif(prod, jshint.reporter(jshintCheckstyle), jshint.reporter('default')))
    .on('end', function () {
      if (prod) {
        fs.mkdir(buildFolder, function () {
          jshintCheckstyle.writeFile({
            format: 'checkstyle',
            filePath: buildFolder + '/jshint.xml'
          })();
        });
      }
    });
});

// Bundles source files into a single entry point
gulp.task('bundle', ['lint'], function (cb) {
  var thirdPartyCss = gulp.src(bowerFiles('**/*.css'), { base: __dirname + '/bower_components' });
  var cssFiles = (prod ?
    combinedStream.create()
      .append(thirdPartyCss)
      .append(gulp.src(lessEntryPoints)
      .pipe(less()))
      .pipe(minifyCSS())
      .pipe(rev()) :
    combinedStream.create()
      .append(thirdPartyCss)
      .append(
        gulp.src(lessEntryPoints)
          .pipe(sourcemaps.init())
          .pipe(less())
          .on('error', function(e) {
            gutil.log(e);
            cb();
          })
          .pipe(sourcemaps.write())
      )
  ).pipe(gulp.dest(distFolder));

  var javascriptFiles = combinedStream.create()
    .append(gulp.src(bowerFiles('**/*.js'), { base: __dirname + '/bower_components' }))
    .append(gulp.src(javascriptSources).pipe(angularSort()))
    .on('error', function(e) {
      gutil.log(e);
      cb();
    })
    .on('end', function() {
      gutil.log(javascriptSources);
    });
  var jsFiles = (prod ?
    javascriptFiles.pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(rev()) :
    javascriptFiles
  ).pipe(gulp.dest(distFolder));

  var htmlAssets = gulp.src(srcFolder + '/**/*.html')
    .pipe(inject(es.merge(cssFiles, jsFiles), { ignorePath: '../dist/', relative: true }))
    .pipe(gulp.dest(distFolder));

  var otherAssetsGlob = ['!**/*.js', '!**/*.less', '!**/*.css', '!**/*.html'];
  var otherAssets = es.merge(
    gulp.src(bowerFiles('**/*').concat(otherAssetsGlob), { base: __dirname + '/bower_components' }),
    gulp.src([srcFolder + '/**/*'].concat(otherAssetsGlob))
  ).pipe(gulp.dest(distFolder));

  return es.merge(htmlAssets, otherAssets);
});

gulp.task('clean', function (k) {
  del([distFolder + '/**/*.*', buildFolder + '/**/*.*'], k);
});

// Starts an HTTP server so that developers can play with their app by browsing at http://localhost:8000/
gulp.task('server', function () {
  connect.server({
    port: 8000,
    root: distFolder
  });
});

// Runs the tests (both unit tests and end-to-end tests)
gulp.task('test', function(cb) {
  runSequence('test-unit', 'test-e2e', cb);
});

// Runs the unit tests
gulp.task('test-unit', ['karma-update'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, function () { done(); });
});

gulp.task('karma-update', function () {
  return gulp.src('./karma.conf.js')
    .pipe(inject(gulp.src(bowerFiles('**/*.js', { includeDev: true }).concat(javascriptSources).concat(testFolder + '/unit/**/*.spec.js'), { read: false }), {
      starttag: 'files: [',
      endtag: ']',
      transform: function (filepath, file, i, length) {
        return ' ".' + filepath + '"' + (i + 1 < length ? ',' : '');
      }
    }))
    .pipe(gulp.dest('./'));
});

// Runs the end-to-end tests
gulp.task('test-e2e', ['webdriver-update', 'server'], function (done) {
  gulp.src([
      // DECLARER LES SPECS DANS protractor.conf.js (LAISSER LE TABLEAU VIDE SINON GULP PREND LA MAIN)
    ])
    .pipe(gp.protractor({
      configFile: './protractor.config.js'
    }))
    .on('error', function (e) {
      connect.serverClose();
      throw e;
    })
    .on('end', function () {
      connect.serverClose();
      done();
    });
});

gulp.task('webdriver-update', gp.webdriver_update);
