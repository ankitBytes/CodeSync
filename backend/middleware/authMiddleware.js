import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function AuthMiddleware(req, res, next) {
  // Check if the user is authenticated
  const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Invalid token or token has expired." });
    }

    req.user = decoded; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  });
}

export const SocketAuthMiddleware = (socket, next) => {
  try {
    const rawCookie = socket.request.headers.cookie;
    if (!rawCookie) {
      return next(new Error("No cookies found"));
    }

    const cookies = cookie.parse(rawCookie);

    const token = cookies.token;
    if (!token) {
      return next(new Error("Auth token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded;

    next();
  } catch (err) {
    return next(new Error("Invalid or expired token"));
  }
};