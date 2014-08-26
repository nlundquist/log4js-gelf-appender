# Log4JS GELF Log Appender

Supports sending HTTP GELF logs to a Graylog2 log server or some other GELF HTTP compatible host.

## Usage

Takes a single argument at instantiation, the URL of the GELF HTTP endpoint to log to.

Any key-value pairs added to the optional dictionary field 'extra' of a log object will be passed to the log server
as additional fields in the GELF message.

Config:
```
error_logger = log4js.getLogger('browser-error');
error_logger.addAppender(new log4js.GELFAppender('http://log.myhost.com/gelf'))
...
addUserAndClient = function(log) {
  log.extra.user = app.user.full_name;
  log.extra.client = window.location.host.split('.')[0];
}
error_logger.onlog.addListener(addUserAndClient);
```

Usage:
```
log4js.getLogger('browser-error').error(
    'Initial site loading has caused an error.'
)
```