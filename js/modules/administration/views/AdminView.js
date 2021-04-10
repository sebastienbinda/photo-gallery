/*
 * 
 * VERSION 2.2 : 16/04/2015 : Configuration des connexions avec ou sans mot de passe.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!administration/nls/Messages', 'common/collections/UsersCollection','administration/collections/OrderStatesCollection',
         'administration/collections/AdminProductsCollection', 'administration/collections/OrdersCollection', 'administration/views/UsersView',
         'administration/collections/ShippingTypesCollection','administration/views/ProductsView', 'administration/views/OrdersView',
         'administration/views/ServiceConfigurationView', 'text!administration/templates/Admin.html' ], 
 function($, _, backbone, handlebars, logger, bus, messages, UsersCollection, OrderStatesCollection,
		 AdminProductsCollection, OrdersCollection, UsersView, ShippingTypesCollection, ProductsView, 
		 OrdersView, ServiceConfigurationView, form) {

  var AdminView = backbone.View.extend({
    id : 'app-admin-view',
    template : handlebars.compile(form),
    context : messages,
    initialize : function(options) {
    	_.bindAll(this,'disconnect','close','onClose','scrollEvent','openServiceConfiguration','closeServiceConfDialog');
      this.target = options.target;
      
      $("#wrapper").scroll(this.scrollEvent);
    },
    events : {
    	'click #admin-disconnect' : 'disconnect',
    	'click #open-service-configuration' : 'openServiceConfiguration'
    },
    scrollEvent : function(pEvent){
    	if($("#wrapper").scrollTop() > 50) {
    	       $(this.el).find("#back-to-top").addClass("active");
    	} else {
    		$(this.el).find("#back-to-top").removeClass("active");
    	}
    },
    render : function(){
    	$(this.el).html(this.template(this.context));
    	$(this.target).html(this.el);
    	
    	$(this.el).find("input[type=button]").button();
    	
    	// Get all users
    	this.uersCollection = new UsersCollection();
    	
    	// Get all products
    	this.productsCollection = new AdminProductsCollection();
    	
    	// Get all orders
    	this.ordersCollection = new OrdersCollection();
    	
    	// Get all orders state
        this.orderStates = new OrderStatesCollection();
        
        // Get all shipping types
        this.shippingTypes = new ShippingTypesCollection();
    	
    	this.usersView = new UsersView({
    		target : '#user-management',
    		collection : this.uersCollection,
    		products : this.productsCollection,
    	});
    	this.uersCollection.fetch();
    	
    	this.productsView = new ProductsView({
    		target : '#product-management',
    		collection : this.productsCollection,
    		shippingTypes : this.shippingTypes
    	});
        //this.productsCollection.fetch();
        
        this.ordersView = new OrdersView({
        	target : '#order-management',
        	collection : this.ordersCollection,
        	statesCollection : this.orderStates 
        });
        // this.ordersCollection.fetch();
        // this.orderStates.fetch();
    },
    disconnect : function(){
    	this.close();
    	bus.trigger(bus.events.disconnect);
    },
    openServiceConfiguration : function(){
    	this.serviceConfView = new ServiceConfigurationView({
    		target : '#app-modal'
    	});
    	this.serviceConfView.render();
    	$("#app-modal").dialog({
    		title : this.context.serviceConfigurationDialog,
    		height : "auto",
    		width : "auto",
    		modal : true
    	});
    	
    	this.listenTo(this.serviceConfView,'CloseView',this.closeServiceConfDialog);
    },
    closeServiceConfDialog : function(){
    	$("#app-modal").dialog('close');
    },
    onClose : function(){
    	this.model = null;
    	this.downloadLinkModel = null;
    }
  });

  return AdminView;

});
