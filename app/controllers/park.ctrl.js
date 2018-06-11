const Park = require('../models/park');
const User = require('../models/user');
const helpers = require('../utils/index');

// Get all parks
exports.getAllParks = (req, res, next) => {
  console.log('getAllParks');
  Park.find( (err, parks) => {

    if (err) { return handleError(res, err); }
    return res.status(200).json({parks});
  });
};

// Get all parks for a specific user
exports.getUserParks = (req, res, next) => {
  console.log(req.params.userId);
  Park.find({ ownerId: req.params.userId })
    .sort({_id: -1})
    .then((parks) => {
      return res.status(200).json({parks});
    })
    .catch((err) => {
      console.log('park.ctrl.js > catch block 25');
      console.log(err);
      return handleError(res, err);
    }); // catch (Park.find)
};

// Get a single park by id
exports.viewParkByYelpId = (req, res, next) => {
  Park.find({ parkId: req.params.parkId })
    .then((park) => {
      if (park) {
        return res
          .status(200)
          .json({
            message: 'Existing park retrieved',
            park
          });
        } else {
          return next;
        }
    })
    .catch(err => {
      console.log('catch block park.ctrl.js > 46');
      console.log(err);
      return handleError(res, err);
    });
};

// Create a new park
exports.newPark = (user, req, res, next) => {
  if (!user) {
    console.log('no user returned from reqireAuth (park.ctrl.js > 43)');
    return res.status(422).json({ message: 'You must be logged in to create a new park.' });
  } else {
    console.log('park.ctrl.js > 46');
    console.log(user._id);

    const body = {
      question: req.body.question,
      options: [ ...req.body.options ],
      ownerId: user._id,
      ownerName: `${user.profile.firstName} ${user.profile.lastName}`,
      ownerAvatar: helpers.avatarFormula(user)
    }
    // check if park question is unique
    Park.findOne({ question: req.body.question })
      .then( (existingPark) => {
        // If park is not unique
        if (existingPark) {
          return res.status(422).send({ message: 'Oops! A park with that question already exists. Please try again with a different question.' });
          } else {
            // if not, park question is unique; create new park
            Park.create(body, (err, park) => {
              if (err) {
                return handleError(res, err);
              } else {
                return res.status(201).json({ user, park });
              }
            });
          }
      }) // then (Park.findOne)
      .catch( (err) => {
        console.log('park.ctrl.js > catch block 71');
        console.log(err);
        return next(err);
      }); // catch (Park.findOne)
    }
}; // newPark

// Update an existing park.
exports.updatePark = (user, req, res, next) => {
  const parkId = req.body._id;

  const target = {
    _id: parkId
  };

  // kick off promise chain
  new Promise( (resolve, reject) => {
    // Must be park owner or site admin to update
    if (req.body.ownerId.toString() === user._id.toString() || user.role === 'admin') {
      resolve(target);
    } else {
      reject({message: 'You do not have permission to update this park.'});
    }

  })
  .then( () => {
    // map enumerable req body properties to updates object
    if (req.body._id) { delete req.body._id };
    const updates = { ...req.body };

    updates.ownerId = user._id;
    updates.ownerName = `${user.profile.firstName} ${user.profile.lastName}`;
    updates.ownerAvatar = helpers.avatarFormula(user);

    // return updated document rather than the original
    const options = { new: true };
    Park.findOneAndUpdate(target, updates, options)
      .exec()
        .then((park) => {
          if (!park) {
            return res
              .status(404)
              .json({message: 'Park not found'});
          } else {
            return res
              .status(200)
              .json({
                message: 'Park updated successfully',
                user,
                park
            });
          }
        })
        .catch(err => {
          console.log('catch block park.ctrl.js > 115');
          console.log(err);
          return handleError(res, err);
        });

    })
  .catch(err => {
    console.log('catch block park.ctrl.js > 121');
    console.log(err);
    return handleError(res, err);
  });
};

