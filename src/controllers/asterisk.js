const config = require('config');

const port = config.get('asterisk.port');
const host = config.get('asterisk.host');
const username = config.get('asterisk.username');
const password = config.get('asterisk.password');
const events = config.get('asterisk.events');

/* See https://www.npmjs.com/package/asterisk-manager for info on how to use the asterisk-manager */

var ami = new require('asterisk-manager')(port,host,username,password,events);
ami.keepConnected();


