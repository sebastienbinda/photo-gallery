/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */

define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var ItemModel = backbone.Model.extend({
	  
	url : function(){
		  if (this.getPictureId() && this.getProductId()){
			  return "php/requests/cart.php?pictureid="+this.getPictureId()+"&productid="+this.getProductId();
		  } else {
			  return "php/requests/cart.php";
		  }
	},

    // Default value
    defaults : {
    	id : null,
    	pictureid : null,
    	productid : null,
    	quantity : null,
    	price : null
    },
    initialize : function(attributes, options) {
    },
    parse : function(pResult) {
      return pResult;
    },
    getPictureId : function(){
    	return this.get("pictureid");
    },
    setPictureId : function(pId){
    	this.set("pictureid",pId);
    },
    getProductId : function(){
    	return this.get("productid");
    },
    setProductId : function(pId){
    	this.set("productid",pId);
    },
    getQuantity : function(){
    	return this.get("quantity");
    },
    setQuantity : function(pQuantity){
    	this.set('quantity',pQuantity);
    },
    getPrice : function(){
    	return this.get('price');
    },
    setPrice : function(pPrice){
    	this.set('price',pPrice);
    }
  });
  return ItemModel;
});