/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone','common/models/ProductModel' ], function(logger, bus, _,backbone,ProductModel) {
  var ProductsCollection = backbone.Collection.extend({
	model : ProductModel,
	url : function(){
		return "php/requests/user/getProducts.php";
	},
	initialize : function(options) {
    },
    parse : function(pResult) {
      return pResult;
    }
  });
  return ProductsCollection;
});