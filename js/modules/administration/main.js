/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'backbone','logger','underscore', 'bus', 'authentication','administration/views/AdminView' ], 
    function(backbone, logger, _,bus, Authentication, AdminView) {
	return {
    init : function() {
    	
    	_.bindAll(this,'displayAdmin')
    	
    	logger.debug("init administration module");
    	
    	bus.listenTo(bus, bus.events.adminauthenticated,this.displayAdmin);
    },
    displayAdmin : function(){
    	logger.info('Affichage du module d\'administration');
    	
      // Mange navigator history
      backbone.history.navigate("gallery/"+Authentication.getUser().getLogin(),{trigger:false});
      
    	this.adminView = new AdminView({
    		target : '#content'
    	});
    	this.adminView.render();
    }
  };
});