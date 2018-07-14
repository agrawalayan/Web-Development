const authenticationConfig = require('../config/authentication.js');
const request = require('request');
const googleConfig = authenticationConfig.google;
const fs = require('fs');
const {google} = require('googleapis');
const googleOauth2 = google.auth.OAuth2;
const calendar = google.calendar('v3');
const dateFormat = require('dateformat');
const addSubtractDate = require("add-subtract-date");

module.exports = {
  sendSocketAndSaveIntegraionToDB(userId, entity, service, keywords, content, io) {
    var integration = models.integration.build({
      integrationType: service,
      integrationValue: JSON.stringify(content),
      keywords: keywords.toString(),
      chunkId: entity.chunkId,
      entityId: entity.id,
      callUUID: entity.callUUID,
      userId: userId
    });
    integration.save();

    io.sockets.emit(userId, {
      type: 'feed',
      info: {
        service: service,
        keywords: keywords,
        content: content
      }
    });
      return;
  },
  
  refreshGoogleAccessToken(user) {
    const googleOauth2Client = new googleOauth2(googleConfig.clientID, googleConfig.clientSecret, googleConfig.callbackURL);
    googleOauth2Client.setCredentials({
      'access_token' : user.googleAccessToken,
      'refresh_token' : user.googleRefreshToken
    });
    return new Promise((resolve, reject) => {
      const now = + new Date();
      if (now > user.googleAccessTokenExpiryDate) {
        googleOauth2Client.refreshAccessToken((error, tokens) => {
          if (error) {
            console.error(error);
            return reject(error);
          }
          return resolve(tokens);
        });
      } else {
        return resolve();
      }
    })
    .then(tokens => {
      if (tokens) {
        user.googleAccessToken = tokens.access_token;
        user.googleRefreshToken = tokens.refresh_token;
        user.googleAccessTokenExpiryDate = tokens.expiry_date;
        return user.save();
      }
      return user;
    })
    .then(savedUser => {
      return {
        'access_token' : savedUser.googleAccessToken,
        'refresh_token' : savedUser.googleRefreshToken
      };
    });
  },
  
  getDaySchedule(entity, user, io) {      
	let that = this;  
	return this.refreshGoogleAccessToken(user)
    .then((tokens) => {
      const oauth2Client = new googleOauth2(googleConfig.clientID, googleConfig.clientSecret, googleConfig.callbackURL);
      oauth2Client.setCredentials(tokens);
      return new Promise((resolve, reject) => {
        let startDate = entity.entityValue + "T00:00:00Z";
		let endDate = entity.entityValue + "T11:59:59Z";
        calendar.events.list({
		  calendarId: 'primary',
		  timeMin: startDate,
	      timeMax: endDate,
		  singleEvents: true,
		  orderBy: 'startTime',
		},
        (error, response) => {
          if (error) {
            console.log('The Google Calendar API returned an error: ' + error);
            return resolve();
          }
          const events = data.items;
		  if (events.length) {
            console.log('Total Events:');
            events.map((event, i) => {
              const start = event.start.dateTime || event.start.date;
              console.log(`${start} - ${event.summary}`);
			});
		  } else {
			   console.log('No upcoming events found.');
			}
			return resolve(event);
		});
      });
    });
  },
  
  getWeekSchedule(entity, user, io) {      
	let that = this;  
	return this.refreshGoogleAccessToken(user)
    .then((tokens) => {
      const oauth2Client = new googleOauth2(googleConfig.clientID, googleConfig.clientSecret, googleConfig.callbackURL);
      oauth2Client.setCredentials(tokens);
      return new Promise((resolve, reject) => {
        let startDate = entity.entityValue + "T00:00:00Z";
		let endDate = addSubtractDate.add(startDate, 7, "days");
        calendar.events.list({
		  calendarId: 'primary',
		  timeMin: startDate,
	      timeMax: endDate,
		  singleEvents: true,
		  orderBy: 'startTime',
		},
        (error, response) => {
          if (error) {
            console.log('The Google Calendar API returned an error: ' + error);
            return resolve();
          }
          const events = data.items;
		  if (events.length) {
            console.log('Total Events:');
            events.map((event, i) => {
              const start = event.start.dateTime || event.start.date;
              console.log(`${start} - ${event.summary}`);
			});
		  } else {
			   console.log('No upcoming events found.');
			}
			return resolve(event);
		});
      });
    });
  },
}
