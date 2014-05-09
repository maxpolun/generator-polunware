'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var PolunwareGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    var prompts = [{
      type: 'checkbox',
      name: 'environments',
      message: 'What type of project is this?',
      choices: [
        'node',
        'frontend'
      ]
    }];

    this.package = {name: 'test',
                    author: 'max',
                    licence: 'ISC',
                    node:false,
                    frontend: true}

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app')
    this.mkdir('app/templates')

    this.template('_package.json', 'package.json')
    this.template('_bower.json', 'bower.json')
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig')
    this.copy('eslint.json', 'config/eslint.json')
    this.copy('tern-project', '.tern-project')
  }
});

module.exports = PolunwareGenerator;