/*
 * 
  *VERSION 2.1 : 11/04/2015 : La list des produits est cachée si aucune description n'est présente.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!gallery/nls/Messages', 'text!gallery/templates/Products.html','tablesorter' ], function($, _,
    backbone, handlebars, logger, bus, messages, form) {

  var ProductsView = backbone.View.extend({
    id : 'pictures-view',
    template : handlebars.compile(form),
    initialize : function(options){
    	_.bindAll(this,'render');
    	this.target = options.target;
    	this.collection = options.collection;
    	this.listenTo(this.collection,'sync',this.render);
    },
    render : function(){
    	
    	var displayProducts = false;
    	_.each(this.collection.models,function(pModel, pIndex, pCollection){
    		if (pModel.getDescription() && pModel.getDescription() != null && pModel.getDescription() != ""){
    			displayProducts = true;
    		}
    	}, this);
    	
    	if (displayProducts == true){
    	
	    	logger.info("Affichage des produits");
	    	
	    	var products = this.collection.toJSON();
	    	var context = {
	    		labels : messages.products,
	    		products : 	products
	    	};
	    	$(this.el).html(this.template(context));
	    	$(this.target).html(this.el);
	    	
	    	$(this.el).find(".tablesorter").tablesorter();
    	} else {
    		logger.info("Liste des produits cachée");
    	}
    }
  });

  return ProductsView;

});
