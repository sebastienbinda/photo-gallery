/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'jquery', 'underscore', 'backbone', 'layout','commande/views/ConfirmationView' ],
		function(logger, $, _, backbone, layout, ConfirmationView) {

  var extendBackbone = function() {

    // Add cleanup function to backbone views
    backbone.View.prototype.close = function() {
      this.trigger('CloseView');
      this.remove();
      this.unbind();
      if (this.onClose) {
        // Custom operation for each view
        // to unbind event for instance
        this.onClose();
      }
    };

    // Add error feedback to backbone models
    // Bind model to error to do so : <model>.bind('error', this.error, this);
    backbone.Model.prototype.error = function(model, xhr, options) {
      logger.error(xhr.responseText, true);
      if (this.onError) {
        // Custom operation if necessary
        this.onError();
      }
    };
  };

  /**
   * Init application
   */
  var init = function() {

    // Add prototype feature to native backbone code
    extendBackbone();

    // Init layout
    layout.init();

    // Start site history
    backbone.history.start();

  };

  return {
    start : function() {
      // Initialization
      init();
      
      var view = new ConfirmationView({
    	  target : '#content'
      });
      view.render();
      
    }
  };
});
