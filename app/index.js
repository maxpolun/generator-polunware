'use strict'
var util = require('util'),
    path = require('path'), 
    yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    spawn = require('child_process').spawn,
    concat = require('concat-stream')

var PolunwareGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  getName: function(){
    var done = this.async()
    var git = spawn('git', ['config', 'user.name'])
    git.stdout.pipe(concat(function(data){
      this.userName = data
    }.bind(this)))
    git.on('close', done)
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    var prompts = [{
      type: 'input',
      name: 'userName',
      message: 'What\'s your name?',
      default: this.userName
    },{
      type: 'input',
      name: 'packageName',
      message: 'What\'s the package name?',
      default: path.basename(process.cwd())
    },{
      type: 'input',
      name: 'licence',
      message: 'What\'s the package licence?',
      default: 'ISC'
    },{
      type: 'checkbox',
      name: 'environments',
      message: 'What type of project is this?',
      choices: [
        'node',
        'frontend'
      ]
    }];

    this.prompt(prompts, function (props) {
      this.package = {name: props.name,
                      author: props.userName,
                      licence: props.licence,
                      node: props.environments.node,
                      frontend: props.environments.frontend}

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app')
    this.mkdir('app/templates')

    this.template('_package.json', 'package.json')
    this.template('_bower.json', 'bower.json')
    this.template('_Gruntfile.js', 'Gruntfile.js')
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig')
    this.copy('eslint.json', 'config/eslint.json')
    this.copy('tern-project', '.tern-project')
  }
});

module.exports = PolunwareGenerator;