const os=require('os');

var graylogProtocol=process.env.GRAYLOG_PROTOCOL;
var graylogPort=parseInt(process.env.GRAYLOG_PORT);
var graylogHost=process.env.GRAYLOG_HOST;

var udp = require('dgram');
var net = require('net');

if (graylogProtocol.toUpperCase()=='TCP')
{
	var client = new net.Socket();

	client.connect(graylogPort, graylogHost, function() {
			console.log('Logger connected to '+graylogHost);
	});
	client.on('error', function(ex) {
		console.log("Can't connect to graylog: " +graylogHost);
		console.log(ex);
		client=0;
	});
}
else if (graylogProtocol.toUpperCase()=='UDP')
{
	var client = udp.createSocket('udp4');
}
else
	console.log("Protocol not define");




module.exports = (level, msg, msgId) => {
	
	if (graylogProtocol.toUpperCase()=='TCP' && client!=0)
	{
		client.write(JSON.stringify({"host":os.hostname() , "short_message":msg , "level":parseInt(level) , "facility":"BiosAssociationTableApp","_messageId": msgId}));
		
		client.on('error', function(ex) {
			console.log("Can't send message to Graylog: "+graylogHost);
		});
	}
	else if(graylogProtocol.toUpperCase()=='UDP')
	{
		client.send(JSON.stringify({"host":os.hostname() , "short_message":msg , "level":parseInt(level) , "facility":"BiosAssociationTableApp","_messageId": msgId}),graylogPort,graylogHost);
		client.on('error', function(ex) {
			console.log("Can't send message to Graylog: "+graylogHost);
			console.log(ex);
		});
	}
	else
		console.log("Not connected to graylog: "+graylogHost);
}
