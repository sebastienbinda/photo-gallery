/*
 * 
 * VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus','authentication/models/LoginModel',
         'i18n!gallery/nls/Messages','text!gallery/templates/PublicGallery.html'], 
 function($, _, backbone, handlebars, logger, bus, LoginModel, messages, form) {

  var PublicGalleryView = backbone.View.extend({
    tagName : 'li',
    className : 'gallery_access',
    template : handlebars.compile(form),
    initialize : function(options){
      _.bindAll(this,"render","login","loginSuccess","loginError");
      this.target = options.target;
      this.model = options.model;
    },
    events : {
      'click .gallery_access_title' : 'login', 
    },
    render : function(){
      
      var context = {
          user : this.model.toJSON(),
          labels : messages
      };
      $(this.el).html(this.template(context));
      $(this.target).append(this.el);
      
      this.delegateEvents();
    },
    login : function(){
      var loginModel = new LoginModel();
      loginModel.setLogin(this.model.getLogin());
      loginModel.setPassword("");
      bus.trigger(bus.events.loading);
      loginModel.save(null,{
        success : this.loginSuccess,
        error : this.loginError
      });
      
    },
    loginSuccess : function(pModel,response, options){
    	bus.trigger(bus.events.stoploading);
      logger.debug("Accès public ok");
      bus.trigger(bus.events.authenticated,pModel);
    },
    loginError : function(pModel,xhr, options){
      bus.trigger(bus.events.stoploading);
      logger.error("Erreur d'accès publique");
    }

  });
  return PublicGalleryView;

});
