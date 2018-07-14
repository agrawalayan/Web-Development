var os = require("os");
const yelp = require('yelp-fusion');
var url = require('url');

const apiKey = '7y7deTz0-5FV8_i1NGr6raEhZwU090ydxdIEceijfexCv4lD6oaDB5f6EWaoRwUYKY7xvF1eQ39AKGzFEDSIZDarg2cmGSnrfZjEMaZeJ92VYahb5QiCKCys9FtCWnYx';
const client = yelp.client(apiKey);

var express = require('express');
var app = express();
var data = '';
app.get('/', function(req, res) {
		var q = url.parse(req.url, true);
		var qdata = q.query;
		//console.log(qdata.location);
		const searchRequest = {
			term:qdata.key,
			location: qdata.location
		};
		
		client.search(searchRequest).then(response => {
			for (var i = 0; i<5; i++){
				name = response.jsonBody.businesses[i]['name'];
				convertToJsonString = JSON.stringify(name);
				data += "Name:";
				data += convertToJsonString;
				data += "\r\n";
				
				display_address = response.jsonBody.businesses[i]['location']['display_address'];
				convertToJsonString = JSON.stringify(display_address);
				data += "Address:";
				data += convertToJsonString;
				data += "\r\n";
				
				rating = response.jsonBody.businesses[i]['rating'];
				convertToJsonString = JSON.stringify(rating);
				data += "Rating:";
				data += convertToJsonString;
				data += "\r\n";
				data += "\r\n";
				data += "\r\n";
			}
			//res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(data);
		}).catch(e => {
			console.log(e);
		});
	}).listen(8080, () => console.log("Server running..."));

	


