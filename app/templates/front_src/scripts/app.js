'use strict';
<% if (libs.clam) { %>
// var cutil = require('clam/core/util');
// cutil.moduleConf.prefix = 'jsc'; // Clam uses the 'jsm' prefix by default.
// var module = require('./clam_module/module');
<% } %>
// var $ = require('jquery');
var shame = require('./module/shame');
var global = require('./module/global');
<% if (libs.clam) { %>

// Clam modules
// cutil.createPrototypes(module);
<% } %>

// Standard modules
global.init();
shame.init();
