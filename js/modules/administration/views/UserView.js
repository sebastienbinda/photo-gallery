/*
 * 
 * VERSION 2.3 : 25/06/2015 : Ajout de l'indexation des photos.
 * VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
 * VERSION 1.1 : 07/08/2014 : Ajout de la description longue condifurable pour chaque utilisateur.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!administration/nls/Messages', 'widgets/confirm/views/ConfirmView', 'administration/views/UserEditView',
         'text!administration/templates/User.html','administration/models/IndexPictures','tablesorter' ], 
 function($, _, backbone, handlebars, logger, bus, messages, ConfirmView, UserEditView, form, IndexPictures) {

  var UserView = backbone.View.extend({
    id : 'app-admin-user-view',
    tagName : 'tr',
    template : handlebars.compile(form),
    context : messages.usermanagement,
    initialize : function(options) {
      _.bindAll(this,'editUser','deleteUser','userDeleted','closeDialog','confirmDelete','errorUserDelete');
      this.target = options.target;
      this.model = options.model;
      this.productsCollection = options.products;
    },
    events : {
    	"click #user-edit" : 'editUser',
    	"click #user-delete" : 'confirmDelete',
    	"click #user-index" : 'indexUser',
    },
    indexUser : function(){
    	logger.info("Indexing user login="+this.model.getLogin());
    	var index = new IndexPictures();
    	index.setLogin(this.model.getLogin());
    	index.fetch();
    },
    editUser: function(){
    	logger.info("Editing user login="+this.model.getLogin());
    	this.userEditView = new UserEditView({
    		target : '#app-modal',
    		model : this.model,
    		products : this.productsCollection,
    	});
    	this.userEditView.render();
    	$("#app-modal").dialog({
    		title : this.context.editUserDialogTitle,
    		height : "auto",
    		width : "auto",
    		modal : true
    	});
    	
    	this.listenTo(this.userEditView,'CloseView',this.closeDialog);
    },
    deleteUser : function(){
    	logger.info("Deleting user login="+this.model.getLogin());
    	this.model.id = this.model.getLogin();
    	this.model.destroy({
    		success : this.userDeleted,
    		error : this.errorUserDelete
    	});
    	$("#app-confirm").dialog('close');
    	
    },
    userDeleted : function(pModel){
    	pModel.collection.fetch({
    		reset : true
    	});
    },
    errorUserDelete : function(){
    	// Log error
    	logger.error("User delete error");
    	
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
    closeDialog : function() {
    	$("#app-modal").dialog('close');
    },
    confirmDelete : function(){
    	$("#app-confirm").html("<p>"+this.context.confirmDeleteUserMessage+"</p>");
    	
    	var dialog_buttons = {}; 
    	dialog_buttons[this.context.confirmDeleteUserButton] = this.deleteUser;
    	dialog_buttons[this.context.cancelDeleteUserButton] = function() {
	          $( this ).dialog( "close" );
        }
    	
    	$("#app-confirm").dialog({
    		title : this.context.confirmDeleteUserTitle,
    		buttons : dialog_buttons
    	});
    },
    render : function(){
    	
    	var allowdownloadlabel = "";
    	if (this.model.isAllowDownload() == 0){
    		allowdownloadlabel = this.context.falseLabel;
    	} else {
    		allowdownloadlabel = this.context.trueLabel;
    	}
    	
    	var publicLabel = "";
    	if (this.model.isPublic() == 1){
    	  publicLabel = this.context.trueLabel;
    	} else {
    	  publicLabel = this.context.falseLabel;
    	}
    	
    	var context = {
    			allowdownloadlabel : allowdownloadlabel,
    			publicLabel : publicLabel,
    			labels : this.context,
    			user : this.model.toJSON()
    	};
    	
    	if (this.model.getLogin() == "admin"){
    		context['isAdmin'] = true;
    	}
    	
    	$(this.el).html(this.template(context));
    	$(this.target).append(this.el);
    	
    	if (this.model.getLogin() == "admin"){
    		$(this.el).find("#user-delete").remove();
    	}
    	
    	$(this.el).find(".um-actions").buttonset();
    	$(this.el).find("button").button();
    }
  });

  return UserView;

});

