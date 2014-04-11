
require! 'gulp'
jade   = require 'gulp-jade'
stylus = require 'gulp-stylus'
ftp    = require 'gulp-ftp'
cr     = require '/Users/zaccaria/.ssh/sftp_credentials'

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
    gulp.src ['assets/img/*.png', 'assets/img/*.jpg']
        .pipe gulp.dest '_site/img'

gulp.task 'ftp', ->
    gulp.src ['_site/**']
        .pipe ftp {
            host: '217.64.195.216'
            user: 'vittoriozaccaria.net'
            pass: cr['217.64.195.216']['vittoriozaccaria.net']
            remote-path: 'htdocs/sweet-angle' 
        }

gulp.task 'default', ['build-html' 'build-vendor-js', 'build-stylus', 'build-img']

gulp.task 'deploy', ['default', 'ftp']
