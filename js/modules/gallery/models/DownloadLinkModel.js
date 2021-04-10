/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var DownloadLinkModel = backbone.Model.extend({
	  
	url : "php/requests/user/getAllDownloadLink.php",

    // Default value
    defaults : {
    	link : null
    },
    initialize : function(attributes, options) {
    },
    parse : function(pResult) {
      return pResult;
    },
    getLink : function(){
    	return this.get("link");
    }
  });
  return DownloadLinkModel;
});