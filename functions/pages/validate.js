const admin = require("firebase-admin");

exports.validateFirebaseIdToken = async (req) => {
  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    return {
      authenticated: false,
      status: 403,
      message: `Unauthorized`
    };
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    idToken = req.cookies.__session;
  } else {
    return {
      authenticated: false,
      status: 403,
      message: `Unauthorized`
    };
  }
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    return {
      authenticated: true,
    };
  } catch (error) {
    return {
      authenticated: false,
      status: 403,
      message: `Unauthorized`
    };
    return;
  }
};

