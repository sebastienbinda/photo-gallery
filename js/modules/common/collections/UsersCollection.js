/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone','common/models/UserModel' ], function(logger, bus, _,backbone,UserModel) {
  var UsersCollection = backbone.Collection.extend({
	model : UserModel,
	url : function(){
		return "php/requests/admin/getUsers.php";
	},
    initialize : function(options) {
    },
    parse : function(pResult) {
    	return pResult;
    },
  });
  return UsersCollection;
});