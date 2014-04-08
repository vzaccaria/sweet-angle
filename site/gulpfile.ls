
require! 'gulp'
jade = require 'gulp-jade'
stylus = require 'gulp-stylus'

gulp.task 'build-html', ->
    gulp.src 'assets/html/index.jade'
        .pipe jade()
        .pipe gulp.dest '_site'

gulp.task 'build-vendor-js', ->
    gulp.src ['assets/bower_components/gss/dist/worker.js' 'assets/bower_components/gss/dist/gss.js']
        .pipe gulp.dest '_site/js'

gulp.task 'build-stylus', ->
    gulp.src ['assets/css/responsive.stylus']
        .pipe stylus()
        .pipe gulp.dest '_site/css'

gulp.task 'build-img', ->
    gulp.src ['assets/img/*.png']
        .pipe gulp.dest '_site/img'

gulp.task 'default', ['build-html' 'build-vendor-js', 'build-stylus', 'build-img']
