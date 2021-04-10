/*
 * 
 * VERSION 2.2 : 15/05/2015 : Ajout du menu responsive
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus','DomTools','json!conf/app.configuration.json',
         'i18n!layout/nls/Messages', 'text!layout/templates/mainLayout.html' ], function($, _,
    backbone, handlebars, logger, bus, tools, configuration, messages, form) {

  var MainLayoutView = backbone.View.extend({
    id : 'app-main-layout',
    template : handlebars.compile(form),
    initialize : function(options){
    	_.bindAll(this,'disconnect','displayMobileMenu');
    	this.target = options.target;
    	this.menuOpen = false;
    },
    events : {
    	"click #menu-main" : "disconnect",
    	"click .navigation-mobile" : "displayMobileMenu"
    },
    render : function(){
    	
    	var theme = configuration.theme;
    	var param = tools.getUrlParameter('tpl');
    	if (param && param != ""){
    		theme = param;
    	}
    	
    	var context = {
    			labels : messages,
    			configuration : configuration,
    			theme : theme
    	}
    	$(this.el).html(this.template(context));
    	$(this.target).html(this.el);
    	
    	$("#head-container span").hover(function(){
			$("#head-container span.selected").addClass('wasselected');
			$("#head-container span.selected").removeClass('selected');
		}, function(){
			$("#head-container span.wasselected").addClass('selected');
			$("#head-container span.wasselected").removeClass('wasselected');
		});
    },
    displayMobileMenu : function(){
    	if (this.menuOpen){
    		$("#wrapper-mobile-menu").hide();
    		$(".bars-menu-mobile").show();
    		$(".close-menu-mobile").hide();
    		$("#head-container .logo").show();
    		$("#wrapper").show();
    		this.menuOpen = false;
    	} else {
    		$("#wrapper").hide();
    		$(".bars-menu-mobile").hide();
    		$(".close-menu-mobile").show();
    		$("#wrapper-mobile-menu").show();
    		$("#head-container .logo").hide();
    		this.menuOpen = true;
    	}
    },
    disconnect : function(){
    	this.close();
    	bus.trigger(bus.events.disconnect);
    }
    
  });

  return MainLayoutView;

});
