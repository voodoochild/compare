var cheerio = require('cheerio');
var path = require('path');
var url = require('url');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        options: {
          sourcemap: false
        },
        files: {
          'stylesheets/css/main.css': 'stylesheets/sass/main.scss'
        }
      }
    },

    cssmin: {
      target: {
          files: {
              'stylesheets/css/main.css': 'stylesheets/css/main.css'
          }
      }
    },

    inlinecss: {
      dist: {
        options: {
          cssDir: 'stylesheets/css'
        },
        files: [{
          expand: true,
          cwd: '',
          src: 'index.html',
          dest: 'dist/'
        }]
      }
    },

    watch: {
      styles: {
        files: ['stylesheets/sass/**/*.scss'],
        tasks: ['sass', 'cssmin'],
        options: {
          livereload: true,
        }
      },
      scripts: {
        files: ['javascript/**/*.js'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['**/*.html'],
        options: {
          livereload: true
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8080,
          base: '.',
          livereload: true
        }
      }
    }
  });

  // Modules
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Tasks
  grunt.registerTask('default', ['connect', 'watch']);

  // Inline CSS, based on https://github.com/motherjones/grunt-html-smoosher
  grunt.registerMultiTask('inlinecss', 'Inline local CSS files', function () {
    var options = this.options({cssDir: ''});

    this.files.forEach(function (filePair) {
      if (filePair.src.length === 0) { return; }
      var $ = cheerio.load(grunt.file.read(filePair.src));
      grunt.log.writeln('Reading: ' + path.resolve(filePair.src.toString()));

      $('link[rel="stylesheet"]').each(function () {
        var style = $(this).attr('href');
        if (!style) { return; }
        if (style.match(/^\/\//) || url.parse(style).protocol) { return; }

        var filePath = (style.substr(0, 1) === '/') ?
          path.resolve(options.cssDir, style.substr(1)) :
          path.join(path.dirname(filePair.src), style);

        grunt.log.writeln(('Including CSS: ').cyan + filePath);
        $(this).replaceWith('<style>' + grunt.file.read(filePath) + '</style>');
      });

      grunt.file.write(path.resolve(filePair.dest), $.html());
      grunt.log.writeln(('Created ').green + path.resolve(filePair.dest));
    });
  });
};
