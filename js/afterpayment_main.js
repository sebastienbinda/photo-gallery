/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
requirejs.config({
  // By default load any module IDs from this location
  baseUrl : 'js',
  packages : [ {
	name : 'common',
	location : "modules/common"
  }, 
  {
	name : "layout",
	location : "modules/layout"
  },
  {
	  name : "commande",
	  location : "modules/commande"  
  }
  ],
  // Alias
  paths : {
    // Vendors
    backbone : 'vendors/backbone/backbone',
    handlebars : 'vendors/handlebars/handlebars',
    jquery : 'vendors/jquery/jquery-1.11.1',
    jqueryui : 'vendors/jquery-ui/js/jquery-ui-1.10.4',
    text : 'vendors/require/text', // Requirejs text plugin
    i18n : 'vendors/require/i18n',
    i18nreq : 'vendors/require/i18n', // Requirejs i18n plugin
    json : 'vendors/require/json', // Requirejs json plugin
    underscore : 'vendors/underscore/underscore',
    // Tool alias
    cookie : 'tools/Cookie',
    logger : 'tools/Logger',
    autocloseable : 'vendors/backbone-plugins/backbone-autocloseable',
    // Event bus
    bus : 'tools/EventBus',
    localeConfig : '../json/StaticConfiguration.json',
    DomTools : 'tools/DomTools'

  },
  // Load non AMD vendors and reduce visibility with noConflict
  // utility method
  shim : {
    'handlebars' : {
      exports : 'Handlebars',
      init : function() {
        return Handlebars;
      }
    },
    'underscore' : {
      exports : '_',
      init : function() {
        return _.noConflict();
      }
    },
    'backbone' : {
      deps : [ 'underscore', 'jquery' ],
      exports : 'Backbone',
      init : function() {
        return Backbone.noConflict();
      }
    },
    // Load jQuery plugins depending on 'jquery' only
    'jqueryui' : [ 'jquery' ]
  },
  // Avoid resource caching
  // Pattern : v<VERSION>.<build number>
  // Set VERSION according to pom expected one
  // Increment build number whenever you want
  urlArgs : 'bust=v1.0'
});

// Start the main application logic.
requirejs([ 'vendors/require/domReady', 'app/after-payment' ], function(domReady, app) {
  domReady(function() {
    // Start application when DOM is ready only
    app.start();
  });
});
