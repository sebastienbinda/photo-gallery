/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!administration/nls/Messages', 'administration/views/OrderView',
         'administration/collections/OrderStatesCollection','text!administration/templates/Orders.html', 'async','tablesorter' ], 
 function($, _, backbone, handlebars, logger, bus, messages, OrderView, OrderStatesCollection, form,Async) {

  var OrdersView = backbone.View.extend({
    id : 'app-admin-orders-view',
    template : handlebars.compile(form),
    context : messages.ordermanagement,
    initialize : function(options) {
    	_.bindAll(this,'render','beforeRender');
      this.target = options.target;
      this.collection = options.collection;
      this.statesCollection = options.statesCollection;
      
      this.listenTo(this.collection,'reset',this.render);
      var map = new Array();
      map.push(this.collection);
      map.push(this.statesCollection);
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
    		
    		var orderView = new OrderView({
    			target : '#ordersTable > tbody',
    			model : pModel,
    			states : this.statesCollection
    		});
    		
    		orderView.render();
    	},this);

    	$(this.el).find("#ordersTable").tablesorter();
    	$(this.el).find("button").button();
    	
    	this.delegateEvents();
    }
  });

  return OrdersView;

});

