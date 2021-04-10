/*
 * 
 * VERSION 2.3 : 13/06/2015 : Ajout d'un event request avant le fetch backbone des collections.
 * VERSION 2.2 : 04/05/2015 : Gestion du router.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'jquery', 'underscore', 'backbone', 'handlebars', 'bus','layout' , 'administration','authentication','app/approuter',
         'gallery','DomTools','json!conf/app.configuration.json','text!conf/template.html'],
		function(logger, $, _, backbone, handlebars, bus,layout, administration, authentication, AppRouter, gallery, tools, configuration,template) {

  var extendBackbone = function() {
	  
	  $.ajaxSetup({
		    cache: false,
		    statusCode: {
		        401: function () {
		        	logger.error("Session expirée");
		    		 window.location.replace(window.location.pathname);
		        }
		    }
		});

    // Add cleanup function to backbone views
    backbone.View.prototype.close = function() {
      this.trigger('CloseView');
      this.remove();
      this.unbind();
      if (this.onClose) {
        // Custom operation for each view
        // to unbind event for instance
        this.onClose();
      }
    };
    
    var fetch = backbone.Collection.prototype.fetch;
    backbone.Collection.prototype.fetch = function() {
      this.trigger('request');
      return fetch.apply(this, arguments);
    };

    // Add error feedback to backbone models
    // Bind model to error to do so : <model>.bind('error', this.error, this);
    backbone.Model.prototype.error = function(model, xhr, options) {
      logger.error(xhr.responseText, true);
      if (this.onError) {
        // Custom operation if necessary
        this.onError();
      }
    };
  };

  /**
   * Init application
   */
  var init = function() {
    
    bus.listenTo(bus, bus.events.loading, function(pText){
      $("#main-loading").show();
      $("#wrapper").addClass("loading-filter");
      if (pText != undefined && pText != null && pText != ""){
    	  $("#main-loading #loading-msg").html(pText);
      } else {
    	  $("#main-loading #loading-msg").html("Chargement en cours ... ");
      }
    });
    bus.listenTo(bus, bus.events.stoploading, function(){
      $("#main-loading").hide();
      $("#wrapper").removeClass("loading-filter");
    });

    // Add prototype feature to native backbone code
    extendBackbone();
    
    var theme = configuration.theme;
    var param = tools.getUrlParameter('tpl');
    
    if (param && param != ""){
    	theme = param;
    }
    
    var context = {
    		template : theme
    };
    includtemplate = handlebars.compile(template);
    $('head').append(includtemplate(context));
    
    // Init authentication module
    authentication.init();

    // Init layout
    layout.init();
    
    // Init administration module
    administration.init();
    
    // Init private gallery access
    gallery.init();
    
    bus.trigger(bus.events.stoploading);
    
    // Init Router
    this.router = new AppRouter();
    
    backbone.history.start();

  };

  return {
    start : function() {
      init();
    }
  };
});
