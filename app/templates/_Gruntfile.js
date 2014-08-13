'use strict'
module.exports = function(grunt) {
  var config = {}
  config.pkg = grunt.file.readJSON('package.json')
  <% if (package.node) { %>
  config.nodefiles = ['server.js','lib/**/*.js','lib/*.js']
  config.nodespecfiles = ['spec/**/*Spec.js']
  <% } else { %>
  config.nodefiles = []
  config.nodespecfiles = []
  <% } %>

  <% if (package.frontend) { %>
  config.browserfiles = ['app/js/**/*.js', 'app/js/*.js']
  config.browserspecfiles = ['app/spec/**/*Spec.js', 'app/spec/*Spec.js']
  <% } else { %>
  config.browserfiles = []
  config.browserspecfiles = []
  <% } %>
  config.e2efiles = ['e2e/**/*Spec.js', 'e2e/*Spec.js']
  config.backendFiles = config.nodespecfiles.concat(config.nodefiles)
  config.frontendFiles = config.browserfiles.concat(config.browserspecfiles)
  config.allCodeFiles = config.nodefiles.concat(config.browserfiles)
  config.allSpecFiles = config.nodespecfiles.concat(config.browserspecfiles)
  config.allJS = config.backendFiles.concat(config.frontendFiles)

<% if (package.node) { %>
  config.concurrent = {
    dev: {
      tasks: ['nodemon', 'node-inspector', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  }

  config.nodemon = {
    dev: {
      script: 'server.js',
      options: {
        nodeArgs: ['--debug']
      }
    },
    options: {
      ignore: ['app/**', '<%%= allSpecFiles %>', '.grunt/**']
    }
  }

  config['node-inspector'] = {
    dev: {}
  }

  config.spec = {
    default: {
      specs: config.allSpecFiles,
      isVerbose: true,
      showColors: true,
      includeStackTrace: true,
      defaultTimeoutInterval: 5000
    }
  }
<% } %>
<% if (package.frontend) { %>
  config.jasmine = {
    default: {
      src: ['app/assets/bundle.js']
    },
    options: {
      specs: 'app/spec/specBundle.js',
      '--local-to-remote-url-access' : true
    }
  }
  config.browserify = {
    main: {
      files: {
        'app/assets/bundle.js': 'app/js/main.js',
        'app/spec/specBundle.js': config.browserSpecFiles
      },
      options: {
        debug: true,
        alias: []
      }
    }
  }
<% } %>

  config.eslint = {
    code: {
      files: {
        src: config.allCodeFiles,
      },
      options: {
        config: 'config/eslint.json'
      }
    },
    specs: {
      files: {
        src: config.allSpecFiles,
      },
      options: {
        config: 'config/eslint-specs.json'
      }
    }
  }

  config.watch = {
  <% if (package.node) { %>
    nodeSpecs: {
      files: config.backendFiles,
      tasks: 'spec'
    },
  <% } %>
  <% if (package.frontend) { %>
    frontEnd: {
      files:  config.frontendFiles,
      tasks: ['browserify', 'jasmine']
    },
  <% } %>
    lint: {
      files: config.allJS,
      tasks: 'eslint'
    }
  }

  grunt.initConfig(config)

  grunt.loadNpmTasks('eslint-grunt')
  grunt.loadNpmTasks('grunt-contrib-watch')
<% if (package.frontend) { %>
  grunt.loadNpmTasks('grunt-contrib-jasmine')
  grunt.loadNpmTasks('grunt-browserify')
<% } %>
<% if (package.frontend && !package.node) { %>
  grunt.registerTask('default', ['watch:frontEnd'])
<% } %>
<% if (package.node) { %>
  grunt.loadNpmTasks('grunt-nodemon')
  grunt.loadNpmTasks('grunt-node-inspector')
  grunt.loadNpmTasks('grunt-concurrent')

  grunt.registerMultiTask('spec', 'Run node jasmine specs', function(){
    var done = this.async();
    var jasmineLib = require('minijasminenode2');
    this.data.specs = grunt.file.expand(this.data.specs)
    this.data.onComplete = done
    jasmineLib.executeSpecs(this.data)
  })

  grunt.registerTask('default', ['concurrent:dev'])
<% } %>
}
