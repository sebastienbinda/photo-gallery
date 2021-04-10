/*
 * 
 * VERSION 2.2 : 17/04/2015 : Gestion de différents répertoire de dépot pour les téléchargements
 * VERSION 2.2 : 16/04/2015 : Ajout du boutton d'ajout au panier dans la vue fullsize
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus','i18n!gallery/nls/Messages','widgets/confirm/views/ConfirmView',
         'commande/models/ItemModel','commande/collections/ItemsCollection','commande/collections/Cart','json!conf/app.configuration.json','authentication',
         'commande/models/CartUpdatedModel','text!gallery/templates/AddToCartPanel.html' ], 
 function($, _, backbone, handlebars, logger, bus, messages, ConfirmView, ItemModel, ItemsCollection, Cart, configuration, Authentication, CartUpdatedModel, form) {

  var ImageAddToCartPanelView = backbone.View.extend({
    id : 'app-img-add-to-cart-panel',
    template : handlebars.compile(form),
    context : messages.addtocartpanel,
    initialize : function(options) {
      _.bindAll(this,'downQuantity','upQuantity','selectProduct','addToCart','addToCartOk','addToCartInfo',
          'addToCartError','refreshCart','onRightClick','hideRightMenu','closePopup');
      this.model = options.model;
      if (options.popUpOnAdd != undefined && options.popUpOnAdd != null){
    	  this.popupOnAdd = options.popUpOnAdd;
      } else {
    	  this.popupOnAdd = false;
      }
      this.productsCollection = options.products;
    },
    events : {
    	"change #product-selection" : 'selectProduct',
    	"click #quantity-minus" : "downQuantity",
    	"click #quantity-plus" : "upQuantity",
    	"click .add-to-cart" : "addToCart",
    	"click .add-to-cart-close" : "closePopup",
    	"keypress #select-quantity" : "changeQuantity",
    	"contextmenu .add-to-cart-img" : 'onRightClick',
    	"mousemove .add-to-cart-img" : 'hideRightMenu'
    },
    render : function(){
    	
    	var imageLink="";
		if (configuration.image_link_php == true){
			imageLink="php/requests/user/getImage.php?type=thumb&id="+ this.model.getFullName();
		} else {
			var user = Authentication.getUser().getLogin();
			imageLink="users/"+user+"/thumbmails/"+this.model.getFullName();
		}
    	
    	var context = {
    			labels : this.context,
    			image : this.model.toJSON(),
    			defaultQuantity : '1',
    			products : this.productsCollection.toJSON(),
    			imageLink : imageLink
    	};
    	$(this.el).html(this.template(context));
    	$("#app-modal").html(this.el);
    	
    	$("#app-modal").dialog({
    		title : this.context.addtocartpaneltitle,
    		modal : true,
    		resizable : false,
    		width : "auto"
    	});
    	
    	// Check selected product
    	var productId = $(this.el).find("#product-selection").val();
    	var context = {
    		productId : productId
    	};
    	var product = _.find(this.productsCollection.models, function(obj) {
			return (obj.getId() == productId);
		}, context);
    	
    	if (product.getType() == 'download'){
    		$(this.el).find("#select-quantity").val("1");
    		$(this.el).find("#select-quantity").attr('disabled','disabled');
    		$(this.el).find("#quantity-zone").hide();
    	} else {
    		$(this.el).find("#select-quantity").removeAttr('disabled');
    		$(this.el).find("#quantity-zone").show();
    	}
    	
    	$(this.el).find("button").button();
    	
    },
    downQuantity : function (){
    	var curent = new Number($(this.el).find("#select-quantity").val());
    	if (curent > 0){
    		$(this.el).find("#select-quantity").val(curent-1);
    		if (curent-1 == 0){
        		$(this.el).find(".add-to-cart").button({
            		disabled : true
            	});
        	}
    	}
    },
    upQuantity : function(){
    	var curent = new Number($(this.el).find("#select-quantity").val());
    	$(this.el).find("#select-quantity").val(curent+1);
    	$(this.el).find(".add-to-cart").button({
    		disabled : false
    	});
    },
    changeQuantity : function(pEvent){
    	logger.info("key press");
    	if (pEvent.charCode >= 47 && pEvent.charCode <= 57){
    		return true;
    	} else {
    		return false;
    	}
    },
    selectProduct : function(){
    	// Check selected product
    	var productId = $(this.el).find("#product-selection").val();
    	var context = {
    		productId : productId
    	};
    	var product = _.find(this.productsCollection.models, function(obj) {
			return (obj.getId() == productId);
		}, context);
    	
    	if (product.getType() == 'download'){
    		$(this.el).find("#select-quantity").val("1");
    		$(this.el).find("#select-quantity").attr('disabled','disabled');
    		$(this.el).find("#quantity-zone").hide();
    	} else {
    		$(this.el).find("#select-quantity").removeAttr('disabled');
    		$(this.el).find("#quantity-zone").show();
    	}
    },
    addToCart : function(){
    	$("#app-modal").dialog('close');
    	
    	var productId = $(this.el).find("#product-selection").val();
    	var quantity = new Number($(this.el).find("#select-quantity").val());
    	
    	this.item = new ItemModel();
    	this.item.setProductId(productId);
    	this.item.setQuantity(quantity);
    	this.item.setPictureId(this.model.getFullName());
    	
    	this.items = new ItemsCollection();
    	this.items.add(this.item);
    	
    	bus.trigger(bus.events.loading);
    	
    	this.items.sync("create",this.items,{
    		success : this.addToCartOk,
    		error : this.addToCartError
    	});
    	
    	this.close();
    },
    closePopup : function(){
      $("#app-modal").dialog('close');
      this.close();
    },
    addToCartInfo : function (){
    	
    	if (this.popupOnAdd == true){
	    	$("#app-confirm").html("<p>"+messages.addtocartOkInfoPopUp+"</p>");
	    	
	    	var dialog_buttons = {}; 
	    	dialog_buttons[messages.confirmAddToCartOk] = function() {
		          $( this ).dialog( "close" );
	        }
	    	
	    	$("#app-confirm").dialog({
	    		modal : true,
	    		title : messages.addtocartOkInfoPopUpTitle,
	    		buttons : dialog_buttons
	    	});
    	}
    },
    addToCartOk : function(pResponse){
    	logger.info("Ajout au panier OK");
    	
    	this.addToCartInfo();
    	
    	// Collecte cart updated informations
    	var infos = new CartUpdatedModel(pResponse);
    	Cart.setShippingFee(infos.getShippingFee());
    	
    	this.items.fetch({
    		success : this.refreshCart,
    		error : this.addToCartError
    	});
    	
    },
    addToCartError : function(pResponse){
    	// Log error
    	logger.error("Cart error");
    	
    	bus.trigger(bus.events.stoploading);
    	
    	var message = "";
    	if (pResponse.status == 404){ 
    	  message = this.context.downloadFileDoesNotExists;
    	} else if (pResponse.status == 406){
    	  message = this.context.fileAlreadyInCart;
    	} else {
    	  message = this.context.cartErrorMessage;
    	}
    	
    	// Display error
    	var options = {
    	        context : {
    	        	title : this.context.cartErrorTitle,
    	        	warning : message,
    	        	cancel : null,
    	        	submit : null,
    	        	withoutCancel : true
    	        }
    	    };
    		
    	var confirmView = new ConfirmView(options);
    	confirmView.render();
    },
    refreshCart : function(pCollection){
    	logger.info("Ajout au panier courant");
    	Cart.add(pCollection.models,{
    		merge: true
    	});
    	bus.trigger(bus.events.stoploading);
    },
    onRightClick : function(pEvent){
    	logger.info("No right click");
    	
    	var x;
    	var y;
    	if (event.pageX || event.pageY) { 
    	  x = event.pageX;
    	  y = event.pageY;
    	}
    	else { 
    	  x = event.clientX; 
    	  y = event.clientY; 
    	}
    	
    	var o = $("#app-modal").dialog("open").offset();
    	x = x - o.left;
    	y = y -o.top;
    	
    	$(this.el).find("#right-click-menu").attr("style","top:"+y+"px; left:"+x+"px;");
    	$(this.el).find("#right-click-menu").show();
    	
    	this.rightMenuX = x;
    	this.rightMenuY = y;
    	
    	pEvent.preventDefault();
    	return false;
    },
    hideRightMenu : function(event){
    	var x;
    	var y;
    	if (event.pageX || event.pageY) {
    	  x = event.pageX;
    	  y = event.pageY;
    	}
    	else { 
    	  x = event.clientX; 
    	  y = event.clientY; 
    	}
    	var o = $("#app-modal").dialog("open").offset();
    	x = x - o.left;
    	y = y -o.top;
    	
    	if (x > this.rightMenuX + 20 || x < this.rightMenuX -20 || y > this.rightMenuY + 20 || y < this.rightMenuY -20){
    		$(this.el).find("#right-click-menu").hide();
    	}
    }
    
  });

  return ImageAddToCartPanelView;

});

