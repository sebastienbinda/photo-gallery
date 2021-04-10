/* 
 * 
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
 * VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
 * VERSION 2.2 : 15/04/2015 : Ajout d'un parametre d'affichage ou non du nom des photos.
 * VERSION 2.1 : 11/04/2015 : Ajout des sections de photos.
 * VERSION 1.1 : 07/08/2014 : Ajout de la description longue condifurable pour chaque utilisateur.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var UserModel = backbone.Model.extend({
	  
	url : function(){
		if (this.getLogin()){
			return "php/requests/user.php?login="+this.getLogin();
		} else {
			return "php/requests/user.php";
		}
	},

    // Default value
    defaults : {
      public : 0,
    	login : null,
    	password : null,
    	description : null,
    	allowdownload : null,
    	nb_pictures_by_page : null,
    	nb_products_min : null,
    	products : null,
    	long_description : null,
    	section_display_mode : null,
    	section_info_description : null,
    	display_picture_names : 1,
    	free_download_dir : null,
    	display_search_view : 0,
    	search_infos_description : null,
    	search_placeholder : null,
    	default_search_tags : null
    },
    initialize : function(attributes, options) {
    },
    parse : function(pResult) {
      return pResult;
    },
    isPublic : function(){
      return this.get("public");
    },
    setPublic : function(pPublic){
      this.set("public",pPublic);
    },
    getLogin : function(){
    	return this.get("login");
    },
    setLogin : function(pLogin){
    	this.set("login",pLogin);
    },
    setPassword : function(pPassword){
    	this.set("password",pPassword);
    },
    getDescription : function(){
    	return this.get("description");
    },
    setDescription : function(pDescription){
    	this.set('description',pDescription);
    },
    getLongDescription : function(){
    	return this.get("long_description");
    },
    setLongDescription : function(pLongDescription){
    	this.set("long_description",pLongDescription);
    },
    isAllowDownload : function(){
    	return this.get('allowdownload');
    },
    setAllowDownload : function(pAllow){
    	this.set('allowdownload',pAllow);
    },
    getNbPicturesByPage : function(){
    	return this.get("nb_products_by_page");
    },
    setNbPicturesByPage : function (pNb){
    	this.set('nb_pictures_by_page',pNb);
    },
    getNbProductsMin : function(){
    	return this.get('nb_products_min');
    },
    setNbProductsMin : function(pNb){
    	this.set('nb_products_min',pNb)
    },
    getProducts : function(){
    	return this.get("products");
    },
    setProducts : function(pProducts){
    	this.set("products",pProducts);
    },
    getSectionDisplayMode : function(){
    	return this.get("section_display_mode");
    },
    setSectionDisplayMode : function(pSectionDisplayMode){
    	return this.set("section_display_mode",pSectionDisplayMode);
    },
    getSectionInfoDescription : function(){
    	return this.get("section_info_description");
    },
    setSectionInfoDescription : function(pSectionInfoDescription){
    	return this.set("section_info_description",pSectionInfoDescription);
    },
    getDisplayPictureNames : function() {
      return this.get("display_picture_names");
    },
    setDisplayPictureNames : function(pDisplayPicturesName) {
      this.set('display_picture_names',pDisplayPicturesName)
    },
    getFreeDownloadDir : function(){
      return this.get('free_download_dir');
    },
    setFreeDownloadDir : function(pFreeDownloadDir){
      this.set('free_download_dir',pFreeDownloadDir);
    },
    getDisplaySearchView : function(){
    	return this.get('display_search_view');
    },
    setDisplaySearchView : function(pDisplaySearchView){
    	this.set("display_search_view",pDisplaySearchView);
    },
    getSearchInfosDescription : function(){
    	return this.get("search_infos_description");
    },
    setSearchInfosDescription : function (pText){
    	this.set("search_infos_description",pText);
    },
    getSearchPlaceHolder : function(){
    	return this.get("search_placeholder");
    },
    setSearchPlaceHolder : function (pText){
    	this.set("search_placeholder",pText);
    },
    getDefaultSearchTags : function(){
    	return this.get("default_search_tags");
    },
    setDefaultSearchTags : function(pTags){
    	this.set("default_search_tags",pTags);
    }
  });
  return UserModel;
});