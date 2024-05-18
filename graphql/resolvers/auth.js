const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');
const { uploadFromBuffer } = require('../../cloudinary');

const User = require('../../models/User');
const Exercise = require('../../models/Exercise');
const Routine = require('../../models/Routine');
const Workout = require('../../models/Workout');

const ObjectId = require('mongoose').Types.ObjectId;

async function creatDefaultData(uid) {
  // await Exercise.deleteMany({});
  // await Routine.deleteMany({});
  // await Workout.deleteMany({});

  let exercises = await Exercise.insertMany([
    {
      name: "Flat Push-ups",
      type: 0,
      user: new ObjectId(uid)
    },
    {
      name: "Incline Push-ups",
      type: 0,
      user: new ObjectId(uid)
    },
    {
      name: "Decline Push-ups",
      type: 0,
      user: new ObjectId(uid)
    },
    {
      name: "Dips",
      type: 0,
      user: new ObjectId(uid)
    },
    {
      name: "Pull-ups",
      type: 0,
      user: new ObjectId(uid)
    },

    {
      name: "Back Squats",
      type: 0,
      user: new ObjectId(uid)
    },
    {
      name: "Jump Squats",
      type: 0,
      user: new ObjectId(uid)
    },
    {
      name: "Leg Press",
      type: 0,
      user: new ObjectId(uid)
    },
    {
      name: "Leg Extensions",
      type: 0,
      user: new ObjectId(uid)
    },
    {
      name: "Leg Curls",
      type: 0,
      user: new ObjectId(uid)
    },
    {
      name: "Dumbbell Lunges",
      type: 0,
      user: new ObjectId(uid)
    },
    {
      name: "Dumbbell Deadlift",
      type: 0,
      user: new ObjectId(uid)
    },
    {
      name: "Straight Leg Deadlift",
      type: 0,
      user: new ObjectId(uid)
    },
  ]);

  await Routine.create({
    name: "Body Weight - Chest Workout",
    color: "#2ECC71",
    exercises: [
      {
        superset: [
          ...exercises.slice(0, 2).map(e => ({ exId: new ObjectId(e._id) }))
        ]
      },
      ...exercises.slice(3, 5).map(e => ({ exId: new ObjectId(e._id) })),
    ],
    user: new ObjectId(uid)
  })

  await Routine.create({
    name: "Superset Legs",
    color: "#ff2e2e",
    exercises: [
      {
        superset: [
          ...exercises.slice(5, 7).map(e => ({ exId: new ObjectId(e._id) }))
        ],
      },
      {
        superset: [
          ...exercises.slice(7, 9).map(e => ({ exId: new ObjectId(e._id) }))
        ]
      },
      {
        superset: [
          ...exercises.slice(9, 11).map(e => ({ exId: new ObjectId(e._id) }))
        ],
      },
      {
        superset: [
          ...exercises.slice(11, 13).map(e => ({ exId: new ObjectId(e._id) }))
        ]
      }
    ],
    user: new ObjectId(uid)
  })

}


