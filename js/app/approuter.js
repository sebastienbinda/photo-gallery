/*
 * 
 * VERSION 2.2 : 04/05/2015 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'jquery', 'underscore', 'backbone', 'handlebars', 'bus', 'authentication','gallery','i18n!gallery/nls/Messages','authentication/models/LoginModel'],
    function(logger, $, _, backbone, handlebars, bus, Authentication, gallery, messages, LoginModel) {

var AppRouter = backbone.Router.extend({

  routes: {
    "gallery/:login":      "gallery",
    "cart/:login":      "gallery",
    "login" :"start",
    "" : "start",
  },

  gallery: function(pLogin) {
  	if (pLogin != "login"){
  	    this.start(pLogin);
  	} else {
  	  Authentication.start();
  	}
  },
  start : function(pLogin){
	if ($("#private-gallery").length == 0 ){
	  logger.info("Acces direct a la gallery : " + pLogin);
		Authentication.start(pLogin);
	} else {
	  logger.info("Sortie de la galerie ?");
		// Exit the gallery with navigation back is forbidden to avoid loosing cart
		if (Authentication.getUser() && Authentication.getUser().getLogin()){
		  $("#app-confirm").html("<p>"+ messages.confirmLeaveGalleryMsg +"</p>");
      
      var dialog_buttons = {}; 
      dialog_buttons[messages.confirmLeaveGalleryButton] = function() {
        Authentication.start();
        logger.info("Sortie de la galerie confirmée");
        $( this ).dialog( "close" );
      };
      dialog_buttons[messages.cancelLeaveGalleryButton] = function() {
            backbone.history.navigate("gallery/"+Authentication.getUser().getLogin(),{trigger:false});
            $( this ).dialog( "close" );
        }
      
      $("#app-confirm").dialog({
        title : messages.confirmLeaveGalleryTitle,
        buttons : dialog_buttons,
        modal : true,
      });
			
		} else {
			Authentication.start(pLogin);
		}
	}
	}

});

return AppRouter;

});