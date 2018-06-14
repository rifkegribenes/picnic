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

// fetch guestList for specific park by parkId
exports.getGuestListByYelpId = function(req, res, next){
  const parkId = req.params.parkId;

  Park.findOne({ parkId: parkId })
    .then(park => {
      if (park) {
        return res
          .status(200)
          .json({
            parkId,
            guestList: park.guestList }
            );
      } else {
        return res
          .status(200)
          .json({
            parkId,
            guestList: [] }
            );
      }
    })
    .catch(err => {
      console.log('catch block park.ctrl.js > 122');
      return handleError(res, err);
    });
}

// add or remove a user from a park guest list
exports.updateGuestList = (req, res, next) => {
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
        // if current user is already in the guestList array, remove it
        if (existingPark.guestList.includes(userId)) {
          console.log('Remove user from guestlist')
          const updates = { $pull: {guestList: userId} };
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
                    guestList: park.guestList,
                    parkId
                  });
              }
            })
            .catch(err => {
              console.log('catch block park.ctrl.js > 231');
              return handleError(res, err);
            });
        } else {
          //if current user not in guestList array, add it
          console.log('Add user to guestlist')
          const updates = { $push: {guestList: userId} };
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
                    guestList: park.guestList,
                    parkId
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
          guestList: [userId]
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
                guestList: park.guestList,
                parkId
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

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}
