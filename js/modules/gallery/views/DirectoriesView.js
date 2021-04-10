/*
 * 
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
 * VERSION 2.1 : 11/04/2015 : Création
 * 
 * @author: S.Binda
 * 
 */
 
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger','bus',
         'i18n!gallery/nls/Messages', 'authentication','gallery/views/DirectoryView','text!gallery/templates/Directories.html' ], function($, _,
    backbone, handlebars, logger, bus, messages, Authentication, DirectoryView, form) {

  var DirectoriesView = backbone.View.extend({
    id : 'directories-view',
    template : handlebars.compile(form),
    context : messages.directories,
    initialize : function(options){
    	_.bindAll(this,'render','sectionReset','sectionSearch','sectionSelectSearch','backSection');
    	this.target = options.target;
    	this.collection = options.collection;
    	this.picturesCollection = options.picturesCollection;
    	this.autoLoadPictures = options.autoLoadPictures;
    	this.listenTo(this.collection,'sync',this.render);
    	
    },
    events : {
    	'click #section-reset' : 'sectionReset',
    	'click #section-search' : 'sectionSearch',
    	'click #section-select-search' : 'sectionSelectSearch',
    	'click #backSectionButton' : 'backSection'
    },
    render : function(){
    	logger.info("Affichage des répertoires de la gallerie");
    	var context = {
    			labels : this.context,
    			description : Authentication.getUser().getSectionInfoDescription()
    	};
    	
    	if (Authentication.getUser().getSectionDisplayMode() == 0){
    		context['folders'] = true;
    	}
    	
    	if (Authentication.getUser().getSectionDisplayMode() == 1){
    		context['search'] = true;
    	}
    	
    	if (Authentication.getUser().getSectionDisplayMode() == 2){
    		context['selectsearch'] = true;
    	}
    	
    	if (this.collection.length > 0 || this.collection.getSection() != ""){
    		context['directories'] = true;
    	}
    	
    	if (this.collection.getSection() != ""){
    		context['backButton'] = true;
    	}
    	
    	$(this.el).html(this.template(context));
    	$(this.target).html(this.el);
    	
    	// Rebind events
    	this.delegateEvents();
    	
    	$(this.el).find("input[type='button']").button();
    	
    	_.each(this.collection.models,function(pModel, pIndex, pCollection){
    		
    		logger.info("Displaying directory " + pModel.getName());
    		
    		var directoryView = new DirectoryView({
    			target : '#dir-list',
    			model : pModel,
    			picturesCollection : this.picturesCollection,
    			directoriesCollection : this.collection,
    			autoLoadPictures : this.autoLoadPictures
    		});
    		directoryView.render();
    		
    		$(this.el).find('#directories-list').append('<option value="'+pModel.getName()+'">'+pModel.getName()+'</option>')
    		
    	}, this);
    	
    	
    },
    backSection : function(){
    	var section = this.picturesCollection.getSection();
    	if (section != null){
    		var index = section.lastIndexOf("/");
    		section = section.substr(0,index);
    		this.picturesCollection.setSection(section);
    		this.picturesCollection.fetch();
    		this.collection.setSection(section);
    		this.collection.fetch();
    	}
    },
    sectionReset : function(){
    	this.picturesCollection.setCurentPage(1);
    	this.picturesCollection.setSection(null);
    	this.picturesCollection.fetch();
    	this.collection.setSection("");
		this.collection.fetch();
    },
    sectionSearch : function(){
    	var section = $(this.el).find('#search-value').val();
    	this.picturesCollection.setCurentPage(1);
    	this.picturesCollection.setSection(section);
    	this.picturesCollection.fetch();
    	this.collection.setSection(section);
		this.collection.fetch();
    },
    sectionSelectSearch : function(){
    	var section = $(this.el).find('#directories-list').val();
    	if (section != null){
    		this.picturesCollection.setCurentPage(1);
        	this.picturesCollection.setSection(this.collection.getSection()+"/"+section);
        	this.picturesCollection.fetch();
        	this.collection.setSection(this.collection.getSection()+"/"+section);
    		this.collection.fetch();
    	}
    }
  });

  return DirectoriesView;

});
