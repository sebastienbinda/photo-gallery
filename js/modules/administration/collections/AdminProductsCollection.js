/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone','common/collections/ProductsCollection' ], function(logger, bus, _,backbone,ProductsCollection) {
  var AdminProductsCollection = ProductsCollection.extend({
	url : function(){
		return "php/requests/admin/getProducts.php";
	},
  });
  return AdminProductsCollection;
});