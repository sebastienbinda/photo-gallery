/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ 'moment' ], function(moment) {

  var DATE_TIME_FORMAT = 'YYYY/MM/DD-HH:mm:ss';

  return {
    /**
     * 
     * @param pString
     *          date string representation
     * @param pFormat
     *          optional format
     * @return the date as a timestamp string
     */
    stringToTimestamp : function(pString, pFormat) {
      var appliedFormat = DATE_TIME_FORMAT;
      if (pFormat) {
        appliedFormat = pFormat;
      }
      var result = null;
      if (pString) {
        var day = moment.utc(pString, appliedFormat);
        result = day.valueOf();
      }
      return result.toString();
    },
    /**
     * 
     * @param pTimestamp
     *          a timestamp
     * @param pFormat
     *          optional format
     * @return the date string representation
     */
    timestampToString : function(pTimestamp, pFormat) {
      var appliedFormat = DATE_TIME_FORMAT;
      if (pFormat) {
        appliedFormat = pFormat;
      }
      var result = null;
      if (pTimestamp) {
        var day = moment.utc(parseInt(pTimestamp));
        result = day.format(appliedFormat);
      }
      return result;
    }

  };
});