/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus','DomTools','json!conf/app.configuration.json','authentication',
         'widgets/confirm/views/ConfirmView','commande/collections/Cart',
         'commande/models/ItemModel','commande/collections/ItemsCollection','commande/models/CartUpdatedModel',
         'i18n!commande/nls/Messages', 'text!commande/templates/CartItem.html','tablesorter'], function($, _,
    backbone, handlebars, logger, bus, DomTools, configuration, Authentication, ConfirmView, Cart, ItemModel, ItemsCollection, CartUpdatedModel, messages, form) {

  var CartItemView = backbone.View.extend({
    id : 'cart-item-view',
    tagName : 'tr',
    context : messages.cart,
    template : handlebars.compile(form),
    initialize : function(options){
    	_.bindAll(this,"render","refresh","setQuantity","upQuantity","downQuantity","deleteFromCart",
    			"setToCartOk","addToCartOk","removeFromCartOk","deleteFromCartOk","addToCartError");
    	this.target = options.target;
    	this.model = options.model;
    	this.productsCollection = options.products; 
    	
    	this.product = _.find(this.productsCollection.models, function(obj) {
			return (obj.getId() == this.model.getProductId());
		}, this);
    	
    	this.listenTo(this.model,'change',this.refresh);
    },
    events :{
    	"change #select-quantity" : "setQuantity",
    	"click #quantity-plus" : "upQuantity",
    	"click #quantity-minus" : "downQuantity",
    	"click #delete-from-cart" : "deleteFromCart",
    	"contextmenu img": 'onRightClick',
    	"mousemove img" : 'hideRightMenu'
    },
    render : function(){
	
		if (this.product){
			var productPrice = new Number(this.product.getPrice());
			var totalPrice = new Number(this.model.getPrice());
			var item = {
					name : this.model.getPictureId(),
					productName : this.product.getName(),
					productPrice : productPrice.toFixed(2),
					quantity : this.model.getQuantity(),
					price : totalPrice.toFixed(2)
			};
			
			var imageLink="";
			if (configuration.image_link_php == true){
				imageLink="php/requests/user/getImage.php?type=thumb&id="+ this.model.getPictureId();
			} else {
				var user = Authentication.getUser().getLogin();
				imageLink="users/"+user+"/thumbmails/"+this.model.getPictureId();
			}
			
			var context = {
				item : item,
				labels : this.context,
				imageLink : imageLink
			};
			
			if (this.product.getType()!='download'){
				context['displayQuantity'] = true;
			}
			
			$(this.el).html(this.template(context));
	    	$(this.target).append(this.el);
	    	
	    	$(this.el).find("button").button();
		}
    },
    refresh : function(){
    	$(this.el).find("#select-quantity").val(this.model.getQuantity());
    	$(this.el).find(".total-price-column").html(this.model.getPrice());
    	$(this.el).find("button").button({
    		disabled : false
    	});
    	$(this.el).find("#select-quantity").removeAttr('disabled');
    },
    upQuantity : function(){
    	var item = new ItemModel();
    	item.setProductId(this.model.getProductId());
    	item.setQuantity(1);
    	item.setPictureId(this.model.getPictureId());
    	
    	var items = new ItemsCollection();
    	items.add(item);
    	
    	$(this.el).find("#quantity-plus").button({
    		disabled : true
    	});
    	$(this.el).find("#quantity-minus").button({
    		disabled : true
    	});
    	$(this.el).find("#select-quantity").attr('disabled','disabled');
    	
    	items.sync("create",items,{
    		success : this.addToCartOk,
    		error : this.addToCartError
    	});
    },
    downQuantity : function(){
    	var value = new Number($(this.el).find("#select-quantity").val());
    	if (value > 1){
	    	var item = new ItemModel();
	    	item.setProductId(this.model.getProductId());
	    	item.setQuantity(-1);
	    	item.setPictureId(this.model.getPictureId());
	    	
	    	var items = new ItemsCollection();
	    	items.add(item);
	    	
	    	$(this.el).find("#quantity-minus").button({
	    		disabled : true
	    	});
	    	$(this.el).find("#quantity-plus").button({
	    		disabled : true
	    	});
	    	$(this.el).find("#select-quantity").attr('disabled','disabled');
	    	
	    	items.sync("create",items,{
	    		success : this.removeFromCartOk,
	    		error : this.addToCartError
	    	});
    	}
    },
    setQuantity : function(){
    	var value = new Number($(this.el).find("#select-quantity").val());
    	var oldValue = new Number(this.model.getQuantity());
    	if (value > 0){
	    	var item = new ItemModel();
	    	item.setProductId(this.model.getProductId());
	    	item.setQuantity(value-oldValue);
	    	item.setPictureId(this.model.getPictureId());
	    	
	    	var items = new ItemsCollection();
	    	items.add(item);
	    	
	    	$(this.el).find("#quantity-minus").button({
	    		disabled : true
	    	});
	    	$(this.el).find("#quantity-plus").button({
	    		disabled : true
	    	});
	    	
	    	$(this.el).find("#select-quantity").attr('disabled','disabled');
	    	
	    	items.sync("create",items,{
	    		success : this.setToCartOk,
	    		error : this.addToCartError
	    	});
    	}
    },
    setToCartOk : function(pResponse){
    	var value = new Number($(this.el).find("#select-quantity").val());
    	this.model.setQuantity(value);
    	var productPrice = parseFloat(this.product.getPrice());
    	var total = new Number(productPrice*value);
    	this.model.setPrice(total.toFixed(2));
    	
    	// Collecte cart updated informations
    	var infos = new CartUpdatedModel(pResponse);
    	Cart.setShippingFee(infos.getShippingFee());
    	Cart.trigger('change');
    },
    addToCartOk : function(pResponse){
    	var value = Number(this.model.getQuantity());
    	this.model.setQuantity(value+1);
    	var productPrice = parseFloat(this.product.getPrice());
    	var quantity = this.model.getQuantity();
    	var total = new Number(productPrice*quantity);
    	this.model.setPrice(total.toFixed(2));
    	
    	// Collecte cart updated informations
    	var infos = new CartUpdatedModel(pResponse);
    	Cart.setShippingFee(infos.getShippingFee());
    	Cart.trigger('change');
    },
    removeFromCartOk : function(pResponse){
    	var value = Number(this.model.getQuantity());
    	this.model.setQuantity(value-1);
    	var productPrice = parseFloat(this.product.getPrice());
    	var quantity = this.model.getQuantity();
    	var total = new Number(productPrice*quantity);
    	this.model.setPrice(total.toFixed(2));
    	
    	// Collecte cart updated informations
    	var infos = new CartUpdatedModel(pResponse);
    	Cart.setShippingFee(infos.getShippingFee());
    	Cart.trigger('change');
    },
    deleteFromCart : function(){
    	this.model.destroy({
    		success : this.deleteFromCartOk,
    		error : this.addToCartError
    	});
    },
    deleteFromCartOk : function (pModel,pResponse){
      // Collecte cart updated informations
      var infos = new CartUpdatedModel(pResponse);
      Cart.setShippingFee(infos.getShippingFee());
      Cart.trigger('change');
      
    	this.remove();
    	this.close();
    },
    addToCartError : function(){
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
    },
    onRightClick : function(event){
    	DomTools.onRightClick(event,"#wrapper","#cart-right-click-menu");
    },
    hideRightMenu : function(event){
    	DomTools.hideRightMenu(event,"#wrapper","#cart-right-click-menu");
    }
  });

  return CartItemView;

});
