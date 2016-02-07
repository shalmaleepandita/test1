'use strict';

var express = require('express');
var controller = require('./file.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:fileId', controller.show);
router.get('/member', controller.memberFolder);
router.get('/core', controller.coreFolder);

module.exports = router;
