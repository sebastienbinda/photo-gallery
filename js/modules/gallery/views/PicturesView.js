/*
 * 
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
 * VERSION 2.2 : 16/04/2015 : Ajout du boutton d'ajout au panier dans la vue fullsize
 * VERSION 2.1 : 11/04/2015 :  Gestion des sections
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger','bus',
         'i18n!gallery/nls/Messages', 'gallery/views/PictureView','text!gallery/templates/Pictures.html' ], function($, _,
    backbone, handlebars, logger, bus, messages, PictureView, form) {

  var PicturesView = backbone.View.extend({
    id : 'pictures-view',
    template : handlebars.compile(form),
    context : messages.pictures,
    initialize : function(options){
    	_.bindAll(this,'render','goToFirstPage','goToNextPage','goToPreviousPage','goToLastPage','goToImage','scrollEvent','loadingPage','stopLoadingPage');
    	this.target = options.target;
    	this.collection = options.collection;
    	this.products = options.products;
    	this.listenTo(this.collection,'sync',this.render);
    	this.listenTo(this.collection,'request',this.loadingPage);
    	this.nbpages = 0;
    	
    	this.previousPage = null;
    	
    	$("#wrapper").scroll(this.scrollEvent);
    },
    events : {
    	"click .pager-first-page" : 'goToFirstPage',
    	"click .pager-next-page" : 'goToNextPage',
    	"click .pager-previous-page" : 'goToPreviousPage',
    	"click .pager-last-page" : 'goToLastPage',
    	"click #displayCartButton" : 'displayCart'
    },
    scrollEvent : function(pEvent){
    	if($("#wrapper").scrollTop() > $("#wrapper").height()) {
    	       $(this.el).find("#back-to-top").addClass("active");
    	} else {
    		$(this.el).find("#back-to-top").removeClass("active");
    	}
    },
    goToFirstPage : function(){
    	logger.info("Going do first page");
    	
    	this.collection.setCurentPage(1);
    	this.collection.fetch();
    },
    goToNextPage : function(){
    	logger.info("Going do next page : " + this.collection.getCurentPage());
    	
    	this.collection.setCurentPage(this.collection.getCurentPage()+1);
    	this.collection.fetch();
    },
    goToPreviousPage : function(){
    	logger.info("Going do previous page : " + this.collection.getCurentPage());
    	
    	this.collection.setCurentPage(this.collection.getCurentPage()-1);
    	this.collection.fetch();
    },
    goToLastPage : function(){
    	logger.info("Going do last page : " + this.collection.getNbPages());
    	
    	this.collection.setCurentPage(this.collection.getNbPages());
    	this.collection.fetch();
    },
    loadingPage : function(){
    	bus.trigger(bus.events.loading,this.context.loading_msg);
    },
    stopLoadingPage : function(){
    	bus.trigger(bus.events.stoploading);
    },
    render : function(){
    	logger.info("Affichage des photos avec " + this.collection.getNbPages() + " page(s)");
    	var context = {
    			labels : this.context
    	};
    	if (this.collection.length > 0){
    		context['pictures'] = true;
    	}
    	
    	if (this.collection.getNbPages() > 1){
    		context['pager'] = {
    				page_first_index : this.collection.getFirstIndex(),
    				page_last_index : this.collection.getFirstIndex() + this.collection.length -1,
    				curentPage : this.collection.getCurentPage(),
    				total_records : this.collection.getNbPictures(),
    				from_to : 'à'
    		};
    	}
    	
    	$(this.el).html(this.template(context));
    	$(this.target).html(this.el);
    	
    	$(this.el).find('#pictures-pager').buttonset();
    	$(this.el).find('button').button();
    	
    	if (this.collection.getCurentPage() <= 1){
    		$(this.el).find(".pager-first-page").button({
    			disabled : true
    		});
    		$(this.el).find(".pager-previous-page").button({
    			disabled : true
    		});
    	}
    	
    	if (this.collection.getCurentPage() == this.collection.getNbPages()){
    		$(this.el).find(".pager-last-page").button({
    			disabled : true
    		});
    		$(this.el).find(".pager-next-page").button({
    			disabled : true
    		});
    	}
    	
    	this.picturesView = Array();
    	
    	_.each(this.collection.models,function(pModel, pIndex, pCollection){
    		
    		logger.info("Displaying picure " + pModel.getName());
    		
    		var pictureView = new PictureView({
    			target : '.img-list',
    			model : pModel,
    			products : this.products,
    			index : pIndex,
    			goTo : this.goToImage,
    			nbTotalPictures : this.collection.getNbPictures()
    		});
    		pictureView.render();
    		this.picturesView.push(pictureView);
    		
    	}, this);
    	
    	// If a dialog for full size image is open, then go to the first or last image of the page.
    	// Go to the first image if the previous page is greater than the curent page.
    	// Else go to the last image.
    	if ($("#picture-modal").find("#fullsize-picture").length){
    		if  ($("#picture-modal").dialog("isOpen")===true){
	    		if (this.previousPage > this.collection.getCurentPage()){
	    			this.goToImage(this.collection.length-1);
	    		} else {
	    			this.goToImage(0);
	    		}
    		}
    	}
    	
    	if (this.collection.length > 0){
    		$("#pictures-list-title").show();
    	} else {
    		$("#pictures-list-title").hide();
    	}
    	
    	this.stopLoadingPage();
    	
    	this.delegateEvents();
    },
    goToImage : function (pIndex){
    	logger.info("Goto image " + pIndex);
    	$("#img-loading").show();
    	var curentPage = this.collection.getCurentPage();
    	var lastPage = this.collection.getNbPages();
    	var indexMax = this.collection.length;
    	logger.info("Max index : " + indexMax);
    	if (pIndex >= indexMax && curentPage < lastPage){
    		logger.info("Changement de page (next)");
    		this.previousPage = curentPage;
    		this.goToNextPage();
    	} else if (pIndex < 0 && curentPage > 1 ){
    		logger.info("Changement de page (previous)");
    		this.previousPage = curentPage;
    		this.goToPreviousPage();
    	} else if (pIndex >= 0 && pIndex < indexMax ){
    		this.picturesView[pIndex].refreshFullSize();
    	} else if (pIndex >= indexMax){
    		// Go to first image of first page
    		// If curent page is already the first page (case when there is only one page), do not change page
    		if (curentPage != 1){
    			this.previousPage = -1;
    			this.goToFirstPage();
    		} else {
    			this.picturesView[0].refreshFullSize();
    		}
    	} else if (pIndex < 0){
    		// Go to first image of first page
    		// If curent page is already the first page (case when there is only one page), do not change page
    		if (lastPage != "1"){
    			this.previousPage = lastPage+1;
    			this.goToLastPage();
    		}else {
    			this.picturesView[indexMax-1].refreshFullSize();
    		}
    	}
    },
    displayCart : function(){
    	bus.trigger(bus.events.displayCart);
    }
  });

  return PicturesView;

});
