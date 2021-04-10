/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */

define([ 'logger','bus','authentication','common/models/UserModel','gallery/views/PrivateGalleryView' ], function(logger,bus, Authentication, UserModel, PrivateGalleryView) {
	return {
    init : function() {
    	logger.debug("init gallery module");
    	bus.bind(bus.events.authenticated, this.onAuthenticate, this);
    	bus.bind(bus.events.displayGallery, this.displayGallery,this);
    },
    onAuthenticate : function(pModel){
    	
    	var userModel = pModel;
    	if (!userModel){
    		var userModel = Authentication.getUser();
    	}
    	
    	logger.info("Affichage de la gallery privée de " + userModel.getLogin());
    	
    	if (this.galleryView){
    	  this.galleryView.close();
    	} 
      	this.galleryView = new PrivateGalleryView({
      		target : '#content',
      		model : userModel
      	});
      	this.galleryView.render();
    },
    displayGallery : function(){
      this.onAuthenticate();
    }
  };
});