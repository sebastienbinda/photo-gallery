/*
 *
 * VERSION 2.2 : 17/04/2015 : Gestion de différents répertoire de dépot pour les téléchargements 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!administration/nls/Messages',  'widgets/confirm/views/ConfirmView','common/models/ProductModel',
         'text!administration/templates/ProductEdit.html' ], 
 function($, _, backbone, handlebars, logger, bus, messages, ConfirmView, ProductModel, form) {

  var ProductEditView = backbone.View.extend({
    id : 'app-admin-edit-product-view',
    template : handlebars.compile(form),
    context : messages.productmanagement,
    initialize : function(options) {
      _.bindAll(this,'render','validateSave','save','saveSuccess','addSuccess','editError','onTypeChange','close','onClose');
      this.target = options.target;
      this.model = options.model ? options.model : new ProductModel();
      this.shippingTypes = options.shippingTypes;
    },
    events : {
    	"change #type" : "onTypeChange",
    	"click #save-product" : "validateSave",
    	"click #cancel-product" : "close"
    },
    render : function(){
    		
    	var context = {
    			labels : this.context,
    			product : this.model.toJSON(),
    			shipping_types : this.shippingTypes.toJSON()
    	};
    	
    	$(this.el).html(this.template(context));
    	$(this.target).html(this.el);
    	
    	// Select type
    	$(this.el).find("#type").val(this.model.getType());
    	    	
    	$(this.el).find("button").button();
    	
    	$(this.el).find("#shipping_type").val(this.model.getShippingType());
    	
    	this.onTypeChange();
    },
    validateSave : function(){
    	var name = $(this.el).find("#name").val();
    	var price = $(this.el).find("#price").val();
    	var weight = $(this.el).find("#weight").val();
    	var type = $(this.el).find("#type").val();
    	var shipping_type = $(this.el).find("#shipping_type").find(':selected').val();
    	var deliveryDirectory = $(this.el).find("#delivery_directory").val();
    	var err=false;
    	
    	$(this.el).find("input").removeClass("fieldrequired");
    	
    	if (name == ""){
    		$(this.el).find("#name").addClass("fieldrequired");
    		err=true;
    	}
    	
    	if (price == "" || !(price >= 0 || price < 0)){
    		$(this.el).find("#price").addClass("fieldrequired");
    		err=true;
    	}
    	
    	if (!shipping_type && type != 'download'){
    		$(this.el).find("#shipping_type").addClass("fieldrequired");
    		err=true;
    	}
    	
    	if (isNaN(weight)){
    		$(this.el).find("#weight").addClass("fieldrequired");
    		err=true;
    	}
    	
    	if (!err){
    		this.save();
    	}
    },
    save : function(){
    	$(this.el).find('#product-edit').addClass("loading-filter");
    	$(this.el).find('#loading').show();
    	$(this.el).find("button").button({
    		disabled : true
    	});
    	// If model login is defined so we update a existing user
    	if (this.model.getId()){
    		logger.info("update product " + this.model.getId());
	    	var productModel = new ProductModel();
	    	productModel.setId(this.model.getId());
	    	productModel.setName($(this.el).find("#name").val());
	    	productModel.setPrice($(this.el).find("#price").val());
	    	productModel.setType($(this.el).find("#type").val());
	    	if ($(this.el).find("#type").val() == 'download'){
	    		productModel.setShippingType("none");
	    	} else {
	    		productModel.setShippingType($(this.el).find("#shipping_type").find(':selected').val());
	    	}
	    	
	    	productModel.setDescription($(this.el).find("#description").val());
	    	productModel.setWeight($(this.el).find("#weight").val());
	    	
	    	var deliveryDirectory = $(this.el).find("#delivery_directory").val();
	    	productModel.setDeliveryDirectory(deliveryDirectory);
	    	
	    	
	    	productModel.save(null,{
	    		success : this.saveSuccess,
	    		error : this.editError
	    	});
    	} else {
    		logger.info("creating new product " + $(this.el).find("#login").val());
    		var productModel = new ProductModel();
	    	productModel.setName($(this.el).find("#name").val());
	    	productModel.setPrice($(this.el).find("#price").val());
	    	productModel.setType($(this.el).find("#type").val());
	    	productModel.setDescription($(this.el).find("#description").val());
	    	if ($(this.el).find("#type").val() == 'download'){
	    		productModel.setShippingType("none");
	    	} else {
	    		productModel.setShippingType($(this.el).find("#shipping_type").find(':selected').val());
	    	}
	    	
	    	var deliveryDirectory = $(this.el).find("#delivery_directory").val();
        productModel.setDeliveryDirectory(deliveryDirectory);
	    	
	    	productModel.save(null,{
	    		success : this.addSuccess,
	    		error : this.editError
	    	});
    	}
    	
    },
    addSuccess : function (){
    	logger.info("Product added !")
    	
    	$(this.el).find('#product-edit').removeClass("loading-filter");
    	$(this.el).find('#loading').hide();
    	$(this.el).find("button").button({
    		disabled : false
    	});
    	
    	this.trigger('addProduct');
    	this.close();
    },
    saveSuccess : function(){
    	logger.info("Product saved!")
    	
    	$(this.el).find('#product-edit').removeClass("loading-filter");
    	$(this.el).find('#loading').hide();
    	$(this.el).find("button").button({
    		disabled : false
    	});
    	
    	this.model.fetch({
    		reset : true,
    		success : function (pModel){
    			logger.info("fetch ok");
    		}
    	});
    	this.close();
    },
    editError : function(){
    	// Log Error
    	logger.error("Product save error");
    	
    	// Display error
    	var options = {
    	        context : {
    	        	title : this.context.editErrorTitle,
    	        	warning : this.context.editErrorMessage,
    	        	cancel : null,
    	        	submit : null,
    	        	withoutCancel : true
    	        }
    	    };
    		
    	var confirmView = new ConfirmView(options);
    	confirmView.render();
    	
    	// Display edit form
    	$(this.el).find('#product-edit').removeClass("loading-filter");
    	$(this.el).find('#loading').hide();
    	$(this.el).find("button").button({
    		disabled : false
    	});
    },
    onTypeChange : function(){
    	if($(this.el).find("#type").val() == 'download'){
    		$(this.el).find("#shipping_type").prop('disabled', true);
    	} else {
    		$(this.el).find("#shipping_type").prop('disabled', false);
    	}
    },
    onClose : function(){
    	this.remove();
    }
  });

  return ProductEditView;

});

