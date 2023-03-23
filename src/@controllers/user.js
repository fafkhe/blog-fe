import Models from "@models";
import AppError from "@lib/appError";
import authorizeUser from "@lib/auth/authorize-user";

const { User } = Models;

const filterObj = (obj, ...allowedfields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedfields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const jixfilter = (obj, unallowedFields = []) => {
  const result = JSON.parse(JSON.stringify(obj));

  unallowedFields.forEach((item) => {
    delete result[item];
  });

  return result;
};

export default {
  signUp: async (req, res, next) => {
    if (!req.body.name || !req.body.email)
      throw new AppError("bad request: name and email are required", 400);

    const thisUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: "1111",
      imgurl: null,
    });

    const token = thisUser._createToken();
    await thisUser.save();

    res.status(201).json({
      token,
    });
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!password || !email)
        throw new AppError("bad request: password and email are required", 400);

      const thisUser = await User.findOne({ email });

      thisUser._checkPassword(password);
      const token = thisUser._createToken();

      res.status(201).json({
        token,
      });
    } catch (error) {
      res.status(400).json({
        msg: error.message,
      });
    }
  },
  me: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user);

    // Blog.create({
    //   userId: String(thisUser._id)
    // })

    res.status(200).json(thisUser);
  },

  updateMe: async (req, res, next) => {
    const thisUser = await authorizeUser(req.user); 

    const { name, bio } = req.body;

    if (!name || !bio)
      throw new AppError("bad request: insufficient fields", 400);

    await User.findByIdAndUpdate(thisUser._id, { $set: { name, bio } });

    res.status(200).json({
      status: "success",
      msg: "successfully updated your data",
    });
  },
  getAllUser: async (req, res, next) => {
    const AlUser = await User.find({})
    res.status(200).json({
      status: "success",
      data: {
        AlUser
      }
    })
  },
  singleUser: async (req, res, next) => {
    const SingleUser = await User.findById(req.params._id);

    if (!SingleUser) {
      throw new AppError("no such user exists", 404);
    }

    res.status(200).json({
      status: "success",
      data: {
        SingleUser,
      },
      msg: "successfully ",
    });
  },
};
