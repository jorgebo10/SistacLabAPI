module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

    concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['app/api/src/**/*.js'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},

		uglify: {
			options: {
				banner: '/*! <%=pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
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
			tasks: ['jshint', 'mocha_istanbul:coverage', 'uglify']
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
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
	
	grunt.registerTask('default', ['jshint', 'mocha_istanbul:coverage', 'concat', 'uglify', 'concurrent']);
	grunt.registerTask('test', ['mocha_istanbul:coverage']);
};
