const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
//const pool = require('./db/pool'); // Database connection pool
//const prisma = require('./prisma/prismaClient'); // Prisma client
const waldoRouter = require('./routes/waldoRouter');
const tagRouter = require('./routes/tagRouter');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const cors = require('cors');




const adminRouter = require('./routes/adminRouter');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files (photos, JS, CSS)
app.use(
    session({
        secret: 'yourSecretKey', // Replace with a strong secret in production
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/images', express.static('public/images'));


// Passport Local Strategy
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.users.findUnique({ where: { username } });
            if (!user) return done(null, false, { message: 'Incorrect username.' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user.username);
});

// Deserialize user from the session
passport.deserializeUser(async (username, done) => {
    try {
        const user = await prisma.users.findUnique({ where: { username } });
        if (!user) return done(null, false);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Routes
app.use('/', waldoRouter);
app.use('/tags', tagRouter); // New tag routes
app.use('/admin', adminRouter);

app.use(bodyParser.json());

app.use('/tags', (req, res, next) => {
    console.log(`Incoming request to /tags${req.url}`);
    next();
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
