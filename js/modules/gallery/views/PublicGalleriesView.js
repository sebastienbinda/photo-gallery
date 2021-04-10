/*
 * 
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
 * VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!gallery/nls/Messages', 'authentication/views/LoginView', 'common/collections/PublicUsersCollection',
         'gallery/views/PublicGalleryView', 'text!gallery/templates/PublicGalleries.html'], 
 function($, _, backbone, handlebars, logger, bus, messages, LoginView, PublicUsersCollection, PublicGalleryView, form ) {

  var PublicGalleriesView = backbone.View.extend({
    id : 'app-public-users-view',
    template : handlebars.compile(form),
    context : messages,
    initialize : function(options) {
      _.bindAll(this, 'render');
      this.collection = options.collection;
      this.listenTo(this.collection,'sync',this.render);
      this.target = options.target;
      this.serviceConf = options.serviceConf;
      
    },
    render : function(){
      
      backbone.history.navigate("",{trigger:false});
      
      if (this.collection.models.length > 0){
      
        $(this.el).html(this.template(this.context));
        $(this.target).html(this.el);
        
        _.each(this.collection.models,function(pModel, pIndex, pCollection){
          
          logger.info("Displaying public gallery " + pModel.getLogin());
          
          var publicGallery = new PublicGalleryView({
            target : '.galleries-list',
            model : pModel,
          });
          publicGallery.render();
          
        }, this);
        
        // Then add private Access
        if (this.loginView){
        	this.loginView.close();
        }
    	this.loginView = new LoginView({
            target : '#private-access',
            passwordEnable : this.serviceConf.getPasswordEnable(),
            previousView : this
          });
          this.loginView.render();
        
      } else {
        this.loginView = new LoginView({
          target : '#content',
          passwordEnable : this.serviceConf.getPasswordEnable(),
          previousView : this
        });
        this.loginView.render();
      }
      
      this.delegateEvents();
      
    }
  });

  return PublicGalleriesView;

});