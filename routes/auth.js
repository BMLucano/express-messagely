"use strict";

const Router = require("express").Router;
const router = new Router();
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const SECRET_KEY = require("./config");
const { BadRequestError } = require("../expressError");

/** POST /login: {username, password} => {token} */

router.post("/login", async function(req, res, next){
  //check for body
  //get user name and password from body
  //call User.authenticate with given username/password
    //if true, sign token and return it
  if (req.body === undefined) throw new BadRequestError();
  const { username, password } = req.body;

  if(await User.authenticate(username, password)){
    const token = jwt.sign({ username }, SECRET_KEY);
    User.updateLoginTimestamp(username);
    return res.json({ token });
  }

  throw new UnauthorizedError("Invalid user/password");

})

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

module.exports = router;