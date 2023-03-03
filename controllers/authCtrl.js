import bcrypt from "bcrypt"; //password encryption
import jsonwebtoken from "jsonwebtoken"; //user authorization
import UserModel from "../models/User.js";

export const register = async (req, res) => {
  const {
    firstName,
    lastName,
    friends,
    email,
    password,
    picturePath,
    location,
    occupation,
  } = req.body;

  const salt = await bcrypt.genSalt(); //create "salt"
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    firstName,
    lastName,
    friends,
    email,
    password: passwordHash, //don't save the original password in the db
    picturePath,
    location,
    occupation,
    //dummy values
    viewedProfile: Math.floor(Math.random() * 10000),
    impressions: Math.floor(Math.random() * 10000),
  });

  //«Promise,undefined,void» Returns undefined if used with callback or a Promise otherwise.
  const savedUser = await newUser.save({
    validateBeforeSave: true,
  });

  return res.status(201).json(savedUser); //return the saved user to the front-end - best practice
};

//User login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Passwords do not match." });
    }

    //passwords match - create jwt
    const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET);
    //delete password before returning user document to front-end
    delete user.password;

    return res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
  }
};
