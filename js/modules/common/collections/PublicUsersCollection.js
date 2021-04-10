/*
 * 
 * VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone','common/models/UserModel' ], function(logger, bus, _,backbone,UserModel) {
  var PublicUsersCollection = backbone.Collection.extend({
  model : UserModel,
  url : function(){
    return "php/requests/publicUsers.php";
  },
    initialize : function(options) {
    },
    parse : function(pResult) {
      return pResult;
    },
  });
  return PublicUsersCollection;
});