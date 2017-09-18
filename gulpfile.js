var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var watchify = require("watchify");
var gutil = require("gulp-util");
var del = require('del');
var browserSync = require('browser-sync').create();


var paths = {
    pages: ['src/*.html'],
    styles: ['src/*.css']
};

gulp.task('clean-dist', function () {
  return del([
    'dist/**/*'
  ]);
});

gulp.task('copy-polyfill', function () {
  return gulp.src("./node_modules/babel-polyfill/dist/polyfill.min.js")
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});


var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}));

gulp.task("copy-css", function () {
    return gulp.src(paths.styles)
        .pipe(gulp.dest("dist"));
});

function bundle() {
    return watchedBrowserify
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .on('error', function (err) {
            gutil.log(err.message);
            browserSync.notify("Browserify Error!");
            this.emit("end");
        })
        .pipe(source('main.js'))        
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())        
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("dist"))
        .pipe(browserSync.stream({once: true}));
}

gulp.task('bundle', function () {
    return bundle();
});

gulp.task("default", ["bundle", "copy-html", "copy-css", 'copy-polyfill', "clean-dist"], function () {    
    browserSync.init({
        server: "dist"
    });
});
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
