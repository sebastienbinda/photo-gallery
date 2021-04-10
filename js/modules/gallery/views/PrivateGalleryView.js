/*
 *
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
 * VERSION 2.2 : 04/05/2015 : Gestion de l'historique de navigation.
 * VERSION 2.1 : 11/04/2015 : Ajout des sections de photos.
 * VERSION 1.1 : 07/08/2014 : Ajout de la description longue condifurable pour chaque utilisateur.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus','async',
         'i18n!gallery/nls/Messages', 'gallery/models/DownloadLinkModel', 'common/collections/ProductsCollection',
         'gallery/collections/PicturesCollection','gallery/collections/DirectoriesCollection','gallery/views/ProductsView','gallery/views/PicturesView',
         'gallery/views/DirectoriesView','gallery/views/SearchView','commande/views/CartSummaryView','text!gallery/templates/PrivateGallery.html' ],
  function($, _, backbone, handlebars, logger, bus, async, messages, DownloadLinkModel, ProductsCollection, PicturesCollection, DirectoriesCollection,
		  ProductsView, PicturesView, DirectoriesView, SearchView, CartSummaryView, form) {

  var PrivateGallery = backbone.View.extend({
    id : 'app-main-layout',
    template : handlebars.compile(form),
    context : messages,
    initialize : function(options){
    	
    	_.bindAll(this,'render','updateDownloadlink','confirmDisconnect','disconnect','disconnectWithtDialog','close');
    	
    	this.model = options.model;
    	
    	this.target = options.target;

    	// Get the download link from server
    	this.downloadLinkModel = new DownloadLinkModel();
    	this.listenTo(this.downloadLinkModel,'change',this.updateDownloadlink);
    	this.downloadLinkModel.fetch();
    	
    	// Get Products
    	this.productsCollection = new ProductsCollection();
    	this.productsView = new ProductsView({
    		target : '#gallery-products',
    		collection : this.productsCollection
    	});
    	
    	// Get pictures
    	this.picturesCollection = new PicturesCollection();
    	this.picturesView = new PicturesView({
    		target : '#gallery-pictures',
    		collection : this.picturesCollection,
    		products : this.productsCollection
    	});
    	
    	var test = this.model.getDisplaySearchView() == 0 ? true : false;
    	
    	this.directoriesCollection = new DirectoriesCollection();
    	this.directoriesView = new DirectoriesView({
    		target : '#gallery-directories',
    		collection : this.directoriesCollection,
    		picturesCollection : this.picturesCollection,
    		autoLoadPictures : test
    	});
    	
    	this.searchView = new SearchView({
    	  target : '#gallery-search',
    	  picturesCollection : this.picturesCollection,
    	  searchInfosText : this.model.getSearchInfosDescription(),
    	  searchPlaceHolder : this.model.getSearchPlaceHolder(),
    	});
    	
    	logger.info("init_ok");
    },
    events : {
    	"click #private-disconnect" : 'confirmDisconnect'
    },
    render : function(){
    
    	bus.trigger(bus.events.loading);
      
      // Mange navigator history
      backbone.history.navigate("gallery/"+this.model.getLogin(),{trigger:false});
    	
    	var templateContext = {
    			'labels' : this.context,
    			'userDescription' : this.model.getDescription(),
    			'userLongDescription' : this.model.getLongDescription()
    	};
    	
    	$(this.el).html(this.template(templateContext));
    	$(this.target).html(this.el);
    	
    	$(this.el).find('.downloadAllButton').hide();
    	
    	$(this.el).find('input[type=button]').button();
    	$(this.el).find('#private-downloadButton').button({
    		disabled : true
    	});
    	
    	var collections = [this.productsCollection,this.directoriesCollection];
    	
    	if (this.model.getDisplaySearchView() == 0){
    		collections.push(this.picturesCollection);
    	}
    	
    	async.map(collections, function (collection, callback){
    		collection.fetch({
    			error : function(){
        			logger.error("Error while loading collection");
        			callback();
        		},
        		success : function(){
        			logger.info("Collection loading ok");
        			callback();
        		}
    		});
    	}, function(){
    		logger.info("Collections loaded");
    		bus.trigger(bus.events.stoploading);
    	});
    	
    	this.cartSummaryView = new CartSummaryView({
    		target : '#summary-cart',
    		products : this.productsCollection
    	});
    	
    	if (this.model.getDisplaySearchView() == 1){
    		this.searchView.render();
    	}
    	
    	this.delegateEvents();
    	
    	$("#wrapper").scrollTop(0);
    	
    },
    refresh : function(){
    	
    	bus.trigger(bus.events.loading);
    	
      var templateContext = {
          'labels' : this.context,
          'userDescription' : this.model.getDescription(),
          'userLongDescription' : this.model.getLongDescription()
      };
      
      $(this.el).html(this.template(templateContext));
      $(this.target).html(this.el);
      
      $(this.el).find('.downloadAllButton').hide();
      
      $(this.el).find('input[type=button]').button();
      $(this.el).find('#private-downloadButton').button({
        disabled : true
      });
      
      this.productsView.render();
      
      this.picturesView.render();
      
      this.directoriesView.render();
      
      this.cartSummaryView.render();
      
      this.delegateEvents();
      
      $("#wrapper").scrollTop(0);
    },
    updateDownloadlink : function(){
    	if (this.downloadLinkModel && this.downloadLinkModel.getLink()){
    		$(this.el).find('#private-downloadButton').attr('href',this.downloadLinkModel.getLink());
    		$(this.el).find('#private-downloadButton').button({
        		disabled : false
        	});
    		$(this.el).find('.downloadAllButton').show();
    	}
    },
    confirmDisconnect : function(){
      
      if (this.cartSummaryView.nbPictures > 0){
        $("#app-confirm").html("<p>"+ this.context.confirmLeaveGalleryMsg +"</p>");
        
        var dialog_buttons = {}; 
        dialog_buttons[this.context.confirmLeaveGalleryButton] = this.disconnectWithtDialog;
        dialog_buttons[this.context.cancelLeaveGalleryButton] = function() {
              $( this ).dialog( "close" );
          }
        
        $("#app-confirm").dialog({
          title : this.context.confirmLeaveGalleryTitle,
          buttons : dialog_buttons,
          modal : true,
        });
      } else {
        this.disconnect();
      }
    },
    disconnectWithtDialog : function() {
      $("#app-confirm").dialog('close');
      this.disconnect();
    },
    disconnect : function(){
    	this.close();
    	bus.trigger(bus.events.stoploading);
    	bus.trigger(bus.events.disconnect);
    },
    onClose : function(){
    	this.model = null;
    	this.downloadLinkModel = null;
    	this.cartSummaryView.close();
    	this.picturesView.close();
    	this.searchView.close();
    	this.productsView.close();
    	this.directoriesView.close();
    	
    }
  });

  return PrivateGallery;

});
