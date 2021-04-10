/*
 * 
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
 * 
 * @author: S.Binda
 * 
 */
 
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger','bus',
         'i18n!gallery/nls/Messages','text!gallery/templates/GallerySearch.html' ], function($, _,
    backbone, handlebars, logger, bus, messages, form) {

  var SearchView = backbone.View.extend({
    id : 'search-view',
    template : handlebars.compile(form),
    context : messages.search,
    initialize : function(options){
      _.bindAll(this,'render','refresh','search','onKeyPress');
      this.target = options.target;
      this.picturesCollection = options.picturesCollection;
      this.searchInfosText = options.searchInfosText;
      this.searchPlaceHolder = options.searchPlaceHolder;
      this.listenTo(this.picturesCollection,'sync',this.refresh);
      this.newSearch = false;
    },
    events : {
      'click #meta-search-button' : 'search'
    },
    render : function(){
      logger.info("Affichage de la section de recherche");
      
      var context = {
    		  searchInfos : this.searchInfosText
      };
      
      $(this.el).html(this.template(context));
      $(this.target).append(this.el);
      
      $(this.el).find("button").button();
      
      if (this.searchPlaceHolder){
    	  $(this.el).find("#meta-search-value").attr("placeholder", this.searchPlaceHolder);
      }
      
      $(this.el).find("#meta-search-value").on('keydown',this.onKeyPress);
    },
    refresh : function(){
    	if (this.picturesCollection.getMeta() == null){
    		$(this.el).show();
    	} else if (this.picturesCollection == null || this.picturesCollection.length ==0 ){
			$("#app-confirm").html("<p>"+this.context.noresultsMessage+"</p>");
			
			var dialog_buttons = {}; 
			dialog_buttons[this.context.okbutton] = function() {
		          $( this ).dialog( "close" );
		    }
			
			$("#app-confirm").dialog({
				title : this.context.noresultsTitle,
				modal : true,
				buttons : dialog_buttons
			});
			
		} else if (this.picturesCollection.getTagResult() == 0 && this.newSearch == true){
			$("#app-confirm").html("<p>"+this.context.defaultResultsMessage+"</p>");
			
			var dialog_buttons = {}; 
			dialog_buttons[this.context.okbutton] = function() {
		          $( this ).dialog( "close" );
		    }
			
			$("#app-confirm").dialog({
				title : this.context.defaultResultsTitle,
				modal : true,
				buttons : dialog_buttons
			});
		}
    	this.newSearch = false;
    	$(this.el).find('#meta-search-value').val(this.picturesCollection.getMeta());
    },
    search : function(){
      var meta = $(this.el).find('#meta-search-value').val();
      if (meta && meta != ""){
	      this.picturesCollection.setCurentPage(1);
	      this.picturesCollection.setMeta(meta);
	      this.newSearch = true;
	      this.picturesCollection.fetch();
      }
    },
    onKeyPress : function(e) {
        if (e.keyCode == 13) {
        	this.search();
        }
    }
  });

  return SearchView;

});
