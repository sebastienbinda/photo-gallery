/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var ShippingTypeModel = backbone.Model.extend({
	  
    // Default value
    defaults : {
    	name : null
    },
    initialize : function(attributes, options) {
    },
    parse : function(pResult) {
      return pResult;
    },
    getName : function(){
    	return this.get('name');
    }
    
  });
  return ShippingTypeModel;
});