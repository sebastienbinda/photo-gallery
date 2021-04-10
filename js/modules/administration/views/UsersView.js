/*
 * 
 * VERSION 1.1 : 07/08/2014 : Ajout de la description longue condifurable pour chaque utilisateur.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!administration/nls/Messages', 'administration/views/UserView',
         'administration/views/UserEditView','text!administration/templates/Users.html', 'tablesorter' ], 
 function($, _, backbone, handlebars, logger, bus, messages, UserView, UserEditView, form) {

  var UsersView = backbone.View.extend({
    id : 'app-admin-users-view',
    template : handlebars.compile(form),
    context : messages.usermanagement,
    initialize : function(options) {
      _.bindAll(this,'addNewUser','closeDialog','refresh');
      this.target = options.target;
      this.collection = options.collection;
      this.productsCollection = options.products;
      this.listenTo(this.collection,'sync',this.render);
      this.listenTo(this.collection,'reset',this.render);
      this.listenTo(this.productsCollection,'sync',this.refresh);
      this.listenTo(this.productsCollection,'reset',this.refresh);
    },
    events : {
    	'click #add-user' : 'addNewUser'
    },
    addNewUser : function() {
    	logger.info("Adding a new user");
    	
    	this.userEditView = new UserEditView({
    		target : '#app-modal',
    		products : this.productsCollection
    	});
    	this.userEditView.render();
    	$("#app-modal").dialog({
    		title : this.context.newUserDialogTitle,
    		height : "auto",
    		width : "auto",
    		modal : true
    	});
    	
    	this.listenTo(this.userEditView,'CloseView',this.closeDialog);
    	this.listenTo(this.userEditView,'addUser',this.refresh);
    	
    },
    closeDialog : function() {
    	$("#app-modal").dialog('close');
    },
    refresh : function(){
    	this.collection.fetch();
    },
    render : function(){
    	logger.info("Affichage des users");
    	var context = {
    			labels : this.context,
    	};
    	$(this.el).html(this.template(context));
    	$(this.target).html(this.el);
    	
    	_.each(this.collection.models, function(pModel, pIndex, pCollection){
    		
    		var userView = new UserView({
    			target : '#usersTable > tbody',
    			model : pModel,
    			products : this.productsCollection
    		});
    		
    		userView.render();
    	},this);

    	$(this.el).find("#usersTable").tablesorter();
    	$(this.el).find("button").button();
    	
    	this.delegateEvents();
    }
  });

  return UsersView;

});

