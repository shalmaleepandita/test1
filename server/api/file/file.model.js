'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var FileSchema = new mongoose.Schema({
  name: String,
  id: String,
  type: String
});

export default mongoose.model('File', FileSchema);

