const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async (token) => {
  try {
    // verify token
    const googleUser = await verifyAuthToken(token);
    // check if exists return, otherwise create
    const user = await checkIfUserExists(googleUser.email);

    return user ? user : createNewUser(googleUser);
  } catch (error) {
    console.error(error);
  }
};

const verifyAuthToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID
    });

    return ticket.getPayload();
  } catch (error) {
    console.error("Error verify token ", error);
  }
};

const checkIfUserExists = async (email) => {
  try {
    await User.findOne({ email }).exec();
  } catch (error) {
    console.log(error);
  }
};

const createNewUser = (googleUser) => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return new User(user).save();
};
