#!/usr/bin/env lsc
# options are accessed as argv.option

_       = require('underscore')
_.str   = require('underscore.string');
moment  = require 'moment'
fs      = require 'fs'
color   = require('ansi-color').set
os      = require('os')
shelljs = require('shelljs')
table   = require('ansi-color-table')

_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string');

name        = "sweet-angle"
description = "Write your angularjs directives with ease"
author      = "Vittorio Zaccaria"
year        = "2014"

info = (s) ->
  console.log color('inf', 'bold')+": #s"

err = (s) ->
  console.log color('err', 'red')+": #s"

warn = (s) ->
  console.log color('wrn', 'yellow')+": #s"

src = __dirname
otm = if (os.tmpdir?) then os.tmpdir() else "/var/tmp"
cwd = process.cwd()

setup-temporary-directory = ->
    name = "tmp_#{moment().format('HHmmss')}_tmp"
    dire = "#{otm}/#{name}" 
    shelljs.mkdir '-p', dire
    return dire

remove-temporary-directory = (dir) ->
    shelljs.rm '-rf', dir 
    
usage-string = """

#{color(name, \bold)}. #{description}
(c) #author, #year

Usage: #{name} [--option=V | -o V] file.sa
"""

require! 'optimist'

argv     = optimist.usage(usage-string,
              help:
                alias: 'h', description: 'this help', default: false
              application:
                alias: 'a', description: 'application module name', default: 'application'

                         ).boolean(\h).argv


if(argv.help)
  optimist.showHelp()
  return

file = argv._[0]

if not file?
  err "Source .sa file has'nt been specified on the command line"
  return 

modules = [ "#src/sweet-angle.sjs"
            "#src/node_modules/lambda-chop/macros"
            ]

compile-sweet = (fl) ->

  sweet = require('sweet.js');
  mods  = [ sweet.loadNodeModule(cwd, m) for m in modules ]

  out = sweet.compile fl, { modules: mods, readable-names: true }

  console.log out.code

root.sa = {}
root.sa.application = argv.application

file-contents = shelljs.cat(file)
compile-sweet(file-contents)


# shelljs.exec "#src/node_modules/.bin/sjs -m #src/sweet-angle.sjs -m #src/node_modules/lambda-chop/macros #file -r", (code, output) ->
#   if code 
#     return code
