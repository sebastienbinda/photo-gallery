/*
 * 
 * VERSION 2.2 : 16/04/2015 : Ajout du boutton d'ajout au panier dans la vue fullsize
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus','DomTools','json!conf/app.configuration.json','authentication',
         'i18n!gallery/nls/Messages', 'widgets/confirm/views/ConfirmView','gallery/views/ImageAddToCartPanelView',
         'text!gallery/templates/Picture.html','text!gallery/templates/PictureFullSize.html' ], function($, _,
    backbone, handlebars, logger, bus, DomTools, configuration, Authentication,messages, ConfirmView, ImageAddToCartPanelVeiw, form, PictureFullSizeForm) {

  var PicturesView = backbone.View.extend({
    id : 'picture-view',
    tagName : 'li',
    template : handlebars.compile(form),
    fullSizeTemplate : handlebars.compile(PictureFullSizeForm),
    context : messages.pictures,
    initialize : function(options){
    	_.bindAll(this,'displayAddToCartPanel','onRightClick','hideRightMenu',"displayFullFormat",
    			"displayFullSizeError","displayFullSizeLoaded","onFullSizeRightClick","hideFullSizeRightMenu","nextPage",
    			"previousPage","refreshFullSize","refreshProducts");
    	this.target = options.target;
    	this.model = options.model;
    	this.products = options.products;
    	this.index = options.index;
    	this.goTo = options.goTo;
    	this.nbTotalPictures = options.nbTotalPictures;
    	this.listenTo(this.products,'sync',this.refreshProducts);
    },
    events : {
    	"click .add-to-cart" : 'displayAddToCartPanel',
    	"click #thumb-picture" : "displayFullFormat",
    	contextmenu: 'onRightClick',
    	mousemove : 'hideRightMenu',
    	"click .next-pic-filter" : "nextPicture",
    	"click .prev-pic-filter" : "previousPicture",
    	"click #next-pic" : "nextPicture",
      "click #prev-pic" : "previousPicture",
    	"click .closepicture" : 'closeDialog',
    	"click .closepicture-mobile" : 'closeDialog',
    },
    render : function(){
    	
    	var imageLink="";
		if (configuration.image_link_php == true){
			imageLink="php/requests/user/getImage.php?type=thumb&id="+ this.model.getFullName();
		} else {
			var user = Authentication.getUser().getLogin();
			imageLink="users/"+user+"/thumbmails/"+this.model.getFullName();
		}
    	
    	var context = {
    			labels : this.context,
    			image: this.model.toJSON(),
    			imageLink : imageLink
    	};
    	
    	// Check if we have to display picture names
    	if (Authentication.getUser().getDisplayPictureNames() == 1){
    	  context['displaynames'] = true;
    	}
    	
    	$(this.el).html(this.template(context));
    	$(this.target).append(this.el);
    	
    	$(this.el).find("button").button();
    	
    	// If there is products display add to cart button
    	if (!this.products || this.products.length == 0){
    		$(this.el).find("#pictureAddToCartButton").hide();
    	}
    },
    refreshProducts : function(){
    	// If there is products display add to cart button
    	if (this.products && this.products.length > 0){
    		$(this.el).find("#pictureAddToCartButton").show();
    	}
    },
    refreshFullSize : function(){
    	
    	$("#picture-modal").find("button").button({
    		disabled : true
    	});
    	
    	var imageLink="";
		if (configuration.image_link_php == true){
			imageLink="php/requests/user/getImage.php?full=thumb&id="+ this.model.getFullName();
		} else {
			var user = Authentication.getUser().getLogin();
			imageLink="users/"+user+"/fullsize/"+this.model.getFullName();
		}
    	
    	$("#picture-modal").dialog("option","title","Photographie : "+this.model.getName());
    	$("#picture-modal").find('img').attr("src",imageLink);
    	$("#picture-modal").find('a').attr('href',this.model.getUrlAccess());
    	
    	$("#picture-modal").find(".next-pic-filter").unbind('click');
    	$("#picture-modal").find(".prev-pic-filter").unbind('click');
    	$("#picture-modal").find("#next-pic").unbind('click');
      $("#picture-modal").find("#prev-pic").unbind('click');
    	$("#picture-modal").find('.add-to-cart').unbind('click');
    	$("#picture-modal").find(".closepicture").unbind("click");
    	$("#picture-modal").find(".closepicture-mobile").unbind("click");
    	
    	$("#picture-modal").find(".next-pic-filter").on("click",this.nextPage);
    	$("#picture-modal").find(".prev-pic-filter").on("click",this.previousPage);
    	$("#picture-modal").find("#next-pic").on("click",this.nextPage);
      $("#picture-modal").find("#prev-pic").on("click",this.previousPage);
    	$("#picture-modal").find('.add-to-cart').on('click',this.displayAddToCartPanel);
    	$("#picture-modal").find(".closepicture").on("click",this.closeDialog);
    	$("#picture-modal").find(".closepicture-mobile").on("click",this.closeDialog);
    	
    	$("#picture-modal").find('img').unbind('load');
    	$("#picture-modal").find('img').unbind('error');
    	$("#picture-modal").find('img').unbind('contextmenu');
    	$("#picture-modal").find('img').unbind('mousemove');
    	
    	$("#picture-modal").find('img').on('load',this.displayFullSizeLoaded);
    	$("#picture-modal").find('img').on('error',this.displayFullSizeError);
    	
    	$("#picture-modal").find('.full-size-image').on('contextmenu',this.onFullSizeRightClick);
    	$("#picture-modal").find('.full-size-image').on('mousemove',this.hideFullSizeRightMenu);
    },
    displayFullFormat : function(){
    	
    	var imageLink="";
		if (configuration.image_link_php == true){
			imageLink="php/requests/user/getImage.php?full=thumb&id="+ this.model.getFullName();
		} else {
			var user = Authentication.getUser().getLogin();
			imageLink="users/"+user+"/fullsize/"+this.model.getFullName();
		}
    	
    	var context = {
    			labels : this.context,
    			image: this.model.toJSON(),
    			imageLink : imageLink
    	};
    	
      // If there is products display add to cart button
      if (this.products && this.products.length > 0){
        context['products'] = true;
      }
    	
    	$("#picture-modal").html(this.fullSizeTemplate(context));
    	$("#picture-modal").find('img').on('load',this.displayFullSizeLoaded);
    	$("#picture-modal").find('img').on('error',this.displayFullSizeError);
    	
    	$("#picture-modal").find('.full-size-image').on('contextmenu',this.onFullSizeRightClick);
    	$("#picture-modal").find('.full-size-image').on('mousemove',this.hideFullSizeRightMenu);
    	$("#picture-modal").find('.add-to-cart').on('click',this.displayAddToCartPanel);
    	
    	$("#picture-modal").dialog({
    		appendTo : '#picture-modal-container',
	        height : 200,
	        width : 300,
	        modal : true,
	        position: 'center',
	        resizable : false,
	        closeOnEscape : true,
            create: function() {
                $(this).css("overflow", "hidden");
            },
            close: function( event, ui ) {
                $(".ui-dialog-content img").remove();
            }
	      });
    	
    	$("#picture-modal").find("button").hide();
    	$("#picture-modal").find("button").button();
    	$("#picture-modal").find(".downloadButton").button();
    	$("#picture-modal").find(".downloadButton").hide();
    	$("#picture-modal").find(".next-pic-filter").on("click",this.nextPage);
    	$("#picture-modal").find(".prev-pic-filter").on("click",this.previousPage);
    	$("#picture-modal").find("#next-pic").on("click",this.nextPage);
      $("#picture-modal").find("#prev-pic").on("click",this.previousPage);
    	$("#picture-modal").find(".closepicture").on("click",this.closeDialog);
    	$("#picture-modal").find(".closepicture-mobile").on("click",this.closeDialog);
    	
      // Change overlay for full screen image
      $(".ui-widget-overlay").addClass("custom-overlay-img-fullsize");
      
      // Hide title bar
      $("#picture-modal-container .ui-dialog-titlebar").hide();
      
      $("#fullsize-picture").focus();
      
    },
    nextPage : function(){
    	logger.info("Goto next picture");
    	var index = new Number(this.index) + 1;
    	this.goTo(index);
    },
    previousPage : function(){
    	logger.info("Goto prev picture");
    	var index = new Number(this.index) - 1;
    	this.goTo(index);
    },
    closeDialog : function(){
    	$("#picture-modal").dialog('close');
    },
    displayFullSizeLoaded : function(){
    	
    	logger.info("loaded");
        var maxWidth = $(window).width() - 125;
        
        // Check if there is the download button.
        if (this.model.getUrlAccess()){
          var maxHeight = $(window).height() -93;
        } else {
          var maxHeight = $(window).height() -68;
        }
        
        $(".ui-dialog-content img").hide();
        $(".ui-dialog-content img").removeAttr('width');
        $(".ui-dialog-content img").removeAttr('height');

        var width = $(".ui-dialog-content img").width();
        var height = $(".ui-dialog-content img").height();
        var scale = 1;
        
        if (width > maxWidth && height > maxHeight){
        	scale = width/maxWidth;
        	if (height/maxHeight > scale){
        		scale = height/maxHeight;
        	}
        } else if (width > maxWidth){
                scale = width/maxWidth;
        } else if (height > maxHeight){
                scale = height/maxHeight;
        }
        $("#picture-modal").find("button").button({
        	disabled : false
        });
        var pwidth = width/scale;
        var pheight = height/scale;
        $("#picture-modal").find("button").show();
        $("#picture-modal").find(".downloadButton").show();
        $(".ui-dialog-content img").attr("width",pwidth) ;
        $(".ui-dialog-content img").attr("height",pheight) ;
        $(".ui-dialog-content .full-image-copy-right-filter").attr("style","width:"+pwidth+"px;height:"+pheight+"px;");
        $(".ui-dialog-content .next-pic-filter").attr("style","height:"+pheight+"px;");
        $(".ui-dialog-content .prev-pic-filter").attr("style","height:"+pheight+"px;");
        $(".ui-dialog-content img").show();
        
        $("#img-loading").hide();
        $( ".ui-dialog-content" ).dialog( "option", "height", "auto" );
        $( ".ui-dialog-content" ).dialog( "option", "width", "auto" );
        $(".ui-dialog-content").dialog("option","position","center");
        
        if (this.nbTotalPictures <= 1){
          $("#picture-modal").find("#next-pic").hide();
          $("#picture-modal").find("#prev-pic").hide();
        }
        
        if (Authentication.getUser().isAllowDownload() == 1){
        	$("#picture-modal").find(".full-image-copy-right-filter").hide();
        }
	},
	/**
	 * On image load error
	 */
	displayFullSizeError : function(){
		// Close the current dialog
		this.closeDialog();
		
		// Indicates the error
		logger.error("Error loading image fullsize <"+this.model.getName()+">");
		
		var options = {
	        context : {
	        	title : this.context.loadErrorTitle,
	        	warning : this.context.loadErrorMessage,
	        	cancel : null,
	        	submit : null,
	        	withoutCancel : true
	        }
	    };
		
		var confirmView = new ConfirmView(options);
		confirmView.render();
	},
    displayAddToCartPanel : function(event){
    	logger.info("displaying image cart panel");
    	
    	if (this.panel){
    		this.panel.close();
    	}
    	var popupOnAdd=false
    	if (event.currentTarget.id == 'fullSizeAddToCart'){
    		popupOnAdd=true;
    	}
    	this.panel = new ImageAddToCartPanelVeiw({
    		model : this.model,
    		popUpOnAdd : popupOnAdd,
    		products : this.products
    	});
    	this.panel.render();
    },
    onRightClick : function(event){
    	event.preventDefault();
    	DomTools.onRightClick(event,"#wrapper","#right-click-menu");
    },
    hideRightMenu : function(event){
    	event.preventDefault();
    	DomTools.hideRightMenu(event,"#wrapper","#right-click-menu");
    },
    onFullSizeRightClick : function(pEvent){
    	logger.info("No right click");
    	
    	var x;
    	var y;
    	if (pEvent.pageX || pEvent.pageY) { 
    	  x = pEvent.pageX;
    	  y = pEvent.pageY;
    	}
    	else { 
    	  x = pEvent.clientX; 
    	  y = pEvent.clientY; 
    	}
    	
    	var o = $("#picture-modal").dialog("open").offset();
    	x = x - o.left;
    	y = y -o.top;
    	
    	$("#picture-modal").find("#right-click-menu").attr("style","top:"+y+"px; left:"+x+"px;");
    	$("#picture-modal").find("#right-click-menu").show();
    	
    	this.rightMenuX = x;
    	this.rightMenuY = y;
    	
    	pEvent.preventDefault();
    	return false;
    },
    hideFullSizeRightMenu : function(event){
    	var x;
    	var y;
    	if (event.pageX || event.pageY) {
    	  x = event.pageX;
    	  y = event.pageY;
    	}
    	else { 
    	  x = event.clientX; 
    	  y = event.clientY; 
    	}
    	var o = $("#picture-modal").dialog("open").offset();
    	x = x - o.left;
    	y = y -o.top;
    	
    	if (x > this.rightMenuX + 20 || x < this.rightMenuX -20 || y > this.rightMenuY + 20 || y < this.rightMenuY -20){
    		$("#picture-modal").find("#right-click-menu").hide();
    	}
    }

  });
  return PicturesView;

});
