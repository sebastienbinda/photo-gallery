/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone','administration/models/OrderStateModel'], function(logger, bus, _,backbone, OrderStateModel) {
  var OrderStatesCollection = backbone.Collection.extend({
	url : function(){
		return "php/requests/admin/getOrderStates.php";
	},
	model : OrderStateModel
  });
  return OrderStatesCollection;
});