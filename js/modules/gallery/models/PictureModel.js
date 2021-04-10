/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var PictureModel = backbone.Model.extend({

    // Default value
    defaults : {
    	// Url access is only fill by the server if the curent user have download access
    	url_access : null,
    	fullname : null,
    	name : null,
    	thumb_width : null,
    	thumb_height : null
    },
    parse : function(pResult) {
      return pResult;
    },
    getFullName : function (){
    	return this.get("fullname");
    },
    getThumbLink : function(){
    	return this.get("thumb_link");
    },
    getName : function(){
    	return this.get("name");
    },
    getThumbWidth : function(){
    	return this.get("thumb_width");
    },
    getThumbEight : function(){
    	return this.get("thumb_height");
    },
    getUrlAccess : function(){
    	return this.get('url_access');
    }
   
  });
  return PictureModel;
});