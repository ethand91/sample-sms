import formidable from 'formidable';
import fs from 'fs';
import User from './../models/user.model';
import extend from 'lodash/extend';
import errorHandler from './../helpers/dbErrorHandler';
import profileImage from './../../client/assets/images/profile-pic.png';

const create = async (req, res) => {
  const user = new User(req.body);
  console.log(user);

  try {
    await user.save();

    return res.status(200).json({
      message: 'Succesfully signed up!'
    });
  } catch (error) {
  console.error(error);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const list = async (req, res) => {
  try {
    const users = await User.find().select('name email updated created');
    res.json(users);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const userById = async (req, res, next, id) => {
console.log('get user by id ' + id);
  try {
    const user = await User.findById(id)
      .populate('following', '_id name')
      .populate('followers', '_id name')
      .exec();

console.log(user);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    req.profile = user;
    next();
  } catch (error) {
  console.error(error);
    return res.status(400).json({
      error: 'Could not retrieve user'
    });
  }
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  return res.json(req.profile);
};

const update = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Photo could not be uploaded'
      });
    }

    let user = req.profile;
    user = extend(user, fields);
    user.updated = Date.now();

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    try {
      await user.save();
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    } catch (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error)
      });
    }
  });
};

const remove = async (req, res) => {
  try {
    const user = req.profile;
    const deletedUser = await user.remove();
    
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;

    res.json(deletedUser);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    });
  }
};

const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set('Content-Type', req.profile.photo.contentType);

    return res.send(req.profile.photo.data);
  }

  next();
};

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + profileImage);
};

const addFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId }});
    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    });
  }
};

const addFollower = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId }}, { new: true });

    result.hashed_password = undefined;
    result.salt = undefined;
    res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    });
  }
};

const removeFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId }});
    next();
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    });
  }
};

const removeFollower = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: res.body.userId }}, { new: true })
      .populate('following', '_id name')
      .populate('followers', '_id name')
      .exec();

      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    });
  }
};

const findPeople = async (req, res) => {
  const following = req.profile.following;
  following.push(req.profile._id);

  try {
    const users = await User.find({ _id: { $nin: following } }).select('name');
    res.json(users);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    });
  }
};

export default {
  create,
  userById,
  read,
  list,
  remove,
  update,
  photo,
  defaultPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople
};
