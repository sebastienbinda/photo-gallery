/*
 * 
 * VERSION 2.2 : 15/04/2015 : Gestion de la connexion sans mot de passe.
 * 
 * @author: S.Binda
 * 
 */

define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var ServiceConfModel = backbone.Model.extend({
    defaults : {
      password_enable : 1
    },
    url : "php/requests/serviceConf.php",
    parse : function(pResult) {
        return pResult;
    },
    getPasswordEnable : function(){
      return this.get('password_enable');
    },
    setPasswordEnable : function(pPasswordEnable){
    	this.set('password_enable',pPasswordEnable);
    }
  });
  return ServiceConfModel;
});