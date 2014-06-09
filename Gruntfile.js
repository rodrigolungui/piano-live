module.exports = function(grunt) {
  grunt.initConfig({
  
    pkg: grunt.file.readJSON('package.json'),
  

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },

        files: {
          'css/style.css': 'scss/style.scss'
        }
      }
    },

    watch: {
        css: {
          files: ['scss/*.scss'],
          tasks: ['sass:dist']
        },

        scripts: {
          files: ['js/*.js'],
          tasks: ['concat']
        }
      },

      concat : {
        options :{
          banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                       '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
        },

        js : {
          src: ['js/jquery-2.1.1.min.js', 'js/app.js', 'js/audio-component.js', 'js/utils.js'],
          dest: 'js/build/build.js',
        }
      }

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['watch']);

};