const admin = require("firebase-admin");


exports.authenticate = async (req) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return {
      status: 401,
      authenticated: false,
      message: 'Unauthorized'
    }
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = await decodedToken.uid;
      return {
        userID: uid,
        authenticated: true
      }
  } catch(e) {
    return {
      status: 401,
      authenticated: false,
      message: 'Unauthorized'
    }
  }
};

