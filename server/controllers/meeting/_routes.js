const express = require('express');
const auth = require('../../middelwares/auth');

const router = express.Router();
const meetings = require('./meeting');

router.get('/', auth, meetings.index);
router.post('/', auth, meetings.add);
router.get('/view/:id', auth, meetings.view);
router.delete('/delete/:id', auth, meetings.deleteData);
router.post('/deleteMany', auth, meetings.deleteMany);

module.exports = router