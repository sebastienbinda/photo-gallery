/*
 * 
 * VERSION 2.1 : 11/04/2015 : Création
 * 
 * @author: S.Binda
 * 
 */
 
define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var DirectoryModel = backbone.Model.extend({

    // Default value
    defaults : {
    	name : null,
    	image : null,
    },
    parse : function(pResult) {
      return pResult;
    },
    getName : function(){
    	return this.get('name');
    },
    getImage : function(){
    	return this.get('image')
    }
  });
  return DirectoryModel;
});