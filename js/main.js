/*
 *
 * VERSION 2.1 : 11/04/2015 : Montée de version du burst.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
requirejs.config({
  // No loading timeout :
  waitSeconds : 0,
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
	name : "administration",
	location : "modules/administration"
  },
  {
	name : "gallery",
	location : "modules/gallery"
  }, {
    name : "authentication",
    location : "modules/authentication"
  }, {
	  name : "commande",
	  location : "modules/commande"  
  }
  ],
  // Alias
  paths : {
    // Vendors
	analytics : 'http://www.google-analytics.com/analytics',
	async : 'vendors/async-master/async',
    backbone : 'vendors/backbone/backbone',
    handlebars : 'vendors/handlebars/handlebars',
    jquery : 'vendors/jquery/jquery-1.11.1',
    jquerytimepicker : 'vendors/timepicker/jquery-ui-timepicker-addon.1.2',
    jqueryui : 'vendors/jquery-ui/js/jquery-ui-1.10.4',
    jqueryUiMultiSelect : 'vendors/jquery-ui-multiselect/jquery.multiselect',
    text : 'vendors/require/text', // Requirejs text plugin
    i18nreq : 'vendors/require/i18n', // Requirejs i18n plugin
    i18n : 'vendors/require/i18n', 
    json : 'vendors/require/json', // Requirejs json plugin
    underscore : 'vendors/underscore/underscore',
    // Tool alias
    cookie : 'tools/Cookie',
    date : 'tools/Date',
    logger : 'tools/Logger',
    relational : 'vendors/backbone-plugins/amd-backbone-relational',
    autocloseable : 'vendors/backbone-plugins/backbone-autocloseable',
    // Encryption
    md5 : 'vendors/jshash-2.2/md5-min',
    // Event bus
    bus : 'tools/EventBus',
    tablesorter : 'vendors/jquery-plugins/tablesorter2/js/jquery.tablesorter',
    tablesorterwidget : 'vendors/jquery-plugins/tablesorter2/js/jquery.tablesorter.widgets',
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
    'md5' : {
      exports : 'hex_md5',
      init : function() {
        return hex_md5;
      }
    },
    'analytics' : {
      exports : 'ga'
    },
    // Load jQuery plugins depending on 'jquery' only
    'jqueryui' : [ 'jquery' ],
    'jquerytimepicker' : [ 'jquery', 'jqueryui' ],
    'tablesorter' : [ 'jquery' ],
    'tablesorterwidget' : [ 'jquery', 'tablesorter' ],
    'jqueryUiMultiSelect' : ['jquery', 'jqueryui']
  },
  // Avoid resource caching
  // Pattern : v<VERSION>.<build number>
  // Set VERSION according to pom expected one
  // Increment build number whenever you want
  urlArgs : 'bust=v3.5'
});

// Start the main application logic.
requirejs([ 'vendors/require/domReady', 'app/main-app' ], function(domReady, app) {
  domReady(function() {
    // Start application when DOM is ready only
    app.start();
  });
});
