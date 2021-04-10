/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'json!conf/app.configuration.json', 
         'i18n!commande/nls/Messages','text!commande/templates/PaypalConfirmation.html'],
         function($, _, backbone, handlebars, logger, configuration, messages, form) {

  var ConfirmationView = backbone.View.extend({
    id : 'cart-confirmation-view',
    context : messages.confirmation,
    template : handlebars.compile(form),
    initialize : function(options){
    	this.target = options.target;
    },
    events : {
    	
    },
    render : function(){
    	var context = {
    			confirmation : messages.confirmation,
    			configuration : configuration
    	};
    	$(this.el).html(this.template(context));
    	$(this.target).html($(this.el));
    	
    	$(this.el).find("#backbutton").button();
    }
  });

  return ConfirmationView;

});
