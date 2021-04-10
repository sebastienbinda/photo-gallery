/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var IndexPictures = backbone.Model.extend({
	  
	url : function(){
		return "php/requests/admin/indexPictures.php?login=" + this.getLogin();
	},

    // Default value
    defaults : {
    	login : "",
    },
    initialize : function(attributes, options) {
    },
    parse : function(pResult) {
      return pResult;
    },
    getLogin : function(){
    	return this.get('login');
    },
    setLogin : function(pLogin){
    	this.set("login",pLogin);
    }
  });
  return IndexPictures;
});