/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus','authentication','tools/Messages','json!conf/app.configuration.json',
         'i18n!commande/nls/Messages', 'widgets/confirm/views/ConfirmView','commande/collections/Cart','commande/views/CartItemView','commande/models/CartUpdatedModel',
         'text!commande/templates/Cart.html','text!commande/templates/paypalButtonTemplate.html'], function($, _,
    backbone, handlebars, logger, bus, Authentication,MessagesTools, configuration, messages, ConfirmView, Cart, CartItemView, CartUpdatedModel, form, paypalbuttonform) {

  var CartView = backbone.View.extend({
    id : 'cart-view',
    context : messages.cart,
    template : handlebars.compile(form),
    paypaltemplate : handlebars.compile(paypalbuttonform),
    initialize : function(options){
    	_.bindAll(this,"render","refresh","carInfosFetched","backToGallery","confirmReset",
    			"resetCart","resetOk","displayPayPalButton",'redirectionPayPal','cartError');
    	this.target = options.target;
    	this.productsCollection = options.products;
    	
    	this.listenTo(Cart,"change",this.refresh);
    	this.listenTo(Cart,"destroy",this.refresh);
    	this.listenTo(Cart,"reset",this.refresh);
    	
    	var cartInfos = new CartUpdatedModel();
    	cartInfos.fetch({
    		success : this.carInfosFetched,
    		error : this.cartError
    	});
    },
    events : {
    	"click #back-to-gallery" : "backToGallery",
    	"click #reset-cart" : "confirmReset"
    },
    carInfosFetched : function(pResponse){
    	Cart.setShippingFee(pResponse.getShippingFee());
    	this.render();
    },
    render : function(){
    	
    	logger.info("Affichage du panier");
    	
    	var user = Authentication.getUser();
    	
    	// Mange navigator history
        backbone.history.navigate("cart/"+user.getLogin(),{trigger:false});
        
    	var shippingfee = new Number(Cart.getShippingFee());
    	
    	this.commandTotalPrice = new Number(0);
    	
    	_.each(Cart.models,function(pModel, pIdenx, pCart){
    		this.commandTotalPrice += pModel.getPrice();
    	},this);
    	
    	this.commandTotalPrice = this.commandTotalPrice + shippingfee;
    	
    	var context = {
    			shippingfee : shippingfee.toFixed(2),
    			total : this.commandTotalPrice.toFixed(2),
    			labels : this.context
    	};
    	
    	$(this.el).html(this.template(context));
    	$(this.target).html(this.el);
    	
    	_.each(Cart.models,function(pModel, pIdenx, pCart){
    		
    		var itemView = new CartItemView({
				model : pModel,
				products : this.productsCollection,
				target : '#cart .tablesorter tbody'
			});
    		itemView.render();
    		
    	},this);
    	
    	$(this.el).find("button").button();
    	
    	if (Cart.length > 0){
    		this.displayPayPalButton();
    	}
    	
    	$("#wrapper").scrollTop(0);
    	
    	this.delegateEvents();
    	
    	this.listenTo(Cart,"change",this.refresh);
    	this.listenTo(Cart,"destroy",this.refresh);
    	this.listenTo(Cart,"reset",this.refresh);
    },
    refresh : function(){

    	this.commandTotalPrice = new Number(0);
    	
    	var user = Authentication.getUser();
    	var shippingfee = new Number(Cart.getShippingFee());
    	
    	_.each(Cart.models,function(pModel, pIdenx, pCart){
    		this.commandTotalPrice += new Number(pModel.getPrice());
    	},this);
    	
    	$(this.el).find("#shippingfee").html(shippingfee.toFixed(2));
    	
    	this.commandTotalPrice = this.commandTotalPrice + shippingfee;
    	
    	$(this.el).find("#total").html(this.commandTotalPrice.toFixed(2));
    	
    	if (Cart.length == 0){
    		this.backToGallery();
    	} else {
    		this.displayPayPalButton();
    	}
    },
    displayPayPalButton : function(){
    	$(this.el).find("#paypal").hide();
    	$(this.el).find("#paypal").empty();
    	
    	var user = Authentication.getUser();
    	
    	var minProducts = user.getNbProductsMin();
    	
    	this.nbTotalProducts = new Number(0);
    	
    	var count = 0;
    	this.paypalItems = [];
    	_.each(Cart.models,function(pModel, pIdenx, pCart){
    		
    		var user = Authentication.getUser();
    		
    		// Get associated product
    		var product = _.find(this.productsCollection.models, function(obj) {
    			return (obj.getId() == pModel.getProductId());
    		}, this);
    		
    		count = count+1;
    		var item = {
    				index : count,
    				description : user.getDescription(),
    				pictureid : pModel.getPictureId(),
    				price : product.getPrice(),
    				quantity : pModel.getQuantity(),
    				productid : product.getId(),
    				product : product.getName(),
    		}
    		this.paypalItems.push(item);
    		
    		this.nbTotalProducts = this.nbTotalProducts + pModel.getQuantity();
    	},this);
    	
    	// If the number of products in the  cart is greater than the minumun required, then display the buy button
    	if (this.nbTotalProducts >= minProducts){
    		$(this.el).find("#information-zone").empty();
	    	var context = {
	    			user : user.getLogin(),
	    			shippingfee : Cart.getShippingFee(),
	    			paypalAccount : configuration.paypal_id,
	    			paypalUrl : configuration.paypal_url,
	    			items : this.paypalItems
	    	};
	    	$(this.el).find("#paypal").html(this.paypaltemplate(context));
	  		$(this.el).find("#paypal").show();
	  		
	  		$(this.el).find("form").submit(this.redirectionPayPal);
    	} else {
    		// Else, display an information message
    		$(this.el).find("#information-zone").html(MessagesTools.getMessage(this.context.minimumNumberOfProductsNotReached,minProducts,this.nbTotalProducts));
    	}
    },
    backToGallery : function (){
    	this.close();
    	bus.trigger(bus.events.displayGallery);
    },
    redirectionPayPal : function(){
    	$(this.el).find('#cart').addClass('loading-filter');
    	$(this.el).find("#loading").show();
    	return true;
    },
    resetCart : function (){
    	Cart.sync('delete',Cart,{
    		success : this.resetOk,
    		error : this.cartError
    	});
    	$("#app-confirm").dialog('close');
    },
    confirmReset : function(){
    	$("#app-confirm").html("<p>"+this.context.confirmReset+"</p>");
    	
    	var dialog_buttons = {}; 
    	dialog_buttons[messages.confirmResetButton] = this.resetCart;
    	dialog_buttons[messages.cancelResetButton] = function() {
	          $( this ).dialog( "close" );
        }
    	
    	$("#app-confirm").dialog({
    		modal : true,
    		title : messages.confirmResetCartTitle,
    		buttons : dialog_buttons
    	});
    },
    resetOk : function(){
    	logger.info("Reset cart ok");
    	Cart.reset();
    	this.close();
    	bus.trigger(bus.events.displayGallery);
    },
    cartError : function(){
    	// Log error
    	logger.error("Cart error");
    	
    	// Display error
    	var options = {
    	        context : {
    	        	title : this.context.cartErrorTitle,
    	        	warning : this.context.cartErrorMessage,
    	        	cancel : null,
    	        	submit : null,
    	        	withoutCancel : true
    	        }
    	    };
    		
    	var confirmView = new ConfirmView(options);
    	confirmView.render();
    }
  });

  return CartView;

});
