//Test
module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

	copy: {
		main:{
			files: [{
				expand: true,
				filter: 'isFile',
				src: ['app/**', 'config/**', 'coverage/**', 'app.js', 'package.json'],
				dest: 'dist/'
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
					coverate: true,
					mask: '**/*.spec.js'
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
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	grunt.registerTask('default', ['jshint', 'mocha_istanbul:coverage', 'concurrent']);
	grunt.registerTask('build', ['jshint', 'mocha_istanbul:coverage', 'copy']);
	grunt.registerTask('unittest', ['jshint', 'mocha_istanbul:coverage']);
};
