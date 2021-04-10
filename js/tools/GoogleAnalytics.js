/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger','analytics','json!conf/app.configuration.json' ], function(logger,ga, configuration) {

  return {

	    runGoogleAnalytics : function(pPage, pPageTitle){
	    	try{
	    		ga('create', configuration.google_analitycs_id, 'auto');
	    		ga('send', 'pageview', {
	    			  'page': pPage,
	    			  'title': pPageTitle,
	    			  'hitCallback': function() {
	    				  logger.info("Analytics hit success");
	    				}
	    			});
	    	} catch(err) {
	    		logger.error("Error initializing google analitics");
	    	}
	    }
  }
});