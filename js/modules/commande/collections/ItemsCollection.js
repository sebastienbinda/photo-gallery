/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */

define([ 'logger', 'bus', 'underscore', 'backbone','commande/models/ItemModel' ],
		function(logger, bus, _,backbone,ItemModel) {
  var ItemsCollection = backbone.Collection.extend({
	model : ItemModel,
	url : function(){
		return "php/requests/cart.php";
	},
    parse : function(pResult) {
      return pResult;
    }
  });
  return ItemsCollection;
});