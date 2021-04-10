/*
 * $Id$
 * 
 * HISTORIQUE
 *
 * VERSION : 5.3 : FA : V53-FA-VR-FC-GUSR-100_001 : 12/08/2013 : refresh à la volée
 * VERSION : 5.3 : DM : SIPNG-DM-0129-CN : 21/05/2013 : Nettoyage des vues
 * 
 * FIN-HISTORIQUE
 * 
 * Description :
 * Backbone AutoCloseable is a Backbone plugin used to clean redundant views.
 * To be AutoCloseable, a view must first extend AutoCloseable view :
 * Example : 
 * var MyView = Backbone.AutoCloseable.View.extend({});
 * To effectively register a view to be AutoCloseable, you must pass an AutoCloseable IDentifier (acid) in view option.
 * Example : 
 * var myView = new MyView({acid : 'myAcidString'})
 * The 'acid' allows to store this new view reference in the internal store.
 * But before, if an old view with the same 'acid' already exists, it's cleaned up and removed from the internal store.
 */
(function(root, factory) {
  // Set up appropriately for the environment.
  if (typeof exports !== 'undefined') {
    // Node/CommonJS
    factory(exports, require('underscore'), require('backbone'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([ 'exports', 'underscore', 'backbone' ], factory);
  } else {
    // Browser globals
    factory({}, root._, root.Backbone);
  }
}(this, function(exports, _, Backbone) {

  "use strict";

  Backbone.AutoCloseable = {};

  Backbone.AutoCloseable.View = Backbone.View.extend({
    constructor : function(options) {
      // Call super constructor
      Backbone.View.apply(this, arguments);
      // Store view reference if 'acid' exists
      if (options && options.acid && typeof (options.acid) === 'string') {
        // Close old view
        Backbone.AutoCloseable.Store.closeAndRemove(options.acid);
        // Store new view
        this.acid = options.acid;
        Backbone.AutoCloseable.Store.add(new StoredModel({
          id : options.acid,
          storedObject : this
        }));
      } else {
        throw new Error('An AutoCloseable object must have an "acid" attribute');
      }
    }
  });

  /**
   * Initialize a Backbone.AutoCloseable.Store to keep view instance according to its 'acid' (AutoCloseabe IDentitifier)
   */
  // Store model
  var StoredModel = Backbone.Model.extend({
    defaults : {
      // AutoCloseable IDentifier
      acid : null,
      // Associated object
      storedObject : null
    }
  });

  // Store collection
  var StoreCollection = Backbone.Collection.extend({
    model : StoredModel,
    /**
     * Close auto closeable view if exists
     * 
     * @param acid
     *          auto closeable identifier
     */
    closeAndRemove : function(acid) {
      // Retrieve view
      if (acid && typeof (acid) === 'string') {
        var storedModel = this.get(acid);
        if (storedModel) {
          // Cleanup view
          var storedView = storedModel.get('storedObject');
          if (storedView) {
            // Remove all of the view's delegated events
            storedView.undelegateEvents();
            // Remove view from the DOM
            storedView.remove();
            // Removes all callbacks on view
            storedView.off();
            // Call close function if any
            if (typeof storedView.onClose === 'function') {
              storedView.onClose();
            }
          }
          // Remove store model
          this.remove(storedModel);
        }
      }
    },
    /**
     * Try to retrieve a view from its acid
     * 
     * @param acid
     *          auto closeable identifier
     */
    retrieve : function(acid) {
      // Retrieve view
      if (acid && typeof (acid) === 'string') {
        var storedModel = this.get(acid);
        if (storedModel) {
          return storedModel.get('storedObject');
        }
      }
    }
  });

  Backbone.AutoCloseable.Store = new StoreCollection();

}));