class userError extends Error {
  constructor(args) {
    super(args);
    let userInput = args

    this.name = "errors"
    this.message = userInput
    if (args?.code === 11000) {
      this.message = { [Object.keys(args.keyPattern)[0]]: 'already in use' };
    }
  }
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.use("compile", hbs({
  viewEngine: {
    partialsDir: "./views/",
    defaultLayout: ""
  },
  viewPath: "./views/",
  extName: ".hbs"
}));

const baseUrl = process.env.BASE_URL;


const sendActivationUrl = user => {
  const verificationToken = user.generateVerificationToken();
  const url = `${baseUrl}/verify/${verificationToken}`;

  transporter.sendMail({
    to: user.email,
    subject: 'Strength - Verify Account',
    template: 'verify',
    context: {
      fullName: user.fullName,
      url
    }
  })
}

const sendPasswordResetUrl = user => {
  const pwResetToken = user.generateResetPasswordToken();
  const url = `${baseUrl}/password-reset/confirm/${pwResetToken}`;

  transporter.sendMail({
    to: user.email,
    subject: 'Strength - Recover Account',
    template: 'pw-reset',
    context: {
      fullName: user.fullName,
      url
    }
  })
}

module.exports = {
  createUser: async args => {
    try {
      const { username, fullName, email, password } = args.userInput
      let errors = {}

      let existingUsers = await User.find({ $or: [{ email }, { username }] }).limit(2);

      if (existingUsers.length > 0) {
        if (Object.keys(existingUsers).length === 2) {
          errors = {
            email: 'already in use',
            username: 'already in use'
          }
        } else {
          if (existingUsers[0].email === email.toLowerCase())
            errors.email = 'already in use';
          if (existingUsers[0].username === username.replace(/\s/g, '').toLowerCase())
            errors.username = 'already in use';
        }
      }

      if (password.length < 8) {
        errors.password = "Password must contain at least 8 characters"
      }

      if (Object.keys(existingUsers).length) {
        throw { errors };
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        username,
        fullName,
        password: hashedPassword
      });

      const result = await user.save();

      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWTPW, {
        expiresIn: '1h'
      })

      sendActivationUrl(result);

      await creatDefaultData(user.id);

      return {
        ...result._doc,
        token
      }
    } catch (err) {
      console.log(err)
      throw new userError(err.errors);
    }
  },

  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error('Login or password is invalid');
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Login or password is invalid');
      }
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWTPW, {
        expiresIn: '360h'
      });

      return {
        token: token,
        user
      }
    } catch (err) {
      throw err.messages || err;
    }
  },

  getUserData: async (_, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const user = await User.findOne({ _id: req.userId });


      if (!user) {
        throw 'User does not exist!';
      }

      // creatDefaultData( req.userId);

      return user;
    } catch (err) {
      throw new Error(err);
    }
  },

  verifyEmail: async ({ token }) => {
    if (!token) throw 'Invalid';

    try {
      const payload = jwt.verify(token, process.env.JWTPW);

      if (payload.action !== 'verify') {
        throw 'Invalid';
      }

      const user = await User.findOne({ _id: payload.uid });

      if (!user || user.verified === true) {
        throw 'Invalid';
      }

      user.verified = true;
      await user.save();

      return user;
    } catch (err) {
      throw new Error("Invalid");
    }
  },

  resendActivation: async ({ uid }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const user = await User.findOne({ _id: uid });
      if (!user || user.verified === true) {
        throw 'Invalid request';
      }

      sendActivationUrl(user);

      return "sent";
    } catch (err) {
      throw new Error("Invalid request");
    }
  },

  sendPwResetLink: async ({ email }) => {
    try {
      const user = await User.findOne({ email });
      if (!user)
        throw 'Email not found!';
      sendPasswordResetUrl(user);
      return "Email sent";
    } catch (err) {
      throw new Error(err);
    }
  },

  resetPassword: async ({ token, newPassword }) => {
    if (!token) throw 'Invalid';

    try {
      let uid = jwt.decode(token).uid;
      const user = await User.findOne({ _id: uid });

      if (!user) {
        throw 'No user found';
      }

      payload = jwt.verify(token, user.password);

      if (newPassword.length < 8) {
        throw "Password must contain at least 8 characters"
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;

      await user.save();

      return 'Your password has been changed successfully';
    } catch (err) {
      throw new Error("Invalid reset Link or Expired");
    }
  },

  changeProfilePicture: async ({ file }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const user = await User.findOne({ _id: req.userId });
      if (!user)
        throw 'Invalid request';

      const { filename, mimetype, encoding, createReadStream } = await file.promise;

      if (!filename)
        throw 'You must select an Image';

      if (!mimetype.startsWith('image/'))
        throw 'Invalid file type';

      let image = await uploadFromBuffer(req.userId, createReadStream, file);
      user.profilePicture = image.url;
      user.save();

      return image.url;
    } catch (err) {
      // console.log(err)
      throw new Error(err);
    }
  },

  changeProfilePicture2: async ({ file }, { req }) => {
    try {
      if (!req.isAuth)
        throw new Error('Unauthorized');

      const user = await User.findOne({ _id: req.userId });
      if (!user)
        throw new Error('Invalid request');

      const { createReadStream, filename, mimetype } = await file;

      console.log(file)

      if (!filename)
        throw new Error('You must select an Image');

      if (!mimetype.startsWith('image/'))
        throw new Error('Invalid file type');

      // Logic to handle file upload (save to storage, database, etc.)
      // Example:
      const path = `/path/to/save/${filename}`;
      const stream = createReadStream();
      // Write stream to file or process as needed

      // Update user's profile picture
      user.profilePicture = path;
      await user.save();

      return path; // Return path or URL of the saved file
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  },

  updateUserData: async ({ userInput }, { req }) => {
    try {
      if (!req.isAuth)
        throw 'Unauthorized';

      const user = await User.findOne({ _id: req.userId });

      if (!user)
        throw 'User does not exist!';

      const field = Object.keys(userInput)[0];
      let value = userInput[field];

      if (field === "password") {
        if (field.length < 8)
          throw { errors: { password: "Password must contain at least 8 characters" } };
        value = await bcrypt.hash(value, 12);
      }

      if (field === "email" && user.email !== value) {
        user.verified = false;
        sendActivationUrl(user);
      }

      user[field] = value;
      await user.save();

      return user;
    } catch (err) {
      throw new userError(err);
    }
  },
}