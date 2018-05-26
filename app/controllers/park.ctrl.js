const Park = require('../models/park');
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
exports.viewParkById = (req, res, next) => {
  Park.findById( req.params.parkId,  (err, park) => {
    if (err) { return handleError(res, err); }
    if (!park) { return res.status(404).send({message: 'Error: Park not found'}); }
    return res.status(200).json({park});
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

// add voter to park
exports.vote = (req, res, next) => {
  const { parkId, optionId } = req.params;
  const target = {
    _id: parkId
  };
  if (req.body._id) { delete req.body._id };
  const updates = { ...req.body };
  const options = { new: true };

  // get voter IP
  let voterIP = (req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress).split(",")[0];

  // only allow one vote per IP address
  if (updates.voters.indexOf(voterIP) !== -1) {
    console.log('already voted');
    return res
      .status(404)
      .json({message: 'You have already voted in this park'});
  }

  // add voter IP to voters array
  updates.voters.push(voterIP);

  // map through options and increase votes on matching option
  const parkOptions = [ ...updates.options ];
  updates.options = parkOptions.map((option) => {
    if (option._id === optionId) {
      option.votes++;
      return option;
    } else {
      return option;
    }
  })

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
            message: 'Vote recorded successfully',
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

// reset votes on a park
exports.resetVotes = (req, res, next) => {
  // if(req.body._id) { delete req.body._id; } ????
  Park.findById(req.params.id, function (err, park) {
    if (err) { return handleError(res, err); }
    if(!park) { return res.status(404).send('Not Found'); }

    // Only owners and admins may clear votes
    if(park.owner.toString() === req.user._id.toString() || req.user.role === 'admin') {
      var updated = _.extend(park, req.body);

      updated.voters = [];
      updated.votes = Array.apply(null, Array(updated.votes.length)).map(Number.prototype.valueOf,0);
      updated.totalVotes = 0;
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(park);
      });
    } else {
      return res.status(403).send('You do not have permission to clear votes');
    }
  });
};

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