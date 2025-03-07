import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

interface AuthRequest extends Request {
   user?: any;
}

const authenticateJWT = (
   req: AuthRequest,
   res: Response,
   next: NextFunction
) => {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
         .status(401)
         .json({ message: "Access denied. No token provided." });
   }

   const token = authHeader.split(" ")[1];

   if (!token) {
      return res.status(401).json({ error: "No token provided" });
   }

   try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      next();
   } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token." });
   }
};

export const isAdmin = (
   req: AuthRequest,
   res: Response,
   next: NextFunction
) => {
   // This assumes you have user type or roles stored in the token
   // You can modify according to your user data structure
   if (req.user && req.user.type === "admin") {
      // Here you would check if the user is an admin
      // For example: if(req.user.type === 'admin')
      next();
   } else {
      res.status(403).json({ error: "UnAuthorized" });
   }
};

export default authenticateJWT;
