"use strict";

const Router = require("express").Router;
const router = new Router();
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const SECRET_KEY = require("./config");
const { BadRequestError } = require("../expressError");

/** POST /login: {username, password} => {token} */

router.post("/login", async function(req, res, next){
  if (req.body === undefined) throw new BadRequestError();

  const { username, password } = req.body;

  if(await User.authenticate(username, password)){
    const token = jwt.sign({ username }, SECRET_KEY);
    User.updateLoginTimestamp(username);
    return res.json({ token });
  }

  throw new UnauthorizedError("Invalid user/password");
});

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post("/register", async function(req, res, next){
  //check for body
  //call user.register
  //sign token with username
  //update logintimestamp
  //return token
  if (req.body === undefined) throw new BadRequestError();

  let user;
  try{
    user = User.register(req.body);
  }catch(err){
    throw new BadRequestError("Username already exists");
  }

  const username = user.username;
  const token = jwt.sign({ username }, SECRET_KEY);
  User.updateLoginTimestamp(username);
  return res.json({ token })

})

module.exports = router;