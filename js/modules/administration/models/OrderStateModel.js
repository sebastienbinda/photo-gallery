/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'bus', 'underscore', 'backbone' ], function(logger, bus, _,backbone) {
  var OrderStateModel = backbone.Model.extend({
    // Default value
    defaults : {
    	id : null,
    	state : null
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
    getState : function(){
    	return this.get('state');
    },
    setState : function(pState){
    	this.set("state",pState);
    }
  });
  return OrderStateModel;
});