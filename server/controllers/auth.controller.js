import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

import User from './../models/user.model';
import config from './../../config/config';

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ "email": req.body.email });

    if (!user) {
      return res.status('404').json({ error: 'User not found' });
    }

    if (!user.authenticate(req.body.password)) {
      return res.status('401')/json({ error: 'Email and password dont match' });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);

    res.cookie('t', token, { expire: new Date() + 9999 });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status('401').json({ error: 'Could not signin' });
  }
};

const signout = async (req, res) => {
  res.clearCookie('t');

  return res.status('200').json({
    message: 'Signed out'
  });
};

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth'
});

const hasAuthorization = (req, res, next) => {
console.log('hasAuth');
console.log(req.profile._id);
console.log(req.auth._id);
  const authorized = req.profile && req.auth && req.profile._id.toString() === req.auth._id;

  if (!(authorized)) {
    return res.status('403').json({
      error: 'User is not authorized'
    });
  }

  next();
};

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization
};
