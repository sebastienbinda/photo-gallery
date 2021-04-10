/*
 * 
 * VERSION 2.2 : 16/04/2015 : Configuration des connexions avec ou sans mot de passe.
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone', 'handlebars', 'logger', 'authentication',
         'i18n!administration/nls/Messages', 'text!administration/templates/ServiceConfiguration.html'], 
 function($, _, backbone, handlebars, logger, Authentication, messages, form) {

  var ServiceConfigurationView = backbone.View.extend({
    id : 'app-admin-service-conf',
    template : handlebars.compile(form),
    context : messages.serviceconfigration,
    initialize : function(options) {
      _.bindAll(this,'render','submit','cancel','success','error');
      this.target = options.target;
    },
    events : {
    	'click #submit' : 'submit',
    	'click #cancel' : 'cancel'
    },
    render : function(){
    	$(this.el).html(this.template(this.context));
    	$(this.target).html(this.el);
    	
    	$(this.el).find("button").button();
    	
    	$(this.el).find('#passwordEnable').val(Authentication.getServiceConfiguration().getPasswordEnable());
    },
    submit : function(){
    	
    	var value = $(this.el).find('#passwordEnable').val();
    	
    	if (value != Authentication.getServiceConfiguration().getPasswordEnable()){
    		Authentication.getServiceConfiguration().setPasswordEnable(value);
    		Authentication.getServiceConfiguration().save(null,{
    			success : this.success,
    			error : this.error
    		});
    	} else {
    		this.cancel();
    	}
    	
    },
    success : function(){
    	this.close();
    },
    error : function(){
    	
    },
    cancel : function(){
    	this.close();
    },
    onClose : function(){
    	this.remove();
    }
  });

  return ServiceConfigurationView;

});

