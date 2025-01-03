const jwt = require('jsonwebtoken');
const { connectDB, client } = require('../config/db'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './.env.local' }); // Load environment variables from .env.local in the same directory

const secretKey = process.env.JWT_SECRET; // Use environment variables for sensitive data
console.log(secretKey, "secretKey");



async function login(email, password) {
  console.log('Login function inside authService');
  await connectDB(); 
  const db = client.db();
  const users = db.collection('users');
  console.log(users, "users");
  const user = await users.findOne({ email });
 console.log("Found the user and that is very good");
  if (!user) {
    console.log('User not found inside authService');
    throw new Error('User not found');
  }
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  console.log(isPasswordValid, "isPasswordValid");
  if (!isPasswordValid) {
    console.log('Invalid password inside authService');
    throw new Error('Invalid password');
  }
  console.log("Token is being generated, for the user", user);
console.log("Token is being generated");
  const token = jwt.sign({ userId: user._id, email, userName: user.userName, profilePicture : user.profilePicture, friends : user.friends, friendRequests : user.friendRequests, sentFriendRequests : user.sentFriendRequests }, secretKey, { expiresIn: '1h' });
  console.log("Token is generated", token);
  return token;
}

async function logout() {
  // Clear the cookie containing the token
  return { message: 'Logout successful' };
}





// Signup function
async function signup(email, userName, password) {
  console.log('Signup function inside authService');
  const db = await connectDB(); // Ensure the database is connected
  if (!db) {
    throw new Error('Failed to connect to the database');
  }



  try {
    const user = await db.collection('users').findOne({
      $or: [{ email }, { userName }]
    });
    if (user) {
      throw new Error('User already exists');
    }
       const hashedPassword = await bcrypt.hash(password, 10);
       const profilePicture = 'potionProfilePicture';
        const friends = [];
        const friendRequests = [];
        const sentFriendRequests = [];
       joinedDate = new Date();
    const result = await db.collection('users').insertOne({ email, userName, hashedPassword, profilePicture, friends, friendRequests, sentFriendRequests, joinedDate });
    console.log('User inserted:', result);
    return result;
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
  
}

async function verifyToken(req, res, next) {
  try {
    console.log("verifyToken function inside authService");
console.log("req", req);
    const token = req.cookies.token || req.headers.authorization;
    console.log("yesssssssss");
    console.log(token, "token in verifyToken");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, secretKey);

    await connectDB(); 
    const db = client.db();
    const users = db.collection('users');
    console.log(users, "users");
    const user = await users.findOne( decoded.userId );
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}


module.exports = {
  login,
  signup,
  verifyToken,
  logout,
};