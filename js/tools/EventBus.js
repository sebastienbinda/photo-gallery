/*
 * 
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
 * VERSION 2.1 : 11/04/2015 : Gestion des sections.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'underscore', 'backbone' ], function($, _, backbone) {

  var EventBus = _.extend({}, backbone.Events);

  EventBus.events = {
    // General events
    authenticated : 'app:authenticated',
    adminauthenticated : 'app:admin:authenticated',
    disconnect : 'app:disconnect',
    loading : 'app:loading',
    stopLoading : 'app:stoploading',
    displayGallery : 'app:displaygallery',
    displayCart : 'cart:display'

  };
  return EventBus;
});