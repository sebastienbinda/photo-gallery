/*
 * 
 * VERSION 2.1 : 11/04/2015 : Création
 * 
 * @author: S.Binda
 * 
 */
 
define([ 'logger', 'bus', 'underscore', 'backbone','gallery/models/DirectoryModel' ], function(logger, bus, _,backbone,DirectoryModel) {
  var DirectoriesCollection = backbone.Collection.extend({
	model : DirectoryModel,
	url : function(){
		return "php/requests/user/getDirectories.php?section=" + this.section;
	},
    initialize : function(options) {
    	this.section="";
    },
    parse : function(pResult) {
    	return pResult;
    },
    setSection : function(pSection){
    	this.section = pSection;
    },
    getSection : function(){
    	return this.section;
    }
  });
  return DirectoriesCollection;
});