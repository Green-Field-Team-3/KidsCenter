const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
     return jwt.sign({ id }, "stack", {});
};

module.exports = {
     signin: async (req, res, next) => {
          const { username, password } = req.body;

          try {
               const loggedInUser = await User.login(username, password);

               // i did not want to return user, because, I could not show the hashed password to the client
               // that's why I created a new variable called foundUser
               const foundUser = await User
                    .findByIdAndUpdate(loggedInUser._id, { connected: true }, { new: true })

               const token = createToken(foundUser._id);
               res.cookie("jwt", token, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 });

               res.status(201).json(foundUser);
          } catch (error) {
               if (error === "Username not exist") res.json("Username not exist");
               else res.json("Incorrect username/password");
          }
     },
     signup: async (req, res, next) => {
          const { username, fullName, email, address, category, password, city } = req.body;
          try {
               const savedUser = await User.create({
                    category,
                    fullName,
                    username,
                    email,
                    password,
                    address,
                    city
               });

               const foundUser = await User
                    .findById(savedUser._id)
                    .select("-password");

               res.status(201).json(foundUser);
          } catch (error) {
               res.status(400).json(simplify(error));
          }
     },
     logout: async (req, res, next) => {
          // logout
     },
};
