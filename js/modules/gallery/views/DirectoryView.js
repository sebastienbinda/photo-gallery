/*
 * 
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
 * VERSION 2.1 : 11/04/2015 : Création
 * 
 * @author: S.Binda
 * 
 */
 
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus','async',
         'i18n!gallery/nls/Messages', 'text!gallery/templates/Directory.html'], function($, _,
    backbone, handlebars, logger, bus, async, messages, form) {

  var PicturesView = backbone.View.extend({
	tagName : 'li',
	className : 'gallery-directory',
    template : handlebars.compile(form),
    context : messages.directories,
    initialize : function(options){
    	_.bindAll(this,'displayPictures')
    	this.target = options.target;
    	this.picturesCollection = options.picturesCollection;
    	this.model = options.model;
    	this.directoriesCollection = options.directoriesCollection;
    	this.autoLoadPictures = options.autoLoadPictures;
    },
    events : {
    	'click .directory-section' : 'displayPictures'
    },
    render : function(){
    	
    	var context = {
    			labels : this.context,
    			directory: this.model.toJSON()
    	};
    	
    	$(this.el).html(this.template(context));
    	$(this.target).append(this.el);
    },
    displayPictures : function(){
    	
    	var section = this.directoriesCollection.getSection() + "/" + this.model.getName();
    	this.directoriesCollection.setSection(section);
    	
    	this.picturesCollection.setCurentPage(1);
    	this.picturesCollection.setSection(section);
    	this.picturesCollection.setMeta(null);
    	
    	var collections = [this.directoriesCollection];
    	
    	if (this.autoLoadPictures){
	    	collections.push(this.picturesCollection);
    	}
    	
    	bus.trigger(bus.events.loading);
    	
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
    }

  });
  return PicturesView;

});
