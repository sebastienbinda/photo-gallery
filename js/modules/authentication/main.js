/*
 * 
 * VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
 * VERSION 2.2 : 15/04/2015 : Gestion de la connexion sans mot de passe.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */

define([ 'logger','underscore', 'bus','common/models/UserModel','authentication/models/DisconnectModel',
         'authentication/models/ServiceConfModel', 'authentication/models/LoginModel','authentication/views/ServerErrorView',
         'gallery/views/PublicGalleriesView','common/collections/PublicUsersCollection',
         'commande/collections/Cart','tools/GoogleAnalytics' ],
         function(logger, _,bus, UserModel, DisconnectModel, ServiceConfModel, LoginModel, ServerErrorView,
             PublicGalleriesView,PublicUsersCollection,Cart,analytics) {
	return {
    init : function() {
    	
    	_.bindAll(this,'start','checkUser','connectionError','disconnect','displayPublicAccess',
    	    'disconnectedOk','getUser','setUser','getServiceConf','getPublicGalleries',
    	    'newConnectionOk','closeLoginView');
    	
    	logger.debug("init authentication module");
    	
    	this.publicGalleries = new PublicUsersCollection();
    	
    	// User for direct access. If null, no direct access.
    	this.userToAcess = null;
    	
    	bus.listenTo(bus, bus.events.disconnect,this.disconnect);
    	bus.listenTo(bus, bus.events.authenticated,this.setUser);
    	bus.listenTo(bus, bus.events.authenticated,this.closeLoginView);
    	bus.listenTo(bus, bus.events.adminauthenticated,this.closeLoginView);
    	bus.listenTo(bus, bus.events.adminauthenticated,this.setUser);
    },
    start : function (pUserLogin){
    	
    // Clear summary cart
    	$('#summary-cart').empty();
      
      if (!pUserLogin){
        this.userToAcess = null;
      } else {
        this.userToAcess = pUserLogin;
      }
      
      this.userModel = new UserModel();
      this.userModel.fetch({
          success : this.getServiceConf,
          error : this.connectionError
      });
    },
    getServiceConf : function(pModel){
      this.serviceConf = new ServiceConfModel();
      this.serviceConf.fetch({
        success : this.getPublicGalleries,
        error : this.connectionError
      });
    },
    getPublicGalleries : function(){
      this.publicGalleries.fetch({
        success : this.checkUser,
        error : this.connectionError
      });
    },
    checkUser : function(pServiceConf){
    	logger.info("Checking user");
    	
    	if (this.userModel != null && this.userModel.getLogin()){
    	  // User already connected.
    	  if (this.userToAcess == this.userModel.getLogin()){
    	    // User to access is the curent connected user.
    	    if (this.userModel.getLogin() == "admin"){
            bus.trigger(bus.events.adminauthenticated,this.userModel);
            analytics.runGoogleAnalytics('/EPhoto/admin', 'Gallerie privée. Page d\'administration');
          } else {
            bus.trigger(bus.events.authenticated,this.userModel);
            analytics.runGoogleAnalytics('/EPhoto/'+this.userModel.getLogin(), 'Gallerie privée de '+this.userModel.getLogin());
          }
    	  } else if (this.userToAcess != null){
    	    // User to access is not the curent connected user. Try to connect to the new one.
    	    var loginModel = new LoginModel();
          loginModel.setLogin(this.userToAcess);
          loginModel.setPassword("");
          loginModel.save(null,{
            success : this.newConnectionOk,
            error : this.connectionError
          });
    	  } else {
    	    this.displayPublicAccess();
    	  }
    		
    	} else if (this.userToAcess != null){
    	  // Try to connect to the user wanted as public access
    	  var loginModel = new LoginModel();
        loginModel.setLogin(this.userToAcess);
        loginModel.setPassword("");
        loginModel.save(null,{
          success : this.newConnectionOk,
          error : this.displayPublicAccess
        });
    	} else {
    	  // No user connected and no user to access, so display the galleries list
    	  this.displayPublicAccess();
    	}
    },
    displayPublicAccess : function (){
      this.publicGalleriesView = new PublicGalleriesView({
        target : '#content',
        collection : this.publicGalleries,
        serviceConf : this.serviceConf
      });
      this.publicGalleriesView.render();
    },
    newConnectionOk : function(pModel){
      this.setUser(pModel);
      this.checkUser();
    },
    connectionError : function(pModel, response, code){
    	logger.error(response.responseText);
    	this.errorView = new ServerErrorView({
    		target : '#content'
    	});
    	this.errorView.render();
    },
    disconnect : function(){
    	this.userModel = null;
    	this.userToAcess = null;
    	var disconnectModel = new DisconnectModel();
    	disconnectModel.fetch({
    		success : this.disconnectedOk,
    		error : function(){
    			logger.error("Erreur de deconnexion");
    		}
    	});
    },
    disconnectedOk : function(){
      this.publicGalleries.fetch({
        success : this.getServiceConf,
        error : this.connectionError
      });
    	Cart.reset();
    },
    getUser : function(){
    	return this.userModel;
    },
    getServiceConfiguration : function(){
    	return this.serviceConf;
    },
    setUser : function(pModel){
    	this.userModel = pModel;
    },
    closeLoginView : function(){
    	if (this.publicGalleriesView){
    		this.publicGalleriesView.close();
    	}
    }
  };
});