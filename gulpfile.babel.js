import gulp from 'gulp';
import gBabel from 'gulp-babel';

gulp.task('babel', () => {
    gulp.src('es6/**/*.js')
        .pipe(gBabel({ presets: ['es2015'], plugins: ['transform-es2015-modules-amd'] }).on('error', error => console.log(error)))
        .pipe(gulp.dest('src'));
});

gulp.task('default', ['babel']);