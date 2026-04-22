const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

// Create JWKS client for Cognito
const client = jwksClient({
  jwksUri: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_Jpd1eE1wJ/.well-known/jwks.json",
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5
});

// Get signing key from JWKS
function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Middleware to verify Cognito JWT token
const verifyCognitoToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "No token provided",
      data: null
    });
  }

  jwt.verify(token, getKey, {
    algorithms: ["RS256"],
    issuer: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_Jpd1eE1wJ"
  }, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token: " + err.message,
        data: null
      });
    }

    // Extract user info from Cognito token
    req.user = {
      sub: decoded.sub,
      email: decoded.email,
      username: decoded["cognito:username"] || decoded.email,
      accountType: decoded["custom:account_type"] || "student"
    };

    next();
  });
};

module.exports = verifyCognitoToken;