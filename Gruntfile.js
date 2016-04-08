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

		mochaTest: {
				test: {
					options: {
						reporter: 'spec',
						captureFile: 'results.txt',
						quiet: false,
						clearRequireCache: false
					},
				src: ['app/api/specs/a1/**/*.js']
			}
		},
	
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint', 'mochaTest', 'uglify']
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
	
	grunt.registerTask('default', ['jshint', 'mochaTest', 'concat', 'uglify', 'concurrent']);
};
