/*global describe, beforeEach, it */
'use strict';
var path = require('path'),
    helpers = require('yeoman-generator').test,
    fs = require('fs')

describe('polunware generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('polunware:app', [
        '../../app'
      ]);
      helpers.mockPrompt(this.app, {
        'someOption': true
      });
      this.app.options['skip-install'] = true;
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      'config/eslint.json',
      '.editorconfig',
      '.tern-project'
    ];
    
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    })
  })
  it('creates a valid package.json', function(done){
    this.app.run({}, function(){
      var file = fs.readFileSync('package.json')
      JSON.parse(file)
      done()
    })
  })
})
