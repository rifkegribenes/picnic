const User = require('../models/user');
const helpers = require('../utils/index');

//= =======================================
// User Routes
//= =======================================
exports.viewProfile = (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(400).json({ message: 'No user found.' });
    } else if (user) {
      // Respond with JWT and user object
      const userInfo = helpers.setUserInfo(user);
      const token = helpers.generateToken(userInfo);
      return res.status(201).json({
        token,
        user
      });
    } else {
      return res.status(400).json({ message: 'No user found.' });
    }

  });
};

exports.partialProfile = (req, res, next) => {
  const userId = req.params.userId;
  console.log('user.ctrl.js > 30');
  console.log(userId);
  if (userId) {
    User.findById(userId)
      .exec()
      .then((user) => {
          // Respond with first name and avatar from user object
          const userInfo = helpers.setUserInfo(user);
          return res.status(201).json({
            avatarUrl: user.profile.avatarUrl,
            firstName: user.profile.firstName,
            ownerId: user._id
          });
       })
      .catch((err) => {
          console.log('user.ctrl.js > 44');
          console.log(err);
          return res.status(400).json({ message: 'No user found.' });
       });
  } else {
    return next;
  }

};

exports.updateProfile = (userObj, req, res, next) => {
  const userId = req._id;

  const target = {
    _id: req.body._id
  };

  // kick off promise chain
  new Promise( (resolve, reject) => {

    // make sure the requesting user ID and target user ID match
    if (target._id.toString() === req.params.userId.toString()) {
      resolve(target);
    } else {
      reject('Error: user ID mismatch.');
    }

  })
  .then( () => {
    const email = req.body.profile.email;

    // if updating email, first check that it is unique
    User.findOne({ 'profile.email': email, _id: {$ne: target._id} })
    .then( (existingUser) => {
      if (existingUser) {
            return res.status(422).send({ message: 'Oops! Looks like you already have an account with that email address. Please try logging in with that address.' });
        } else { // email is unique
          // map enumerable req body properties to updates object
          const updates = { ...req.body };
          // return updated document rather than the original
          const options = { new: true };

          User.findOneAndUpdate(target, updates, options)
            .exec()
            .then( user => {
              if (!user) {
                return res
                  .status(404)
                  .json({message: 'User not found!'});
              } else {
                // add logic here to send new verification email if email is changed
                // and return this message to client
                return res
                  .status(200)
                  .json({
                    message: 'User updated!',
                    user
                });
              }
            });
        }
      })
    .catch( err => {
      return res
        .status(400)
        .json({ message: err});
      });
  })
  .catch( err => {
    return res
      .status(400)
      .json({ message: err});
  });

}

// REFRESH USER TOKEN
//   Example: GET >> /api/refresh_token
//   Secured: yes, valid JWT required
//   Expects:
//     1) '_id' from JWT
//   Returns: user profile and new JWT on success
//
exports.refreshToken = (req, res) => {
  const userId = req.token._id;

  User.findById(userId)
    .exec()
    .then( user => {

      // generate a token
      const token = helpers.generateToken(user);

      // return the user profile & JWT
      return res
        .status(200)
        .json({
            profile : user,
            token   : token
        });

      })
    .catch( err => {
        return res
          .status(400)
          .json({ message: err});
    });

}