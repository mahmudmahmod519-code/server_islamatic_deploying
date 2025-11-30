const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../module/db");
const jwt = require("jsonwebtoken");


passport.use(new GoogleStrategy({
    clientID: process.env.AOUTH_CLIENT_ID,
    clientSecret: process.env.AOUTH_CLIENT_SECURE,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const image_url = profile.photos[0].value;
      const first_name = profile.name.givenName;
      const last_name = profile.name.familyName;

      const [rows] = await db.query("SELECT * FROM Users WHERE email=?", [email]);

      let user;
      if (rows.length > 0) {
        user = rows[0];
      } else {
        let permission="user"
        if(email==="ahg30405060@gmail.com")permission="admin";
        const [insertResult] = await db.query(`
          INSERT INTO Users (first_name, last_name, email, image_url, provider, role)
          VALUES (?, ?, ?, ?, 'google',?)
        `, [first_name, last_name, email, image_url,permission]);

        user = { id: insertResult.insertId, first_name, last_name, email };
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      done(null, { token, user });
    } catch (err) {
      done(err, null);
    }
  }
));
