/*
 * 
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
 * VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
 * VERSION 2.2 : 15/04/2015 : Ajout d'un parametre d'affichage ou non du nom des photos.
 * VERSION 2.1 : 11/04/2015 : Ajout des sections de photos.
 * VERSION 1.1 : 07/08/2014 : Ajout de la description longue condifurable pour chaque utilisateur.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!administration/nls/Messages', 'widgets/confirm/views/ConfirmView','common/models/UserModel',
         'common/collections/ProductsCollection','text!administration/templates/UserEdit.html','jqueryUiMultiSelect','tablesorter' ], 
 function($, _, backbone, handlebars, logger, bus, messages, ConfirmView, UserModel, ProductsCollection, form) {

  var UserEditView = backbone.View.extend({
    id : 'app-admin-edit-view',
    template : handlebars.compile(form),
    context : messages.usermanagement,
    initialize : function(options) {
      _.bindAll(this,'validateSave','save','saveSuccess','addSuccess','editError','resetLongDescription','close','onClose');
      this.target = options.target;
      this.model = options.model ? options.model : new UserModel();
      this.productsCollection = options.products;
    },
    events : {
    	"click #reset-long-description" : "resetLongDescription",
    	"click #save-user" : "validateSave",
    	"click #cancel-user" : "close",
    },
    render : function(){
    	
    	this.productsList = this.productsCollection.toJSON();
    	
    	// Select user products
    	if (this.model.getProducts()){
    		_.each(this.model.getProducts(),function(pProduct, pIndex, pList){
    			logger.info("produit selectionne " + pProduct.id);
    			obj = _.find(this.productsList, function(obj) { return obj.id == pProduct.id });
    			if (obj){
    				obj['selected'] = true;
    			}
    		},this);
    	}
    	
    	
    	var context = {
    			labels : this.context,
    			user : this.model.toJSON(),
    			products : this.productsList
    	};
    	$(this.el).html(this.template(context));
    	$(this.target).html(this.el);
    	
    	if (this.model.getLogin() != null && this.model.getLogin() != "" ){
    		$(this.el).find("#login").attr("disabled","disabled");
    	} else {
    		$(this.el).find("#long_description").val(this.context.galeryInfos)
    	}
    	
    	if (this.model.getLogin() == "admin"){
    		$(this.el).find("table tr").hide();
    		$(this.el).find("#user-login").show();
    		$(this.el).find("#user-password").show();
    		
    	}
    	
    	$(this.el).find("#public option[value="+this.model.isPublic()+"]").attr('selected','selected');
    	
    	$(this.el).find("#allowdownload option[value="+this.model.isAllowDownload()+"]").attr('selected','selected');
    	
    	$(this.el).find("#displayPictureNames option[value="+this.model.getDisplayPictureNames()+"]").attr('selected','selected');
    	
    	$(this.el).find("#sectionDisplayMode option[value="+this.model.getSectionDisplayMode()+"]").attr('selected','selected');
    	
    	$(this.el).find("#displaySearchView option[value="+this.model.getDisplaySearchView()+"]").attr('selected','selected');
    	
    	$(this.el).find("button").button();
    	
    	$(this.el).find("#user_products").multiselect({
    		noneSelectedText : this.context.selectProducts
    	});
    },
    validateSave : function(){
    	
    	var login = $(this.el).find("#login").val();
    	var password = $(this.el).find("#password").val();
    	var description = $(this.el).find("#description").val();
    	var err = false;
    	
    	$(this.el).find("input").removeClass("fieldrequired");
    	
    	if (login == ""){
    		$(this.el).find("#login").addClass("fieldrequired");
    		err=true;
    	}
    	
    	if (password == ""){
    		$(this.el).find("#password").addClass("fieldrequired");
    		err=true;
    	}
    	
    	if (description == ""){
    		$(this.el).find("#description").addClass("fieldrequired");
    		err=true;
    	}
    	
    	if (!err){
    		this.save();
    	}
    	
    },
    save : function(){
    	$(this.el).find('#user-edit').addClass("loading-filter");
    	$(this.el).find('#loading').show();
    	$(this.el).find("button").button({
    		disabled : true
    	});
    	// If model login is defined so we update a existing user
    	if (this.model.getLogin()){
    		logger.info("update user " + this.model.getLogin());
	    	var userModel = new UserModel();
	    	userModel.setLogin($(this.el).find("#login").val());
	    	userModel.setPublic($(this.el).find("#public").val());
	    	userModel.setPassword($(this.el).find("#password").val());
	    	userModel.setDescription($(this.el).find("#description").val());
	    	userModel.setLongDescription($(this.el).find("#long_description").val());
	    	userModel.setAllowDownload($(this.el).find("#allowdownload").val());
	    	userModel.setNbPicturesByPage($(this.el).find("#nbPicturesByPage").val());
	    	userModel.setNbProductsMin($(this.el).find("#nbProductsMin").val());
	    	userModel.setSectionDisplayMode($(this.el).find("#sectionDisplayMode").val());
	    	userModel.setSectionInfoDescription($(this.el).find("#sectionInfoDescription").val());
	    	userModel.setDisplayPictureNames($(this.el).find("#displayPictureNames").val());
	    	userModel.setFreeDownloadDir($(this.el).find("#freeDownloadDir").val());
	    	userModel.setDisplaySearchView($(this.el).find("#displaySearchView").val());
	    	userModel.setSearchInfosDescription($(this.el).find("#searchInfosDescription").val());
	    	userModel.setSearchPlaceHolder($(this.el).find("#searchPlaceHolder").val());
	    	userModel.setDefaultSearchTags($(this.el).find("#defaultSearchTags").val());
	    	
	    	this.userproducts = new ProductsCollection();
	    	_.each($(this.el).find("#user_products").multiselect("getChecked"),function(pOption,pIndex,pList){
	    		product = _.find(this.productsList, function(obj) { return obj.id == $(pOption).val() });
	    		this.userproducts.add(product);
	    	},this);
	    	userModel.setProducts(this.userproducts.toJSON());
	    	userModel.save(null,{
	    		success : this.saveSuccess,
	    		error : this.editError
	    	});
    	} else {
    		logger.info("creating new user " + $(this.el).find("#login").val());
    		var userModel = new UserModel();
	    	userModel.setLogin($(this.el).find("#login").val());
	    	userModel.setPublic($(this.el).find("#public").val());
	    	userModel.setPassword($(this.el).find("#password").val());
	    	userModel.setDescription($(this.el).find("#description").val());
	    	userModel.setLongDescription($(this.el).find("#long_description").val());
	    	userModel.setAllowDownload($(this.el).find("#allowdownload").val());
	    	userModel.setNbPicturesByPage($(this.el).find("#nbPicturesByPage").val());
	    	userModel.setNbProductsMin($(this.el).find("#nbProductsMin").val());
	    	userModel.setSectionDisplayMode($(this.el).find("#sectionDisplayMode").val());
	    	userModel.setSectionInfoDescription($(this.el).find("#sectionInfoDescription").val());
	    	userModel.setDisplayPictureNames($(this.el).find("#displayPictureNames").val());
	    	userModel.setFreeDownloadDir($(this.el).find("#freeDownloadDir").val());
	    	userModel.setDisplaySearchView($(this.el).find("#displaySearchView").val());
	    	userModel.setSearchInfosDescription($(this.el).find("#searchInfosDescription").val());
	    	userModel.setSearchPlaceHolder($(this.el).find("#searchPlaceHolder").val());
	    	userModel.setDefaultSearchTags($(this.el).find("#defaultSearchTags").val());
	    	
	    	this.userproducts = new ProductsCollection();
	    	_.each($(this.el).find("#user_products").multiselect("getChecked"),function(pOption,pIndex,pList){
	    		product = _.find(this.productsList, function(obj) { return obj.id == $(pOption).val() });
	    		this.userproducts.add(product);
	    	},this);
	    	userModel.setProducts(this.userproducts.toJSON());
	    	
	    	userModel.save(null,{
	    		success : this.addSuccess,
	    		error : this.editError
	    	});
    	}
    	
    },
    addSuccess : function (){
    	$(this.el).find('#user-edit').removeClass("loading-filter");
    	$(this.el).find('#loading').hide();
    	$(this.el).find("button").button({
    		disabled : false
    	});
    	logger.info("User added !")
    	this.trigger('addUser');
    	this.close();
    },
    saveSuccess : function(){
    	$(this.el).find('#user-edit').removeClass("loading-filter");
    	$(this.el).find('#loading').hide();
    	$(this.el).find("button").button({
    		disabled : false
    	});
    	logger.info("User saved!")
    	this.model.fetch({
    		reset : true,
    		success : function (pModel,repsonse,huhu){
    			logger.info("fetch ok");
    		}
    	});
    	this.close();
    },
    editError : function(){
    	// Log Error
    	logger.error("User save error");
    	
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
    	
    	$(this.el).find('#user-edit').removeClass("loading-filter");
    	$(this.el).find('#loading').hide();
    	$(this.el).find("button").button({
    		disabled : false
    	});
    },
    resetLongDescription : function(){
    	$(this.el).find("#long_description").val(this.context.galeryInfos);
    },
    onClose : function(){
    	this.remove();
    }
  });

  return UserEditView;

});

