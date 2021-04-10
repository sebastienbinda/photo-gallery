/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */

define([ 'backbone','commande/collections/ItemsCollection' ],
		function(backbone,ItemsCollection) {
  var Cart = ItemsCollection.extend({
	  initialize : function(){
		  this.shippingFee = 0.0;
	  },
	  getShippingFee : function(){
		  return this.shippingFee;
	  },
	  setShippingFee : function(pShippingFee){
		  this.shippingFee = pShippingFee;
	  },
	  reset : function(models, options){
		  this.shippingFee = 0.0;
		  backbone.Collection.prototype.reset.call(this, models, options);
	  }
  });
  return new Cart;
});