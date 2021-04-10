/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'logger', 'jquery', 'underscore', 'backbone', 'handlebars', 'i18n!widgets/confirm/nls/Messages',
    'text!widgets/confirm/templates/confirm.html', 'jqueryui' ], function(logger, $, _, backbone, handlebars, messages,
    confirm) {

  var ConfirmView = backbone.View.extend({
    id : 'app-confirm',
    template : handlebars.compile(confirm),
    /**
     * Available options : - context : default { title : 'Undefined title' warning : 'your message (optionnal)', cancel :
     * 'cancel button label (optionnal)', submit : 'submit button label (optionnal)' } - confirm : callback if confirm,
     * focusOnSubmit : 'submit' button is selected by default in place of 'cancel' button
     * 
     * args is an optionnal Array passed to the callback
     */
    initialize : function() {
      _.bindAll(this, 'cancel', 'submit', 'onCloseEvent');
      // Get arguments
      var options = arguments[0];
      var args = Array.prototype.slice.call(arguments);
      args = args.slice(1);
      // Set option values
      this.context = options.context ? options.context : {};
      if (!this.context.title) {
        this.context.title = 'Undefined title';
      }
      if (!this.context.cancel) {
        this.context.cancel = messages.cancel;
      }
      if (!this.context.submit) {
        this.context.submit = messages.submit;
      }

      // Init callback and its args
      this.confirm = options.confirm;
      this.args = args;
    },

    events : {
      'click .sip-cancel' : 'cancel',
      'click .sip-submit' : 'submit'
    },

    cancel : function(event) {
      event.preventDefault();
      $(this.el).dialog('close');
    },
    submit : function(event) {
      event.preventDefault();
      $(this.el).dialog('close');
      // Call callback action if any
      if (this.confirm) {
        this.confirm.apply(event, this.args);
      }
    },
    /**
     * Common handler final action(s)
     */
    onCloseEvent : function() {
      this.close();
    },
    // Override this method to display data
    render : function() {
      // Ensure root element
      if ($('#' + this.id).length === 0) {
        $('#app-modal').append(this.el);
      }
      $(this.el).html(this.template(this.context));

      if (this.context.withoutCancel) {
        $(this.el).find(".sip-cancel").hide();
      }

      // Set Buttons
      $(this.el).find('a').button();
      // Call modal
      $(this.el).dialog({
        title : this.context.title,
        height : this.context.height ? this.context.height : "auto",
        width : this.context.width ? this.context.width : 300,
        modal : true,
        closeOnEscape : false,
        close : this.onCloseEvent
      });

      if (this.context.focusOnSubmit) {
        $(".sip-submit").focus();
      }

      return this;
    },
  });
  return ConfirmView;
});