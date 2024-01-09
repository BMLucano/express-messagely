"use strict";

const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");

const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const Message = require("../models/message");

const { BadRequestError, UnauthorizedError } = require("../expressError");


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
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  const msg = await Message.get(req.params.id);
  let username = res.locals.user.username;

  if(msg.to_user.username !== username && msg.from_user.username !== username){
    throw new UnauthorizedError("Cannot read this message");
  }

  return res.json({ message: msg });
});


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async function (req, res, next) {
  //res.locals.user??
  const currentUser = res.locals.user;

  const from_user = currentUser.username;
  const to_username = req.body.to_username;
  const body = req.body.body;


  if (await User.get(to_username)) {
    const msg = await Message.create({ from_user, to_username, body });

    return res.json({ message: msg });
  };
});



/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", ensureLoggedIn, async function(res, req, next){

  const message = await Message.get(req.params.id);
  const username = res.locals.user.username;

  if(message.to_user.username !== username){
    throw new UnauthorizedError("Cannot read this message");
  }
  const msg = await Message.markRead(req.params.id);

  return res.json({ message: msg });

})


module.exports = router;