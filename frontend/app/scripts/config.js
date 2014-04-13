/*global require */

// Require.js config
require.config({
    deps: [
        'main',
        'bootstrap'
    ],
    baseUrl: 'scripts',
    paths: {
        jquery: '../components/jquery/dist/jquery',
        requirejs: '../components/requirejs/require',
        knockout: '../components/knockout/build/output/knockout-latest.debug',
        knockoutmapping: '../components/knockout-mapping/knockout.mapping',
        bootstrap: '../components/bootstrap/dist/js/bootstrap',
        i18next: '../components/i18next/i18next.amd.withJQuery',
        lodash: '../components/lodash/dist/lodash.compat',
    },
    shim: {
        bootstrap: {
            deps: [
                'jquery'
            ]
        },

        lodash: {
            exports: '_'
        },

        knockout: {
            exports: 'ko'
        },

        knockoutmapping: {
            deps: ['knockout'],
            exports: 'mapping'
        }
    }
});


// Since the AMD version of the mapping plugin will export itself separately, we assign it to ko here for convenience.
require(["knockout", "knockoutmapping"], function (ko, mapping) {
    "use strict";
    ko.mapping = mapping;
});