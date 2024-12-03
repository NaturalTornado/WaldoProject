const express = require('express');
const passport = require('passport');
const {
    renderHomePage,
    renderSignUpForm,
    handleSignUp,
    renderLogInForm,
    handleLogOut,
    upgradeToMember,
} = require('../controllers/waldoController');

const router = express.Router();

// Home page route
router.get('/', renderHomePage);

// Membership upgrade route
router.post('/become-a-member', upgradeToMember);

// Sign-up form route
router.get('/sign-up', renderSignUpForm);

// Handle user sign-up
router.post('/sign-up', handleSignUp);

// Log-in form route
router.get('/log-in', renderLogInForm);

// Handle user log-out
router.get('/log-out', handleLogOut);

// Handle user log-in
router.post(
    '/log-in',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/log-in',
        failureFlash: false,
    })
);

module.exports = router;
