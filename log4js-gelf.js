/**
 * Created by Nils Lundquist on 2014-05-14.
 */

/**
 * GELF Appender writes GELF-formatted logs to the HTTP input of a Graylog2 server
 * Sadly this appender cannot batch send GELFs currently due to interoperability
 * between the current design of the GELF HTTP input on Graylog2 and the working
 * of XHR.
 *
 * @constructor
 * @extends Log4js.Appender
 * @param logger log4js instance this appender is attached to
 * @author Nils Lundquist
 */
Log4js.GELFAppender = function(loggingUrl) {
    this.loggingUrl = loggingUrl;
	this.layout = new Log4js.GELFLayout();
};

Log4js.GELFAppender.prototype = Log4js.extend(new Log4js.AjaxAppender(), {
	 toString: function() {
	 	return "Log4js.JSGELFAppender";
	 }

})


/**
 * JSONLayout write the logs in JSON format.
 * JSON library is required to use this Layout. See also {@link http://www.json.org}
 * @constructor
 * @extends Log4js.Layout
 * @author Stephan Strittmatter
 */
Log4js.GELFLayout = function() {
	this.df = new Log4js.DateFormatter();
};
Log4js.GELFLayout.prototype = Log4js.extend(new Log4js.Layout(), {
	/**
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
        var gelf = {
            'host': location.href,
            'short_message': loggingEvent.message,
            'timestamp': loggingEvent.startTime.getTime()/1000,
            'facility': loggingEvent.categoryName,
            'level': loggingEvent.level.level/10000,
            '_user-agent': navigator.userAgent
        };

        return JSON.stringify(gelf);
	},
	/**
	 * Do not send a content type. GELF input wouldn't accept when set.
	 * @return The base class returns "text/xml".
	 * @type String
	 */
	getContentType: null,
	/**
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "";
	},
	/**
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "";
	},

	getSeparator: function() {
		return "";
	}
});