/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone','administration/models/OrderModel'], function(logger, bus, _,backbone, OrderModel) {
  var OrdersCollection = backbone.Collection.extend({
	url : function(){
		return "php/requests/admin/getOrders.php";
	},
	model : OrderModel
  });
  return OrdersCollection;
});