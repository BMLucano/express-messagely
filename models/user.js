"use strict";

const db = require("../db")
const { NotFoundError } = require("../expressError")
/** User of the site. */

class User {

  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
  }

  /** Authenticate: is username/password valid? Returns boolean. */

  static async authenticate(username, password) {
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {
    const results = await db.query(
      `SELECT username, first_name, last_name
        FROM users
        ORDER BY last_name, first_name`
    );
    const users = results.rows;

    return results.json({users});
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at
        FROM users
        WHERE username = $1`,
        [username]
    )
    const user = result.rows[0];

    if(!user) throw new NotFoundError(`No user mathing username: ${username}`);

    return result.json({ user })
  }

  /** Return messages from this user.
   *
   * [{id, to_user: {username: 'b-l', first_name: 'brandie'}, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {

    // First query gets all messages from a given username
    // returns an array of messages
    // for each message, we want to show which user that message was sent to

    // [
    // {1, to_user: {username: 'b-l' ...} ...}
    // {2, to_user: {username: 'v-k' ...}}
    //]

    const results = await db.query(
      `SELECT m.id,
              m.to_username,
              m.body,
              m.sent_at,
              m.read_at,
              u.username,
              u.first_name,
              u.last_name,
              u.phone
        FROM messages AS m
        JOIN users AS u
        ON u.username = m.to_username
        WHERE from_username = $1`,
        [username]
    );

    const messages = results.rows

  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
  }
}


module.exports = User;
