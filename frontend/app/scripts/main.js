/*global require */

// Main - application entry point
require(
    [
        'jquery',
        'knockout',
        'i18next',
        'app'
    ],
    function($, ko, i18n) {
        "use strict";

        $(document).ready(function() {

            // Initialize i18n locales framework and start app after locales have loaded
            var config = {
                fallbackLng: false,
                lng: 'sv', //TODO pick up selected language when more than Swedish is to be supported in VGR
                useLocalStorage: false,
                debug: false
            };

            i18n.init(config).done(function() {
                $('html').i18n();

                //initiate app
                // ko.applyBindings( new MainViewModel() );
                // ko.applyBindings( new MainViewModel(), document.getElementById('headerWrapper') );
            });
        });
    }
);
