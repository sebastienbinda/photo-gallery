/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!commande/nls/Messages', 'commande/collections/Cart','widgets/confirm/views/ConfirmView',
         'commande/views/CartView','text!commande/templates/CartSummary.html'], function($, _,
    backbone, handlebars, logger, bus, messages, Cart, ConfirmView, CartView, form) {

  var CartSummaryView = backbone.View.extend({
    id : 'cartInfo',
    context : messages,
    template : handlebars.compile(form),
    initialize : function(options){
    	_.bindAll(this,'render','resetCart','displayCart','confirmReset','resetError');
    	this.target = options.target;
    	this.products = options.products;
    	this.listenTo(Cart,'sync',this.render);
    	this.listenTo(Cart,'add',this.refresh);
    	this.listenTo(Cart,'change',this.refresh);
    	this.listenTo(Cart,'reset',this.refresh);
    	
    	this.listenTo(bus,bus.events.displayCart,this.displayCart);
    	
    	this.totalPrice = 0;
    	this.nbPictures = 0;
    	
    	Cart.fetch();
    },
    events : {
    	'click #reset-cart' : 'confirmReset',
    	'click #view-cart' : 'displayCart',
    	'click' : 'displayCart'
    	  
    },
    render : function(){
    	
    	this.nbPictures = new Number(0);
    	this.totalPrice = new Number(0);
    	
    	logger.info("Affichage du panier résumé");
    	
    	_.each(Cart.models,function(pModel, pIdenx, pCart){
    		
    		var quantity = new Number(pModel.getQuantity());
    		var price = new Number(pModel.getPrice());
    		this.nbPictures += quantity;
    		this.totalPrice += price;
    		
    	},this);
    	
    	var context = {
    			price : this.totalPrice.toFixed(2),
    			number : this.nbPictures,
    			labels : this.context
    	}
    	
    	$(this.el).html(this.template(context));
    	$(this.target).html(this.el);
    	
    	$(this.el).find("button").button();
    	
    	if (Cart.length == 0 ){
    		$(this.el).find("button").hide();
    	} else {
    		$(this.el).find("button").show();
    	}
    	
    	this.delegateEvents();
    },
    refresh : function(){
    	
    	logger.info("Mise à jour du panier résumé");
    	
    	this.nbPictures = new Number(0);
    	this.totalPrice = new Number(0);
    	
    	_.each(Cart.models,function(pModel, pIdenx, pCart){
    		var quantity = new Number(pModel.getQuantity());
    		var price = new Number(pModel.getPrice());
    		this.nbPictures += quantity;
    		this.totalPrice += price;
    		
    	},this);
    	
    	$(this.el).find("#nbTotal").html(this.nbPictures);
    	$(this.el).find(".cart-number-title").html(this.nbPictures);
    	$(this.el).find("#totalPrice").html(this.totalPrice.toFixed(2));
    	
    	if (Cart.length == 0 ){
    		$(this.el).find("button").hide();
    	} else {
    		$(this.el).find("button").show();
    	}
    	
    },
    confirmReset : function(){
    	$("#app-confirm").html("<p>"+this.context.confirmReset+"</p>");
    	
    	var dialog_buttons = {}; 
    	dialog_buttons[this.context.confirmResetButton] = this.resetCart;
    	dialog_buttons[this.context.cancelResetButton] = function() {
	          $( this ).dialog( "close" );
        }
    	
    	$("#app-confirm").dialog({
    		modal : true,
    		title : this.context.confirmResetCartTitle,
    		buttons : dialog_buttons
    	});
    },
    resetCart : function (){
    	Cart.sync('delete',Cart,{
    		success : this.resetOk,
    		error : this.resetError
    	});
    },
    resetOk : function(){
    	logger.info("Reset cart ok");
    	$("#app-confirm").dialog("close");
    	Cart.reset();
    },
    resetError : function(){
    	// log error
		logger.error("Reset cart error");
		
		// Close confirm dialog
		$("#app-confirm").dialog("close");
		
		var options = {
	        context : {
	        	title : this.context.cart.cartErrorTitle,
	        	warning : this.context.cart.cartErrorMessage,
	        	cancel : null,
	        	submit : null,
	        	withoutCancel : true
	        }
	    };
		
		var confirmView = new ConfirmView(options);
		confirmView.render();
    },
    displayCart : function(){
    	if (Cart.length > 0){
    		
    		$("#content").html("<div class='loading custom-loading'><span>Franckrp photogprahe<br/></span>Chargement ... </div>");
    		
    		if (this.cartView){
    			this.cartView.render();
    		} else {
		    	this.cartView = new CartView({
		    		target : "#content",
		    		products : this.products
		    	});
    		}
    	}
    },
    onClose : function(){
      if (this.cartView){
        this.cartView.close();
      }
    }
  });

  return CartSummaryView;

});
