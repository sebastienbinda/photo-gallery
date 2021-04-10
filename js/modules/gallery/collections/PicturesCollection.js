/* 
 * 
 * VERSION 2.1 : 11/04/2015 : Ajout des sections de photos.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone','gallery/models/PictureModel' ], function(logger, bus, _,backbone,PictureModel) {
  var PicturesCollection = backbone.Collection.extend({
	model : PictureModel,
	url : function(){
	  var parameters = "";
		if (this.getSection()){
			parameters = "&section="+this.getSection();
		} else {
			parameters = "&section=_root";
		}
		
		if (this.getMeta() && this.getMeta() != ""){
		  parameters = parameters + "&meta=" + this.getMeta();
		}
		return "php/requests/user/getPictures.php?page="+this.getCurentPage()+parameters;
	},
    initialize : function(options) {
    	if (options){
    		this.curentPage = options.curentPage ? options.curentPage : 1;
    	} else {
    		this.curentPage = 1;
    	}
    	
    	if (!this.nbpages){
    		this.nbpages=0;
    	}
    	
    	if (!this.nbpictures){
    		this.nbpictures=0;
    	}
    	this.section = null;
    	this.tagResult = 1;
    },
    parse : function(pResult) {
    	this.nbpages = pResult.nbpages;
    	this.nbpictures = pResult.nbpictures;
    	this.firstindex = pResult.firstindex;
    	this.tagResult = pResult.tagResult;
    	return pResult.pictures;
    },
    getCurentPage : function(){
    	return this.curentPage;
    },
    setCurentPage : function(pNumPage){
    	this.curentPage = pNumPage;
    },
    getNbPages : function(){
    	return this.nbpages;
    },
    getNbPictures : function(){
    	return this.nbpictures;
    },
    getFirstIndex : function(){
    	return this.firstindex;
    },
    setSection : function(pSection){
    	this.section = pSection;
    },
    getSection : function(){
    	return this.section;
    },
    setMeta : function(pMeta){
      this.meta = pMeta
    },
    getMeta : function(){
      return this.meta;
    },
    getTagResult : function(){
    	return this.tagResult;
    }
  });
  return PicturesCollection;
});