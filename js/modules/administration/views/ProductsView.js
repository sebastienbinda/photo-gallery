/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!administration/nls/Messages', 'administration/views/ProductView',
         'administration/views/ProductEditView','text!administration/templates/Products.html','async', 'tablesorter' ], 
 function($, _, backbone, handlebars, logger, bus, messages, ProductView, ProductEditView, form, Async) {

  var ProductsView = backbone.View.extend({
    id : 'app-admin-products-view',
    template : handlebars.compile(form),
    context : messages.productmanagement,
    initialize : function(options) {
      _.bindAll(this,'addNewProduct','refresh','beforeRender','render','closeDialog');
      this.target = options.target;
      this.collection = options.collection;
      this.shippingTypes = options.shippingTypes;
      
      this.listenTo(this.collection,'reset',this.render);
      
      var map = new Array();
      map.push(this.collection);
      map.push(this.shippingTypes);
      var fetch = function(pCollection, pCallback){
    	  pCollection.fetch({
    		  success : function(pCollection){
    			  pCallback(null,pCollection);
    		  },
    		  error : function(pCollection, xhr, options){
    			  pCallback(xhr,pCollection);
    		  }
    	  })
      };
      Async.map(map,fetch,this.beforeRender);
    },
    events : {
    	'click #add-product' : 'addNewProduct'
    },
    addNewProduct : function() {
    	logger.info("Adding a new product");
    	
    	this.productEditView = new ProductEditView({
    		target : '#app-modal',
    		shippingTypes : this.shippingTypes
    	});
    	this.productEditView.render();
    	$("#app-modal").dialog({
    		title : this.context.newProductDialogTitle,
    		width : "400px",
    		modal : true
    	});
    	
    	this.listenTo(this.productEditView,'CloseView',this.closeDialog);
    	this.listenTo(this.productEditView,'addProduct',this.refresh);
    	
    },
    closeDialog : function() {
    	$("#app-modal").dialog('close');
    },
    refresh : function(){
    	this.collection.fetch();
    },
    beforeRender : function(err, results){
    	if (err == null){
    		this.listenTo(this.collection,'sync',this.render);
    		this.render();
    	} else {
    		logger.error("Error asynchrone");
    	}
    },
    render : function(){
    	var context = {
    			labels : this.context,
    	};
    	$(this.el).html(this.template(context));
    	$(this.target).html(this.el);
    	
    	_.each(this.collection.models, function(pModel, pIndex, pCollection){
    		
    		var productView = new ProductView({
    			target : '#productsTable > tbody',
    			model : pModel,
    			shippingTypes : this.shippingTypes
    		});
    		
    		productView.render();
    	},this);

    	$(this.el).find("#productsTable").tablesorter();
    	$(this.el).find("button").button();
    	
    	this.delegateEvents();
    }
  });

  return ProductsView;

});

