module.exports = function(grunt) {
  grunt.initConfig({
  
    pkg: grunt.file.readJSON('package.json'),
  

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },

        files: {
          'static/css/style.css': 'scss/style.scss'
        }
      }
    },

    watch: {
        css: {
          files: ['scss/*.scss'],
          tasks: ['sass:dist']
        },

        scripts: {
          files: ['javascripts/*.js'],
          tasks: ['concat']
        }
      },

      concat : {
        options :{
          banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                       '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
        },

        js : {
          src: ['javascripts/jquery-2.1.1.min.js', 'javascripts/socket.io.js', 'javascripts/utils.js', 'javascripts/audio-component.js', 'javascripts/app.js'],
          dest: 'static/js/build/build.js',
        }
      }

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['watch']);

};