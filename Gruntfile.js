module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

	compress: {
		main:{
			options: {
				mode: 'zip',
				archive: function () {
					var environment = process.env.BUILD_TAG || 'Dev';
return 'dist/sistacLabAPI-' + environment + '.zip';
      			}
      		},
			files: [{
				expand: true,
				filter: 'isFile',
				src: ['app/**', 'config/**', 'app.js', 'package.json']
			}]
		}
	},


		jshint: {
            files: ['Gruntfile.js', 'app/**/*.js', 'config/**/*.js']
        },

		mocha_istanbul: {
			coverage: {
				src: 'app/api/specs',
				options: {
					coverageFolder: 'coverage',
					reporter: 'spec',
					coverage: true,
					mask: '**/*.spec.js',
					reportFormats: ['cobertura','lcov']
				}
			}
		},

		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint', 'mocha_istanbul:coverage']
		},

		nodemon: {
			dev: {
				script: 'app.js'
			}
		},

		concurrent: {
			tasks: ['nodemon','watch'],
			options: {
				logConcurrentOutput: true
		}
	}
});
	
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-istanbul');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('default', ['jshint', 'mocha_istanbul:coverage', 'concurrent']);
	grunt.registerTask('dist', ['jshint', 'mocha_istanbul:coverage', 'compress']);
	grunt.registerTask('unittest', ['jshint', 'mocha_istanbul:coverage']);
};
