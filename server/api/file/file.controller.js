/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /items              ->  index
 * GET     /items/:id          ->  show
 */

'use strict';
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var fs = require('fs');

var _ = require('lodash');
var File = require('./file.model');

// Get list of itemss
exports.index = function(req, res) {
  retrieveAllFilesInFolder('0B-zttz8ahVZTUk0xdWlZTUFuUXc').then(function(fileList){
    return res.status(200).json(fileList);
  }, function(reason){
    return handleError(res, reason);
  });
};

// Get a single item
exports.show = function(req, res) {
  retrieveAllFilesInFolder(req.params.fileId).then(function(fileList){
    return res.status(200).json(fileList);
  }, function(reason){
    return handleError(res, reason);
  });
};

// Get list of items in member folder
exports.memberFolder = function(req, res) {
  retrieveAllFilesInFolder('0B-zttz8ahVZTSjdfR2YwZWppUjg').then(function(fileList){
    return res.status(200).json(fileList);
  }, function(reason){
    return handleError(res, reason);
  });
};

// Get list of items in core folder
exports.coreFolder = function(req, res) {
  retrieveAllFilesInFolder('0B-zttz8ahVZTcXU3VjJFU0Y1Wlk').then(function(fileList){
    return res.status(200).json(fileList);
  }, function(reason){
    return handleError(res, reason);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

function authorize(credentials) {
  return new Promise(function(resolve, reject) {
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2();
    var jwt = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/drive']
    );
    jwt.authorize(function (err, result) {
      if (err) {
        console.log('Failed jwt authorize: ' + err);
        reject('Failed jwt authorize: ' + err);
      }
      oauth2Client.setCredentials({
        access_token: result.access_token
      });
      resolve(oauth2Client);
    });
  });
}

function getCredentials() {
  return new Promise(function(resolve, reject){
    fs.readFile('server/config/google-service-account.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        reject('Error loading client secret file: ' + err);
      }
      resolve(JSON.parse(content));
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function retrieveFile(fileId, auth) {
  return new Promise(function(resolve, reject) {
    var service = google.drive('v2');
    service.files.get({
      auth: auth,
      maxResults: 10,
      fileId: fileId
    }, function (err, response) {
      if (err) {
        console.log('The files.get API returned an error: ' + err);
        reject('The files.get API returned an error: ' + err);
      }
      resolve(response);
    });
  });
}

function retrieveChildrenList(folderId, auth) {
  return new Promise(function(resolve, reject) {
    var service = google.drive('v2');
    service.children.list({
      auth: auth,
      maxResults: 10,
      folderId: folderId
    }, function (err, response) {
      if (err) {
        console.log('The children.list API returned an error: ' + err);
        reject('The children.list API returned an error: ' + err);
      }
      resolve(response.items);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function retrieveAllFilesInFolder(folderId) {
  return new Promise(function(resolve, reject){
    getCredentials().then(function(credentials){
      authorize(credentials).then(function(auth){
        retrieveChildrenList(folderId, auth).then(function(childList){
          var promiseList = [];
          for(var i=0; i<childList.length; i++ ){
            promiseList.push(retrieveFile(childList[i].id, auth));
          }
          Promise.all(promiseList).then(function(fileList) {
            resolve(fileList);
          }, function(reason){
            reject(reason);
          });
        }, function(reason){
          reject(reason);
        });
      }, function(reason){
        reject(reason);
      });
    }, function(reason){
      reject(reason);
    });
  });
}