// add user to park
exports.checkIn = (req, res, next) => {
  const { parkId, userId } = req.params;
  const target = {
    _id: parkId
  };
  if (req.body._id) { delete req.body._id };
  const updates = { ...req.body };
  const options = { new: true };

  // add user ID to guests array
  updates.guests.push(userId);

  Park.findOneAndUpdate(target, updates, options)
    .exec()
    .then((park) => {
      if (!park) {
        return res
          .status(404)
          .json({message: 'Park not found'});
      } else {
        return res
          .status(200)
          .json({
            message: 'User checked in successfully',
            park
          });
      }
    })
    .catch(err => {
      console.log('catch block park.ctrl.js > 178');
      console.log(err);
      return handleError(res, err);
    });
};

exports.GuestLists = function(req, res, next){
  const userId = req.params.userId;
  const parkId = req.params.parkId;
  // if user is not logged in, skip of going through the database
  if (userId !== 'null'){
    User.findOne({ _id: userId}, (err, existingUser) => {
      if (err) { handleError(res, err) }
      if (existingUser.parks.includes(parkId)){
        console.log('current user is checked in')
        return res.send({'isCurrentUserCheckedIn': true})
      } else {
        console.log('current user is not checked in')
        return res.send({'isCurrentUserCheckedIn': false})
      }
    })
  } else{
    res.send({'message' : 'user is not logged in'})
    next()
  }
}

// add or remove a user from a park guest list
exports.UpdateGuestList = (req, res, next) => {
  console.log('UpdateGuestList');
  const { parkId, userId } = req.params;

  Park.findOne({ parkId: parkId })
    .then((existingPark) => {
      // if parkId exists
      if (existingPark) {
        const target = {
          parkId: parkId
        };
        const options = { new: true };
        // if current user is already in the guests array, remove it
        if (existingPark.guests.includes(userId)) {
          console.log('Remove user from guestlist')
          const updates = { $pull: {guests: userId} };
          Park.findOneAndUpdate(target, updates, options)
            .exec()
            .then((park) => {
              if (!park) {
                return res
                  .status(404)
                  .json({message: 'Park not found'});
              } else {
                return res
                  .status(200)
                  .json({
                    message: 'User removed successfully',
                    park
                  });
              }
            })
            .catch(err => {
              console.log('catch block park.ctrl.js > 231');
              return handleError(res, err);
            });
        } else {
          //if current user not in guests array, add it
          console.log('Add user to guestlist')
          const updates = { $push: {guests: userId} };
          Park.findOneAndUpdate(target, updates, options)
            .exec()
            .then((park) => {
              if (!park) {
                return res
                  .status(404)
                  .json({message: 'Park not found'});
              } else {
                return res
                  .status(200)
                  .json({
                    message: 'User added successfully',
                    park
                  });
              }
            })
            .catch(err => {
              console.log('catch block park.ctrl.js > 255');
              return handleError(res, err);
            });
        }
      } else {
        console.log('park does not exist in db');
        // If parkId does not exist, create park, check in current user, save
        const park = new Park({
          parkId: parkId,
          guests: [userId]
        })
        console.log(park);

        park.save()
          .then((park) => {
            console.log('new park saved');
            console.log(park);
            return res
              .status(200)
              .json({
                message: 'Park saved successfully',
                park
              });
          })
          .catch((err) => {
            console.log('error at line 280 park.ctrl.js');
            return handleError(res, err);
          });
        }
    }) // Park.findOne .then
    .catch((err) => {
      console.log('error at line 286 park.ctrl.js');
      return handleError(res, err);
    });
}

// Deletes a park from the DB.
exports.deletePark = (user, req, res, next) => {
  Park.findOne({ _id: req.params.parkId })
    .then((park) => {
      if (!park) {
        console.log('park.ctrl.js > 195: Park not found');
        return res.status(404).json({message: 'Park not found.'});
      } else {
        // Only owners and admins can delete
        if (park.ownerId.toString() === user._id.toString() ||
          user.role === 'admin') {
          park.remove((err) => {
            if (err) {
              return handleError(res, err);
            } else {
              console.log('park.ctrl.js > 203');
              return res.status(204).json({message: 'Park was successfully deleted.'});
            }
          });
        } else {
          return res.status(403).json({message: 'You do not have permission to delete this item.'});
        }
      }
  })
  .catch((err) => {
      console.log('park.ctrl.js > 190');
      console.log(err);
      return handleError(res, err);
    });
}

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}
