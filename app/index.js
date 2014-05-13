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
      this.userName = data.toString()
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
      default: this.userName.replace(/\s+$/, '')
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
      console.log(props)
      this.package = {name: props.packageName,
                      author: props.userName,
                      licence: props.licence,
                      node: props.environments.indexOf('node') >= 0,
                      frontend: props.environments.indexOf('frontend') >= 0}
      console.log(this.package)
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
    this.copy('eslint-specs.json', 'config/eslint-specs.json')
    this.copy('tern-project', '.tern-project')
    this.copy('gitignore', '.gitignore')
  }
});

module.exports = PolunwareGenerator;