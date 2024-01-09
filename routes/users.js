"use strict";

const Router = require("express").Router;
const router = new Router();
const { NotFoundError } = require("../expressError");
const { ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user");
const { ensureLoggedIn } = "../middleware/auth";


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name}, ...]}
 *
 **/
router.get("/", ensureLoggedIn, async function (req, res, next) {
  const results = await User.all();
  return res.json({ users: results });
});


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  const result = await User.get(username);
  return res.json({ user: result });
});


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", ensureCorrectUser, async function (req, res, next) {
  try {
    const results = await User.messagesTo(username);
    return res.json({ messages: results });
  } catch (err) {
    throw new NotFoundError(`User: ${username} not found`);
  }
});


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", ensureCorrectUser, async function (req, res, next){
  try {
    const results = await User.messagesFrom(username);
    return res.json({ messages: results });
  } catch (err) {
    throw new NotFoundError(`User: ${username} not found`);
  }
})

module.exports = router;