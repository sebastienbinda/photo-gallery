/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */

define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var DisconnectModel = backbone.Model.extend({
	  
	url : "php/requests/disconnect.php",
    parse : function(pResult) {
      return pResult;
    },
  });
  return DisconnectModel;
});