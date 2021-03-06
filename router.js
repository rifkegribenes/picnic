const APP_HOST = process.env.APP_HOST;
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : 'localhost:3000';

const AuthController = require('./app/controllers/auth.ctrl');
const UserController = require('./app/controllers/user.ctrl');
const StaticController = require('./app/controllers/static.ctrl');
const ParkController = require('./app/controllers/park.ctrl');
const YelpController = require('./app/controllers/yelp.ctrl');

const express = require('express');
const passport = require('passport');
const Auth = require('./app/config/auth');
const helpers = require('./app/utils/index');

/* =========================== ROUTE MIDDLEWARE ============================ */

// Checks whether user has verified their email.
// If `verified: false`, bail out early.
const checkVerified = (req, res, next) => {
  const verifiedErrMsg = 'You need to verify your email before you can access this resource.\nPlease visit your Profile and generate a new verification email.';

  if (!req.user.verified) {
    return res
      .status(400)  // bad request
      .json({ message : verifiedErrMsg });
  } else {
    next();
  }
}

const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false },
    (err, user, info) => {
      if (err) {
        return res.status(422).send({ success : false, message : err.message });
      }
      if (!user) {
        return res.status(422).send({ success : false, message : 'Sorry, you must log in to view this page.' });
      }
      if (user) {
        // const userInfo = helpers.setUserInfo(user);
        req.login(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          } else {
            return next(user);
          }
        }); // req.login
      }
    })(req, res, next);
  };

const requireLogin = (req, res, next) => {
  passport.authenticate('local', { session: false },
    (err, user) => {
      if (err) {
        return res.status(422).send({ success : false, message : err.message });
      }

      if (!user) {
        return res.status(422).send({ success : false, message : 'Login error: Authentication Failed.' });
      }

      if (user) {
        const userInfo = helpers.setUserInfo(user);
        req.login(user, loginErr => {
          if (loginErr) {
            return next(loginErr);
          }
          return res.status(200).send({
            token: helpers.generateToken(userInfo),
            user
          });
        }); // req.login
      }
    }
  )(req, res, next);
};

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router(),
    parkRoutes = express.Router();

  app.use(passport.initialize());
  app.use(passport.session());

// ============================================================================
// AUTHENTICATE ===============================================================
// ============================================================================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Registration route
  authRoutes.post('/register', AuthController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthController.login);

  // Handle requests for password reset (generate/send token)
  // Returns fail status + message -or- success status + message
  apiRoutes.post('/sendresetemail', AuthController.sendReset);

  // Handle password resets
  // Returns fail status + message -or- success status + message
  apiRoutes.post('/resetpassword', AuthController.resetPass);

  // Handle requests for new verification email (generate/send token)
  // Returns fail status + message -or- success status + message
  apiRoutes.post('/sendverifyemail', AuthController.sendVerify);

  // Handle email verification links
  // Toggle user's `verified` property to `true`.
  // Returns fail status + message -or- user object & JWT
  authRoutes.post('/verify', AuthController.verifyEmail);

  // Facebook authentication with passport
  authRoutes.get('/facebook',
    passport.authenticate('facebook', {scope:['public_profile', 'email']} ));

  // Handle callback after Facebook auth
  // return user object and fb token to client
  // need to handle login errors client-side here if redirected to login
  authRoutes.get('/facebook/callback',
    passport.authenticate('facebook'), AuthController.socialAuthCallback
    );

  // Github authentication with passport
  authRoutes.get('/github',
    passport.authenticate('github', {scope : ['profile', 'email']} ));

  // Handle callback after Github auth
  // return user object and fb token to client
  // need to handle login errors client-side here if redirected to login
  authRoutes.get('/github/callback',
    passport.authenticate('github'), AuthController.socialAuthCallback
    );

  // Google authentication with passport
  authRoutes.get('/google',
    passport.authenticate('google', {scope : ['profile', 'email']} ));


  // Handle callback after Github auth
  // return user object and fb token to client
  // need to handle login errors client-side here if redirected to login
  authRoutes.get('/google/callback',
    passport.authenticate('google'), AuthController.socialAuthCallback
    );

  //= ========================
  // User Routes
  //= ========================

  apiRoutes.get('refresh_token', UserController.refreshToken);

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);

  // View user profile route
  // Returns fail status + message -or- user object
  userRoutes.get('/:userId', UserController.viewProfile);

  // Get partial user profile route (unsecured)
  // Returns fail status + message -or- username only
  userRoutes.get('/partial/:userId', UserController.partialProfile);

  // Update a user's profile.
  // Returns fail status + message -or- updated user object
  userRoutes.put('/:userId', requireAuth, UserController.updateProfile);


  //= ========================
  // Park Routes
  //= ========================

  // Set park routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/park', parkRoutes);

  // Get all parks by city
  // Returns fail status + message -or- array of all parks
  parkRoutes.get('/allparks/:city', YelpController.getParks);

  // View a single park
  // Returns fail status + message -or- park object
  parkRoutes.get('/:parkId', ParkController.viewParkByYelpId);

  // Get guestlist for a park by yelpId
  // Returns fail status + message -or- guestlist
  parkRoutes.get('/guestlist/:parkId', ParkController.getGuestListByYelpId);

  // Check in to (or out of) a park
  // Returns fail status + message -or- park object & user
  parkRoutes.put('/checkin/:parkId/:userId', ParkController.updateGuestList);


  // Set url for API group routes
  app.use('/api', apiRoutes);

  // Catch client-side routes that don't exist on the back-end.
  // Redirects to /#/redirect={route}/{optional_id}
  app.get('/:client_route/:id?', StaticController.redirectHash);

};