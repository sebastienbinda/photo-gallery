/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */

define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var CartUpdatedModel = backbone.Model.extend({

	url : function(){
		return "php/requests/cart.php?sum=0";
    },
    // Default value
    defaults : {
    	nb_items : 0,
    	shipping_fee : 0
    },
    initialize : function(attributes, options) {
    },
    parse : function(pResult) {
      return pResult;
    },
    getNbItems : function(){
    	return this.get('nb_items');
    },
    getShippingFee : function(){
    	return this.get('shipping_fee');
    }
  });
  return CartUpdatedModel;
});