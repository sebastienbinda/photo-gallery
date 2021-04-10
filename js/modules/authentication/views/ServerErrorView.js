/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 
         'i18n!authentication/nls/Messages', 'text!authentication/templates/error.html' ], 
 function($, _, backbone, handlebars, logger, messages, form) {

  var ServerErrorView = backbone.View.extend({
    id : 'app-error-view',
    template : handlebars.compile(form),
    context : messages,
    initialize : function(options) {
      this.target = options.target;
    },
    render : function(){
    	$(this.el).html(this.template(this.context));
    	$(this.target).html(this.el);
    }
  });

  return ServerErrorView;

});
