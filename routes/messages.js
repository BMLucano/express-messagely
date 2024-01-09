"use strict";

const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");

const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const Message = require("../models/message");

const { BadRequestError } = require("../expressError");


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Makes sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", ensureCorrectUser, async function (req, res, next) {
  const response = await Message.get(req.params.id);
  return res.json({ message: response });
});


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async function (req, res, next) {
  //req.user.username??
  //or just res.locals.user??

  let from_user = res.locals.user.username;
  let to_username = req.body.to_username;
  let body = req.body.body;


  if (await User.get(to_username)) {
    const response = await Message.create({ from_user, to_username, body });

    return res.json({ message: response });
  };
});



/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/


module.exports = router;