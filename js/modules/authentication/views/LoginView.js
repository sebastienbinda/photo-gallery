/*
 * 
 * VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
 * VERSION 2.2 : 15/04/2015 : Gestion de la connexion sans mot de passe.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'bus',
         'i18n!authentication/nls/Messages', 'authentication/models/LoginModel',
         'text!authentication/templates/login.html' ], 
 function($, _, backbone, handlebars, logger, bus, messages, LoginModel, form) {

  var LoginView = backbone.View.extend({
    id : 'app-login-view',
    template : handlebars.compile(form),
    context : messages,
    initialize : function(options) {
      _.bindAll(this, 'beforeSubmit','submit','loginSuccess','loginError','onAuthenticate','filterOnEnter','close');
      this.bind(bus.events.authenticated, this.onAuthenticate, this);
      this.bind(bus.events.adminauthenticated, this.onAuthenticate, this);
      this.target = options.target;
      this.passwordEnable = options.passwordEnable;
      this.previousView = options.previousView;
    },

    events : {
      'click input[type=button]' : 'beforeSubmit',
      'keypress' : 'filterOnEnter',
    },
    render : function(){
      
      backbone.history.navigate("login",{trigger:false});
      
      if (this.passwordEnable == 1){
        this.context['passwordEnable'] = true;
      }
    	$(this.el).html(this.template(this.context));
    	
    	$(this.target).html(this.el);

    	$(this.el).find('input[type=button]').button();
    	
    },
    filterOnEnter: function(e) {
    	if(e.which && e.which != 13) return;
    	if (e.keyCode && e.keyCode != 13) return;
    	this.beforeSubmit(e);
    },
    beforeSubmit : function(){
    	
    	var login = $(this.el).find("#login");
    	var password = $(this.el).find("#password");
    	
    	if (login.val() != "" && (password.val() != "" || this.passwordEnable == 0) ){
    	  if (login.val() == "admin" && this.passwordEnable == 0 && password.val() == ""){
	          $(this.el).find("#passwordField").show();
	          password.addClass("fieldrequired");
	          password.effect( "shake" );
	        } else if (this.passwordEnable == 0){
	          $(this.el).find("#passwordField").hide();
	          this.submit(login.val(),password.val());
	        } else {
	        	this.submit(login.val(),password.val());
	        }
  		} else {
  			if (login.val() == ""){
  				login.addClass("fieldrequired");
  				login.effect( "shake" );
  			} else {
  				login.removeClass("fieldrequired");
  			}
  			
  			if (password.val() == ""){
  				password.addClass("fieldrequired");
  				password.effect( "shake" );
  			} else {
  				password.removeClass("fieldrequired");
  			}
  		}    	
    },
    submit : function(pLogin,pPassword){
    	
    	var loginModel = new LoginModel();
    	loginModel.setLogin(pLogin);
    	loginModel.setPassword(pPassword);
    	loginModel.save(null,{
    		success : this.loginSuccess,
    		error : this.loginError
    	});
    	
    },
    loginSuccess : function(pModel,response, options){
    	logger.debug("Connection ok");
    	if (pModel.getLogin() == "admin"){
    		bus.trigger(bus.events.adminauthenticated,pModel);
    	} else {
    		bus.trigger(bus.events.authenticated,pModel);
    	}
    },
    loginError : function(pModel,xhr, options){
    	logger.error("Erreur de connexion");
    	if (xhr.status == "401"){
    		$(this.el).find('.login-error').html(messages.loginError);
    	} else {
    		$(this.el).find('.login-error').html(messages.loginInternalError);
    	}
    	if (this.passwordEnable == 0){
      	var password = $(this.el).find("#password");
      	password.val("");
    	}
    },
    onAuthenticate : function(){
    	this.close();
    	this.remove();
    }
  });

  return LoginView;

});
