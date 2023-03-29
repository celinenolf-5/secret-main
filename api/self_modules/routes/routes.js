let express = require('express');
let router = express.Router();

let dataController = require('../../controllers/dataController');

router.post('/connection', dataController.connectUser)
router.post('/backdoor',dataController.backdoor)
module.exports = router;