/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'jquery', 'jqueryui' ], function($) {

  /**
   * Enable logging / May be disable for production!
   */
  var loggingEnabled = true;

  /**
   * Define logger levels
   */
  var levels = {
    DEBUG : 0,
    INFO : 1,
    WARN : 2,
    ERROR : 3
  };

  /**
   * Set the logging level
   */
  var loggingLevel = levels.DEBUG;

  /**
   * Check if console exists in current browser
   */
  var isLoggerEnable = function() {
    return (loggingEnabled && !(typeof (console) === 'undefined') && console.log);
  };

  return {
    /**
     * Log a debug message in the browser console
     * 
     * @param sMessage
     *          message to log
     * @param feedback
     *          true to display message as feedback
     */
    debug : function(sMessage, feedback) {
      if (isLoggerEnable() && loggingLevel <= levels.DEBUG) {
        console.log('[DEBUG] ' + sMessage);
      }
      if (feedback) {
        this.displayFeedback(sMessage, 'feedback-debug');
      }
    },
    /**
     * Log an information message in the browser console
     * 
     * @param sMessage
     *          message to log
     * @param feedback
     *          true to display message as feedback
     */
    info : function(sMessage, feedback) {
      if (isLoggerEnable() && loggingLevel <= levels.INFO) {
        console.info('[INFO] ' + sMessage);
      }
      if (feedback) {
        this.displayFeedback(sMessage, 'feedback-info');
      }
    },
    /**
     * Log a warning message in the browser console
     * 
     * @param sMessage
     *          message to log
     * @param feedback
     *          true to display message as feedback
     */
    warn : function(sMessage, feedback) {
      if (isLoggerEnable() && loggingLevel <= levels.WARN) {
        console.warn('[WARN] ' + sMessage);
      }
      if (feedback) {
        this.displayFeedback(sMessage, 'feedback-warn');
      }
    },
    /**
     * Log an error message in the browser console
     * 
     * @param sMessage
     *          message to log
     * @param feedback
     *          true to display message as feedback
     */
    error : function(sMessage, feedback) {
      if (isLoggerEnable() && loggingLevel <= levels.ERROR) {
        console.error('[ERROR] ' + sMessage);
      }
      if (feedback) {
        this.displayFeedback(sMessage, 'feedback-error');
      }
    }
  };
});