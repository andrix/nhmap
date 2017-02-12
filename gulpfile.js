// Include gulp
var gulp = require('gulp');

var config = {
    jsPath: "src/js/*.js",
    cssPath: "src/css/*.css",
    bowerDir: "/path2",
    destDir: "build/",
};

 // Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


 // Concatenate JS Files
gulp.task('scripts', function() {
    return gulp.src(config.jsPath)
      .pipe(concat('app.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(config.destDir + "js"));
});

gulp.task('css', function() {
    return gulp.src(config.cssPath)
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css'));
});

gulp.task('watch', function() {
   // Watch .js files
  gulp.watch(config.jsPath, ['scripts']);
   // Watch .scss files
  gulp.watch(config.cssPath, ['css']);
 });


 // Default Task
gulp.task('default', ['scripts', 'css']);