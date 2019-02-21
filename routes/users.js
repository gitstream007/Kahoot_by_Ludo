let express     = require('express'),
    router      = express.Router();
let passport    = require('passport');

require('./../config/passport')(passport);

let usersController = require('../controllers/usersController');

router.post     ('/users',          usersController.create);
router.get      ('/users',          passport.authenticate('jwt', {session:false}), usersController.get);
router.put      ('/users',          passport.authenticate('jwt', {session:false}), usersController.update);
router.delete   ('/users',          passport.authenticate('jwt', {session:false}), usersController.remove);
router.post     ('/users/login',    usersController.login);

module.exports = router;