const userModel = require("../Models/user.model");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function register(req, res) {
  const { username, email, password } = req.body;

  const isExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isExist) {
    return res.status(409).json({
      msg: "user already exist with name and email",
    });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = JWT.sign(
    {
      id: user._id,
      name: user.username,
    },
    process.env.JWT_KEY,
  );

  res.cookie("token", token);
  res.status(201).json({
    msg: "user register..",
    user: {
      username,
      email,
    },
  });
}

async function login(req, res) {
  const { username, password, email } = req.body;

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(404).json({
      msg: "invalid username",
    });
  }

  const hash = await bcrypt.hash(password, 10);
  const invalid = bcrypt.compare(hash, user.password);

  if (!invalid) {
    return res.status(409).json({
      msg: "password is invalid",
    });
  }

  const token = JWT.sign(
    {
      id: user._id,
      name: user.username,
    },
    process.env.JWT_KEY,
  );

  res.cookie("token", token);
  res.status(200).json({
    msg: "successfully login",
    user: {
      user: user.username,
      email: user.email,
    },
  });
}

module.exports = { register, login };
