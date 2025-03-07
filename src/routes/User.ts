import { Router, type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateUser } from "../validation/user";
import { UserInput } from "../interfaces/user";
import { errorHandler } from "../middleware/error-handler";

const prisma = new PrismaClient();
const router = Router();

router.post("/register", async (req: Request, res: Response) => {
   const { name, email, password } = req.body;
   const hashedPassword = await bcrypt.hash(password, 11);
   const reqBody: UserInput = {
      name,
      email,
      password,
   };

   const response = validateUser(reqBody);

   try {
      if (name) {
         const createdUser = await prisma.user.create({
            data: {
               ...reqBody,
               password: hashedPassword,
               //   type: "admin",
            },
         });
         res.status(200).json(createdUser);
      } else {
         res.status(203).json({
            error: "Name needed",
         });
      }
   } catch (error) {
      res.status(500).json({ error: "An error occurred" });
   }
});

router.post("/login", async (req: Request, res: Response) => {
   const { email, password } = req.body;
   try {
      const existingUser = await prisma.user.findUnique({
         where: { email },
      });

      if (!existingUser) {
         res.status(404).json({ error: "User not found" });
         return;
      }
      const passwordMatch = await bcrypt.compare(
         password,
         existingUser.password
      );
      if (!passwordMatch) {
         res.status(401).json({ error: "Authentication failed" });
         return;
      }

      // Creating JWT token
      const token = jwt.sign(
         {
            userId: existingUser.id,
            email: existingUser.email,
            name: existingUser.name
         },
         process.env.JWT_SECRET as string,
         { expiresIn: "1h" }
      );

      res.status(200).json({
         success: true,
         data: {
            userId: existingUser.id,
            email: existingUser.email,
            token,
         },
      });
   } catch (error) {
      errorHandler(error as Error, req, res);
   }
});

export default router;
