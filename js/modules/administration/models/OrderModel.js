/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var OrderModel = backbone.Model.extend({
	  
	url : function(){
		if (this.getId()){
			return "php/requests/order.php?id=" + this.getId();
		} else {
			return "php/requests/order.php";
		}
	},

    // Default value
    defaults : {
    	id : null,
    	username : null,
    	useremail : null,
    	date : null,
    	price : null,
    	status : null,
    	downloadfile : null,
    },
    initialize : function(attributes, options) {
    },
    parse : function(pResult) {
      return pResult;
    },
    getId : function(){
    	return this.get("id");
    },
    setId : function(pId){
    	this.set("id",pId);
    },
    getUserName : function(){
    	return this.get('username');
    },
    setUserName : function(pUserName){
    	this.set("username",pUserName);
    },
    getUserEmail : function(){
    	return this.get('useremail');
    },
    setUserName : function(pUserEmail){
    	this.set("useremail",pUserEmail);
    },
    getDate : function(){
    	return this.get("date");
    },
    setDate : function(pDate){
    	this.set('date',pDate);
    },
    getPrice : function(){
    	return this.get("price");
    },
    setPrice : function (pPrice){
    	this.set('price',pPrice);
    },
    getStatus : function(){
    	return this.get("status");
    },
    setStatus : function (pStatus){
    	this.set('status',pStatus);
    },
    getDownloadFile : function(){
    	return this.get("downloadfile");
    },
    setDownloadFile : function (pDownloadFile){
    	this.set('downloadfile',pDownloadFile);
    }
  });
  return OrderModel;
});