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
 * @extends log4js.Appender
 * @param logger log4js instance this appender is attached to
 * @author Nils Lundquist
 */
log4js.GELFAppender = function(loggingUrl) {
    this.loggingUrl = loggingUrl;
	this.layout = new log4js.GELFLayout();
};

log4js.GELFAppender.prototype = log4js.extend(new log4js.AjaxAppender(), {
	 toString: function() {
	 	return "log4js.JSGELFAppender";
	 }

})


/**
 * JSONLayout write the logs in JSON format.
 * JSON library is required to use this Layout. See also {@link http://www.json.org}
 * @constructor
 * @extends log4js.Layout
 * @author Stephan Strittmatter
 */
log4js.GELFLayout = function() {};
log4js.GELFLayout.prototype = log4js.extend(new log4js.Layout(), {
	/**
	 * Implement this method to create your own layout format.
	 * @param {log4js.LoggingEvent} loggingEvent loggingEvent to format
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

        var extra = loggingEvent.extra;
        for (var key in extra) {
            if (extra.hasOwnProperty(key)) {
                gelf['_'+key] = extra[key];
            }
        }

        return JSON.stringify(gelf);
	},
	/**
	 * Send text content type. Endpoint doesn't accept 'application/json' as expected.
     * Leaving unset causes problems in Safari XHR.
	 * @return The base class returns "text/plain".
	 * @type String
	 */
	getContentType: function() {
        return 'text/plain';
    },

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