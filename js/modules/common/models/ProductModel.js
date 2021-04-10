/*
 * 
 * VERSION 2.2 : 17/04/2015 : Gestion de différents répertoire de dépot pour les téléchargements
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var ProductModel = backbone.Model.extend({
	  
	url : function(){
		if (this.getId()){
			return "php/requests/product.php?id=" + this.getId();
		} else {
			return "php/requests/product.php";
		}
	},

    // Default value
    defaults : {
    	id : null,
    	name : null,
    	price : null,
    	type : null,
    	description : null,
    	weight : null,
    	shipping_type : null,
    	delivery_directory : null
    },
    initialize : function(attributes, options) {
    },
    parse : function(pResult) {
      return pResult;
    },
    getId : function(){
    	return this.get("id");
    },
    setId : function(pId){
    	this.set("id",pId);
    },
    getName : function(){
    	return this.get("name");
    },
    setName : function(pName){
    	this.set('name',pName);
    },
    getPrice : function(){
    	return this.get("price");
    },
    setPrice : function(pPrice){
    	this.set('price',pPrice);
    },
    getType : function(){
    	return this.get('type');
    },
    setType : function(pType){
    	this.set('type',pType)
    },
    getDescription : function(){
    	return this.get('description');
    },
    setDescription : function(pDescription){
    	this.set('description',pDescription);
    },
    getWeight : function(){
    	return this.get('weight');
    },
    setWeight : function(pWeight){
    	this.set('weight',pWeight);
    },
    getShippingType : function(){
    	return this.get('shipping_type');
    },
    setShippingType : function(pType){
    	this.set('shipping_type',pType);
    },
    getDeliveryDirectory : function(){
      return this.get('delivery_directory');
    },
    setDeliveryDirectory : function(pDeliveryDirectory){
      this.set('delivery_directory',pDeliveryDirectory)
    }
  });
  return ProductModel;
});