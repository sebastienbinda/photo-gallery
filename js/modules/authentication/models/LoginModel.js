/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */

define([ 'logger', 'bus', 'underscore', 'backbone', 'common/models/UserModel' ], function(logger, bus, _,backbone, UserModel) {
  var UserModel = UserModel.extend({
	url : "php/requests/login.php",
  });
  return UserModel;
});