/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!administration/nls/Messages', 'text!administration/templates/Order.html',
         'administration/views/OrderEditView','tablesorter' ], 
 function($, _, backbone, handlebars, logger, bus, messages, form, OrderEditView) {

  var OrderView = backbone.View.extend({
    id : 'app-admin-order-view',
    tagName : 'tr',
    template : handlebars.compile(form),
    context : messages.ordermanagement,
    initialize : function(options) {
      _.bindAll(this,'render','editOrder','deleteOrder','orderDeleted','confirmDelete','closeDialog');
      this.target = options.target;
      this.model = options.model;
      this.statesCollection = options.states;
      this.collection = this.model.collection;
    },
    render : function(){
    	
    	// state label to orders
    	var state = _.find(this.statesCollection.models, function(pState){
    		return (pState.getId() == this.model.getStatus());
    	},this);
    	
    	var context = {
    			labels : this.context,
    			order : this.model.toJSON(),
    			orderstate_label : state.getState()
    	};
    	$(this.el).html(this.template(context));
    	$(this.target).append(this.el);
    	
    	$(this.el).find(".order-actions").buttonset();
    	$(this.el).find("button").button();
    	
    	if (this.model.getStatus() == 0){
    		$(this.el).find('td').addClass('order_to_deliver');
    	}
    },
    events : {
    	"click #order-edit" : 'editOrder',
    	"click #order-delete" : 'confirmDelete',
    },
    editOrder : function(){
    	logger.info("Editing order id="+this.model.getId());
    	this.orderEditView = new OrderEditView({
    		target : '#app-modal',
    		model : this.model,
    		states : this.statesCollection
    	});
    	this.orderEditView.render();
    	$("#app-modal").dialog({
    		title : this.context.editOrderDialogTitle,
    		width : "400px",
    		height : "auto",
    		modal : true
    	});
    	
    	this.listenTo(this.orderEditView,'CloseView',this.closeDialog);
    },
    deleteOrder : function(){
    	logger.info("Deleting order id="+this.model.getId());
    	this.model.id = this.model.getId();
    	this.model.destroy({
    		success : this.orderDeleted
    	});
    	
    	$("#app-confirm").dialog('close');
    },
    orderDeleted : function(pModel){
    	this.collection.fetch({
    		reset : true
    	});
    },
    confirmDelete : function(){
    	$("#app-confirm").html("<p>"+this.context.confirmDeleteOrderMessage+"</p>");
    	
    	var dialog_buttons = {}; 
    	dialog_buttons[this.context.confirmDeleteOrderButton] = this.deleteOrder;
    	dialog_buttons[this.context.cancelDeleteOrderButton] = function() {
	          $( this ).dialog( "close" );
        }
    	
    	$("#app-confirm").dialog({
    		title : this.context.confirmDeleteOrderTitle,
    		buttons : dialog_buttons
    	});
    },
    closeDialog : function() {
    	$("#app-modal").dialog('close');
    },
    
  });

  return OrderView;

});

