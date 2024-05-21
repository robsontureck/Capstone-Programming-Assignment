const jwt = require("jsonwebtoken");
const User = require("../models/user");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization").split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    try {
      const authenticatedUser = await User.findByPk(user.id);

      if (!authenticatedUser) {
        return res.sendStatus(404);
      }
      req.user = authenticatedUser;
      next();
    } catch (error) {
      console.log("An error occurred while authenticating the user.");
      res
        .status(500)
        .json({ error: "An error occurred while authenticating the user." });
    }
  });
}

module.exports = authenticateToken;
