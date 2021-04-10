/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger','layout/views/MainLayoutView' ], function(logger, MainLayoutView) {
	return {
    init : function() {
    	
    	logger.debug("init layout module");
    	
    	this.mainLayoutView = new MainLayoutView({
    		target : '#app-container'
    	});
    	
    	this.mainLayoutView.render();
      
    }
  };
});