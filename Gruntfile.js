module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'src/js/*.js'
            ]
        },
        watch: {
            files: ['Gruntfile.js'],
            tasks: ['jshint']
        }
    });
};
