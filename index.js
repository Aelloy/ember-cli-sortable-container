'use strict';
var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-cli-sortable-container',

  treeForVendor(vendorTree) {
    var momentTree = new Funnel(path.join(this.project.root, 'node_modules', 'velocity-animate'), {
      files: ['velocity.js'],
    });
    return new MergeTrees([vendorTree, momentTree]);
  },

  included(app) {
    this._super.included(app);
    this.import('vendor/velocity.js', {
      using: [
        { transformation: 'amd', as: 'velocity' }
      ]
    });
  }
};
