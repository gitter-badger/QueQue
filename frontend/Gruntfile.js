/*global module, require */
module.exports = function(grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        isDebug: true, //Debug mode, e.g. for enabling source maps in debug mode etc //TODO set to false for prod release!

        // Requirejs config dependancy helper
        bower: {
            target: {
                rjsConfig: 'app/scripts/config.js'
            }
        },

        coffee: {
            compile: {
                files: {
                    'app/scripts/app.js': 'app/scripts/app.coffee'
                }
            }
        },

        // Compile javascript
        requirejs: {
            compile: {
                options: {
                    optimize: "uglify2",
                    uglify2: {
                        output: {
                            beautify: false
                        },
                        compress: {
                            sequences: false,
                            global_defs: {
                                DEBUG: false
                            }
                        },
                        warnings: true,
                        mangle: true
                    },
                    generateSourceMaps: '<%= isDebug %>',
                    preserveLicenseComments: false,
                    name: "main",
                    baseUrl: "app/scripts/",
                    mainConfigFile: "app/scripts/config.js",
                    out: "dist/js/main.js"
                }
            }
        },

        // Compile bootstrap js files (Only include what we need here to keep size down!)
        concat: {
            options: {
                // banner: '<%= banner %><%= jqueryCheck %>',
                banner: '<%= jqueryCheck %>',
                stripBanners: false
            },
            bootstrap: {
                src: [
                    // 'app/components/bootstrap/js/transition.js',
                    // 'app/components/bootstrap/js/alert.js',
                    // 'app/components/bootstrap/js/button.js',
                    // 'app/components/bootstrap/js/carousel.js',
                    //'app/components/bootstrap/js/collapse.js',
                    'app/components/bootstrap/js/dropdown.js',
                    'app/components/bootstrap/js/modal.js',
                    // 'app/components/bootstrap/js/tooltip.js',
                    // 'app/components/bootstrap/js/popover.js',
                    // 'app/components/bootstrap/js/scrollspy.js',
                    // 'app/components/bootstrap/js/tab.js',
                    // 'app/components/bootstrap/js/affix.js'

                ],
                dest: 'app/scripts/vendor/bootstrap/bootstrap.js'
            }
        },

        // Optimize javascript for require js file
        uglify: {
            options: {
                // banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build_requirejs: {
                options: {},
                src: [
                    'app/components/requirejs/require.js'
                ],
                dest: 'dist/js/require.js'
            },

            build_polyfills: {
                options: {},
                src: ['app/components/html5shiv/dist/html5shiv.js', 'app/components/respond/dest/respond.src.js'],
                dest: 'app/scripts/iefixes.js'
            },
        },

        // Local dev static server
        connect: {
            dev: {
                options: {
                    hostname: '*',
                    port: 8000,
                    base: 'app/',
                    keepalive: true,
                    open: 'http://localhost:8000'
                }
            },
            prod: {
                options: {
                    hostname: '*',
                    port: 8000,
                    base: 'dist/',
                    keepalive: true,
                    open: 'http://localhost:8000'
                }
            }
        },


        // Compile less to css
        less: {

            dev: {
                options: {
                    paths: ["less"]
                },
                files: {
                    "app/css/style.css": "app/less/style.less"
                }
            },

            prod: {
                options: {
                    paths: ["less"],
                    syncImport: true,
                    compress: true,
                    yuicompress: true
                },
                files: {
                    "dist/css/style.css": "app/less/style.less"
                }
            }
        },


        // Lint html
        htmlhint: {
            build: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'doctype-first': true,
                    'spec-char-escape': true,
                    'id-unique': true,
                    'head-script-disabled': true,
                    'style-disabled': true
                },
                src: ['app/index.html']
            }
        },

        // Optimize html
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist/index.html'
                }
            }
        },


        // minify locales json files
        'json-minify': {
            build: {
                files: 'dist/locales/**/*.json'
            }
        },


        // Lint javascript
        jshint: {
            files: [
                'Gruntfile.js',
                'app/scripts/**/*.js'
            ],
            options: {
                jshintrc: true
            }
        },


        // Copy files to deploy folder(s)
        copy: {
            // Copy files to dist
            dist: {
                files: {
                    // 'dist/favicon.ico': 'app/favicon.ico'
                    'dist/js/iefixes.js': 'app/scripts/iefixes.js'
                }
            },

            fonts: {
                expand: true,
                cwd: 'app/fonts',
                src: ['**'],
                dest: 'dist/fonts'
            },

            locales: {
                expand: true,
                cwd: 'app/locales',
                src: ['**'],
                dest: 'dist/locales'
            },


            // devDependancies: {
            //     files: {
            //         'app/scripts/text.js': 'app/components/text/text.js'
            //     }
            // }
        },


        // Modify html for dev vs prod
        targethtml: {
            dist: {
                src: 'app/index.html',
                dest: 'dist/index.html'
            }
        },


        // Clean up dirs
        clean: {
            dist: ['dist/']
        },


        // Versioning of assets (css, js, img) to control caching
        asset_cachebuster: {
            options: {
                buster: '<%= pkg.version %>',
                htmlExtension: 'html'
            },
            build: {
                files: {
                    'dist/index.html': ['dist/index.html'],
                    'dist/css/style.css': ['dist/css/style.css']
                }
            }
        },

        // Watch file changes and trigger actions such as livereload, recompile etc
        watch: {
            options: {
                spawn: false
            },

            less: {
                files: ['app/less/*.less', 'app/less/**/*.less'],
                tasks: ['less:dev']
            },

            html: {
                files: ['app/index.html'],
                tasks: ['htmlhint']
            },

            scripts: {
                files: [ 'Gruntfile.js'],
                tasks: ['jshint', 'concat']
            },
            coffee: {
                files: [ 'app/scripts/*.coffee'],
                tasks: ['compile:coffee']
            },

            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    'app/scripts/*.js',
                    'app/scripts/**/*.js',
                    'app/locales/**/*.json',
                    'app/index.html',
                    'app/css/*.css',
                    'app/dummy_api/*.json'
                    // 'app/templates/*.html'
                ]
            }
        },

        // Concurrent tasks that run in parallell
        concurrent: {
            target: {
                tasks: ['connect:dev', 'watch:scripts', 'watch:livereload', 'watch:less', 'watch:html', 'watch:coffee'],
                options: {
                    logConcurrentOutput: true,
                    limit: 6
                }
            }
        }


    });

    // Load plugins using matchdep
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.registerTask('compile:coffee', ['coffee']);
    grunt.registerTask('compile:js', ['concat', 'requirejs', 'uglify']);
    grunt.registerTask('compile:css', ['less:dev', 'less:prod']);
    grunt.registerTask('compile:json', ['json-minify']);
    grunt.registerTask('test', ['htmlhint', 'jshint']);
    grunt.registerTask('compile:html', ['targethtml:dist', 'htmlmin']);
    grunt.registerTask('compile:version', ['asset_cachebuster']);

    grunt.registerTask('server', ['concurrent']);


    grunt.registerTask('build',
        [
            // 'copy:devDependancies',
            'test',
            'clean:dist',
            'compile:js',
            'compile:css',
            'compile:html',
            'compile:version',
            'copy:dist',
            'copy:fonts',
            'copy:locales',
            'compile:json'
        ]);



    // Default task(s).
    grunt.registerTask('default', [ 'build']);

};