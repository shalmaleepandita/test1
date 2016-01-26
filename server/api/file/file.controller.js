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
    var contentJS = {
      "type": "service_account",
      "project_id": "lotusvoice-1191",
      "private_key_id": "9e422466fe08ca2653d7635e97481ef42c65d2d7",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCPcC+2ngSch5V8\nSIF/gTOSmOrXSdO8nUusgdTbxCxlMyXhbbiP9s8muSsIEM0zWkKqVNnVDiSQBmUB\nBkzboT8B3l38fcySkKYe+b49/4+C76tCYQuF4dRNrGLnQPxmZJUiiV9ieSXIq0ni\nPgFFMlWZqcx+SDFqYvV87F2IfcyxKjhELc6lLGnln99I/JRgh/nRiVPtjGWoQkpl\nx55Lw5fiqK2k8bSovVSw+Z//WV+O+R2buoEBk6ppKLYEpB6rX7SMvoMCIcLmH6rB\ni9h+FIoabL37smDJ2YydnhzlVpjjKHVANRLPYa2SSfE4vDCi/K3jf0zI5vgCyrNC\nu/QAgxlnAgMBAAECggEBAIgZgqxcMzPy0jwi7/zzsuOehPXR7z5AYdVFO5trAFTl\nu0OywDSZkuTDPblhd9MKCcdky2wFB1xBNQVL3RFoZkh3neY91yYaagVqIsDhBGLQ\n1kcdnbljFfa9YvraBqOBPKCQiBj/qoJFRM2O19W4dNBg9M+94GV5kEUAYZ9o/hf6\n805hFUg+YCNw0Jq+CCaB9xydSPrae70+ZtYm7LWdHLeXRvqS1V6RdqalQllKYGf/\nGB+u+r1u/hVxcnnhkRDjzkqQD0uHJos2+DpbBdSAsJdjPFiqUGdWxq7N/7P5ClPD\nGuGrhsM7aej3YZWrGI40ocNfFN1K2/bTY8ho0LdjooECgYEAyh1RJBaIZUPbwoG1\n1JqmiPRevDKPq7UEboqYCzxv9N+TTZQc+L2uRpe1dXT8+VoGSM7M6WxF/qprtmCa\nKpqxGHMqG0D4cEeniH2CRgvR+HwuECJjhjXfO2HniqrQtyeuZA0+l0R1IMgZxqWr\neNb8q4p21IZy9ybatjgX3Kv+NTkCgYEAta4bIMDzF6Cs4H5dbdiclahar97v/It9\nNUExeQ5MWUCWtwnGih2NXtIckyV++Td8kBqoQUbQNXV+bGB5OhtVMigDBlHIhQgz\nBedYpaYrwdV+QqGFwFKKUK7uiHjMkPUGJK046OPv41tK1S/6oE8oKA7Lkqex6kJV\nYhGrh5pjY58CgYB5KcoS0E9EJcIAgLH4mh1rzNNeDxGB5iqZ+gvb8IdNTRqJT1lu\n5IctWpU1rMRa11UdIJxG8tmjKZcY5iCFmebAuYlsfS5yYQJWGKeYRk3BoPAcTAFN\n283PU4ny3yPwKKGq6SW0mR1+YXbSV07MSlV+oKtMDK2u7GQBCO+FIrZqQQKBgE5Z\nmltiurM62LMr69DedJDZ/NoRs79ezI114wcI0oY/I4AmWBfiLMByrl4K8po5gp+G\nz37vMgWL+Qx2AnG7rd8mgD9ub6JnadGm9oThh8dc8cl8bPkG351yA26ZYec1tAOH\nLJ7LBf4vtbMAsP4HhRLZZpOFfGXBW58iba3aN/iTAoGAY3hvy6msMMnTdkPDVe9j\nURcZU1qmRFEHNQgK3QGQC0kg6tpBZcl6qRSNYfiOYjsd+5+hblrPE0++Z1mir4F1\ndV2LVtbeZ1DvIqO8I3hIj5nPaZj91LjQ9EDOllrzLEvaQ4YwKzMmmy8fXVjsnqfu\nvXkrqchaKiX3sTwpM3BapQw=\n-----END PRIVATE KEY-----\n",
      "client_email": "lotusvoice@lotusvoice-1191.iam.gserviceaccount.com",
      "client_id": "118256659727019147834",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/lotusvoice%40lotusvoice-1191.iam.gserviceaccount.com"
    };
    resolve(contentJS);
    /*fs.readFile('server/config/google-service-account.json', function processClientSecrets(err, content) {

      if (err) {
        console.log('Error loading client secret file: ' + err);
        reject('Error loading client secret file: ' + err);
      }
      resolve(JSON.parse(content));
    });*/
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
