const router = require('express').Router();
const { isAuthenticated } = require('../middlewares/auth-middleware');
const validate = require('express-validation');
const Joi = require('joi');
const User = require('../models/user');
const facebookController = require('../controllers/facebook-controller');
const userController = require('../controllers/user-controller');

router.use(isAuthenticated);

router.get('/', async (req, res, next) => {
  try {
    return res.send(await User.findById(req.user.id).populate('facebook_account kyc_account gmail_account'));
  } catch (err) {
    console.error('ERROR GET /me', err);
    res.status(500).send(err);
  }
});


const requestSchemaMe = {
  body: {
    email: Joi.string().email().required()
  }
};
router.post('/', validate(requestSchemaMe), async (req, res, next) => {
  try {
    console.log('(POST /me) req.body >>>', req.body);
    const user = await facebookController.updateUserEmail(req, res);
    return res.send(user);
  } catch (err) {
    console.error('ERROR POST /me', err);
    res.status(500).send(err);
  }
});

const requestSchemaMeVerifySms = {
  body: {
    code: Joi.number().required().min(100000).max(999999)
  }
};
router.post('/verify-sms', validate(requestSchemaMeVerifySms), async (req, res, next) => {
  try {
    console.log('(POST /me/verify-sms) req.body >>>', req.body);
    const user = await userController.verifySmsCode(req, res);
    return res.send(user);
  } catch (err) {
    console.error('ERROR POST /me', err);
    res.status(500).send(err);
  }
});



module.exports = router;
