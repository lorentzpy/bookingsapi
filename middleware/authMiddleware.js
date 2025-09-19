const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {

    console.log("MIDDLEWARE CALLED");
    const authHeader = req.headers.authorization;

    console.log(authHeader);

    if (!authHeader) {
        return res.status(401).json({ error: "Missing token"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        console.error("JWT verify error:", err.message);
        return res.status(401).json({error: "Invalid token"});
    }
}

module.exports = authMiddleware;