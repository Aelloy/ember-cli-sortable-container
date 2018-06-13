'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    'ember-bootstrap': {
      bootstrapVersion: 4,
      importBootstrapCSS: false,
      whitelist: [],
      'importBootstrapFont': false
    },
    sassOptions: {
      extension: 'sass'
    },
    vendorFiles: {
      'jquery.js': null
    },
    velocityOptions: {
      enabled: true,
      ui: true
    },
    snippetPaths: ['tests/dummy/app'],
    snippetSearchPaths: ['tests/dummy/app']
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
