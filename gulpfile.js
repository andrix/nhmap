// Include gulp
var gulp = require('gulp');

var config = {
    jsPath: ["src/js/*.js"],
    cssPath: ["src/css/*.css"],
    htmlPath: "src/*.html",

    dest: "dist/",
};

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});
var htmlreplace = require('gulp-html-replace');


 // JS: Concatenate JS Files + minify + move
gulp.task('scripts', function() {
    gulp.src(plugins.mainBowerFiles({debugging:true}).concat(config.jsPath))
        .pipe(plugins.filter("**/*.js"))
        .pipe(plugins.debug())
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(config.dest + "js"));

});

// CSS: Concat + Minify + Move to dest
gulp.task('css', function() {
    gulp.src(plugins.mainBowerFiles({
            debugging:true,
            overrides: {
                bootstrap: {
                    main: "dist/css/bootstrap.css"
                }
            },
            filter: "**/*.css",
        }).concat(config.cssPath))
        .pipe(plugins.debug())
        .pipe(plugins.concat('styles.css'))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(config.dest + 'css'));
});

// Boostrap Fonts
gulp.task('fonts', function() {
    gulp.src(plugins.mainBowerFiles({
            debugging:true,
            overrides: {
                bootstrap: {
                    main: "dist/fonts/*.*"
                }
            },
            filter: "**/*.{eot,svg,ttf,woff,woff2}",
        }))
        .pipe(plugins.debug())
        .pipe(gulp.dest(config.dest + 'fonts'));
});

gulp.task('html', function() {
    gulp.src(config.htmlPath)
        .pipe(htmlreplace({
            'css': 'css/styles.min.css',
            'js': 'js/app.min.js'
         }))
        .pipe(gulp.dest(config.dest));
});

gulp.task('watch', function() {
   // Watch .js files
  gulp.watch(config.jsPath, ['scripts']);
   // Watch .scss files
  gulp.watch(config.cssPath, ['css']);
 });


 // Default Task
gulp.task('default', ['scripts', 'css', 'html', 'fonts']);