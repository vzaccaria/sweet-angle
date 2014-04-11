#!/usr/bin/env node
(function(){
  var _, moment, fs, color, os, shelljs, table, name, description, author, year, info, err, warn, src, otm, cwd, setupTemporaryDirectory, removeTemporaryDirectory, usageString, optimist, argv, file, modules, compileSweet, fileContents;
  _ = require('underscore');
  _.str = require('underscore.string');
  moment = require('moment');
  fs = require('fs');
  color = require('ansi-color').set;
  os = require('os');
  shelljs = require('shelljs');
  table = require('ansi-color-table');
  _.mixin(_.str.exports());
  _.str.include('Underscore.string', 'string');
  name = "sweet-angle";
  description = "Write your angularjs directives with ease";
  author = "Vittorio Zaccaria";
  year = "2014";
  info = function(s){
    return console.log(color('inf', 'bold') + (": " + s));
  };
  err = function(s){
    return console.log(color('err', 'red') + (": " + s));
  };
  warn = function(s){
    return console.log(color('wrn', 'yellow') + (": " + s));
  };
  src = __dirname;
  otm = os.tmpdir != null ? os.tmpdir() : "/var/tmp";
  cwd = process.cwd();
  setupTemporaryDirectory = function(){
    var name, dire;
    name = "tmp_" + moment().format('HHmmss') + "_tmp";
    dire = otm + "/" + name;
    shelljs.mkdir('-p', dire);
    return dire;
  };
  removeTemporaryDirectory = function(dir){
    return shelljs.rm('-rf', dir);
  };
  usageString = "\n" + color(name, 'bold') + ". " + description + "\n(c) " + author + ", " + year + "\n\nUsage: " + name + " [--option=V | -o V] file.sa";
  optimist = require('optimist');
  argv = optimist.usage(usageString, {
    help: {
      alias: 'h',
      description: 'this help',
      'default': false
    },
    application: {
      alias: 'a',
      description: 'application module name',
      'default': 'application'
    }
  }).boolean('h').argv;
  if (argv.help) {
    optimist.showHelp();
    return;
  }
  file = argv._[0];
  if (file == null) {
    err("Source .sa file has'nt been specified on the command line");
    return;
  }
  modules = [src + "/sweet-angle.sjs", src + "/node_modules/lambda-chop/macros"];
  compileSweet = function(fl){
    var sweet, mods, res$, i$, ref$, len$, m, out;
    sweet = require('sweet.js');
    res$ = [];
    for (i$ = 0, len$ = (ref$ = modules).length; i$ < len$; ++i$) {
      m = ref$[i$];
      res$.push(sweet.loadNodeModule(cwd, m));
    }
    mods = res$;
    out = sweet.compile(fl, {
      modules: mods,
      readableNames: true
    });
    return console.log(out.code);
  };
  root.sa = {};
  root.sa.application = argv.application;
  fileContents = shelljs.cat(file);
  compileSweet(fileContents);
}).call(this);
