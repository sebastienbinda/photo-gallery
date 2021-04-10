/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([], function() {

  return {

    getMessage : function(pMessage, pAttribute1, pAttribute2, pAttribute3) {

      var newMessage = pMessage;

      if (pAttribute1 != undefined && pAttribute1 != null) {
        newMessage = newMessage.replace("$1", pAttribute1);
      }

      if (pAttribute1 != undefined && pAttribute1 != null) {
        newMessage = newMessage.replace("$2", pAttribute2);
      }

      if (pAttribute3 != undefined && pAttribute3 != null) {
        newMessage = newMessage.replace("$3", pAttribute3);
      }

      return newMessage;

    }

  };
});