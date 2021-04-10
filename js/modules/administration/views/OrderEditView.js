/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!administration/nls/Messages', 'widgets/confirm/views/ConfirmView','administration/models/OrderModel',
         'text!administration/templates/OrderEdit.html' ], 
 function($, _, backbone, handlebars, logger, bus, messages, ConfirmView, OrderModel, form) {

  var OrderEditView = backbone.View.extend({
    id : 'app-admin-edit-order-view',
    template : handlebars.compile(form),
    context : messages.ordermanagement,
    initialize : function(options) {
      _.bindAll(this,'validateSave','save','saveSuccess','close','onClose');
      this.target = options.target;
      this.statesCollection = options.states;
      this.model = options.model ? options.model : new OrderModel();
    },
    events : {
    	"click #save-order" : "validateSave",
    	"click #cancel-order" : "close"
    },
    render : function(){
    	    	
    	var context = {
    			labels : this.context,
    			states : this.statesCollection.toJSON(),
    			order : this.model.toJSON()
    	};
    	
    	$(this.el).html(this.template(context));
    	$(this.target).html(this.el);
    	
    	// Select state
    	$(this.el).find("#state").val(this.model.getStatus());
    	
    	$(this.el).find("button").button();
    },
    validateSave : function(){
    	this.save();
    },
    save : function(){
    	$(this.el).find('#order-edit').addClass("loading-filter");
    	$(this.el).find('#loading').show();
    	$(this.el).find("button").button({
    		disabled : true
    	});
  		logger.info("update product " + this.model.getId());
  		this.model.setStatus($(this.el).find("#state").val());
	    	
  		this.model.save(null,{
    		success : this.saveSuccess,
    		error : this.editError
    	});
    	
    },
    saveSuccess : function(){
    	logger.info("Order saved!")
    	$(this.el).find('#order-edit').removeClass("loading-filter");
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
    	// Log error
    	logger.error("Order save error");
    	
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
    	$(this.el).find('#order-edit').removeClass("loading-filter");
    	$(this.el).find('#loading').hide();
    	$(this.el).find("button").button({
    		disabled : false
    	});
    },
    onClose : function(){
    	this.remove();
    }
  });

  return OrderEditView;

});

