/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!administration/nls/Messages',  'widgets/confirm/views/ConfirmView','administration/views/ProductEditView',
         'text!administration/templates/Product.html','tablesorter' ], 
 function($, _, backbone, handlebars, logger, bus, messages, ConfirmView, ProductEditView, form) {

  var ProductView = backbone.View.extend({
    id : 'app-admin-product-view',
    tagName : 'tr',
    template : handlebars.compile(form),
    context : messages.productmanagement,
    initialize : function(options) {
      _.bindAll(this,'render','editProduct','deleteProduct','confirmDelete','productDeleted','productDeleteError');
      this.target = options.target;
      this.model = options.model;
      this.shippingTypes = options.shippingTypes;
      this.collection = this.model.collection;
    },
    render : function(){
    	
    	var productTypeLabel = this.context.typeStandard;
    	if (this.model.getType()=='download'){
    		productTypeLabel = this.context.typeDownload;
    	}
    	var context = {
    			labels : this.context,
    			productTypeLabel : productTypeLabel,
    			product : this.model.toJSON()
    	};
    	$(this.el).html(this.template(context));
    	$(this.target).append(this.el);
    	
    	$(this.el).find(".product-actions").buttonset();
    	$(this.el).find("button").button();
    },
    events : {
    	"click #product-edit" : 'editProduct',
    	"click #product-delete" : 'confirmDelete',
    },
    editProduct : function(){
    	logger.info("Editing product id="+this.model.getId());
    	
    	if (this.productEditView){
    		this.productEditView.close();
    	}
    	this.productEditView = new ProductEditView({
    		target : '#app-modal',
    		model : this.model,
    		products : this.productsCollection,
    		shippingTypes : this.shippingTypes
    	});
    	this.productEditView.render();
    	$("#app-modal").dialog({
    		title : this.context.editProductDialogTitle,
    		width : "auto",
    		height : "auto",
    		modal : true
    	});
    	
    	this.listenTo(this.productEditView,'CloseView',this.closeDialog);
    },
    deleteProduct : function(){
    	logger.info("Deleting product id="+this.model.getId());
    	this.model.id = this.model.getId();
    	this.model.destroy({
    		success : this.productDeleted,
    		error : this.productDeleteError
    	});
    	
    	$("#app-confirm").dialog('close');
    },
    productDeleted : function(pModel){
    	this.collection.fetch({
    		reset : true
    	});
    },
    productDeleteError : function(){
    	// Log error
    	logger.error("Product delete error");
    	
    	// Display error
    	var options = {
    	        context : {
    	        	title : this.context.deleteErrorTitle,
    	        	warning : this.context.deleteErrorMessage,
    	        	cancel : null,
    	        	submit : null,
    	        	withoutCancel : true
    	        }
    	    };
    		
    	var confirmView = new ConfirmView(options);
    	confirmView.render();
    },
    confirmDelete : function(){
    	$("#app-confirm").html("<p>"+this.context.confirmDeleteProductMessage+"</p>");
    	
    	var dialog_buttons = {}; 
    	dialog_buttons[this.context.confirmDeleteProductButton] = this.deleteProduct;
    	dialog_buttons[this.context.cancelDeleteProductButton] = function() {
	          $( this ).dialog( "close" );
        }
    	
    	$("#app-confirm").dialog({
    		title : this.context.confirmDeleteProductTitle,
    		buttons : dialog_buttons
    	});
    },
    closeDialog : function() {
    	$("#app-modal").dialog('close');
    },
  });

  return ProductView;

});

