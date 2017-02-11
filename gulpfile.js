var gulp = require('gulp')

var config = {
    sassPath: '/path',
    bowerDir: '/path2'
};

gulp.task('hello', function() {
    console.log('Hello World');
});

gulp.task('robot', function(){
    console.log('I AM A ROBOT');
});

// Rerun the task when a file changes

 // gulp.task('watch', function() {
 //    gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
//});

  // gulp.task('default', ['bower', 'icons', 'css']);
