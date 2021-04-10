/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone','administration/models/ShippingTypeModel'], function(logger, bus, _,backbone, ShippingTypeModel) {
  var ShippingTypesCollection = backbone.Collection.extend({
	url : function(){
		return "php/requests/admin/getShippingTypes.php";
	},
	model : ShippingTypeModel
  });
  return ShippingTypesCollection;
});