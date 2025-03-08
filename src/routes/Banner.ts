import { Router, type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateJWT } from "../utils/auth-middleware";
import { upload } from "../utils/upload";
import { deleteFileFromUrl, extractFilePath } from "../utils/file";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req: Request, res: Response) => {
   const banner = await prisma.banner.findMany();

   res.status(200).json({
      data: banner,
   });

   try {
   } catch (error) {
      res.status(500).json({ error: "An error occurred" });
   }
});

router.post(
   "/",
   authenticateJWT,
   upload("banner").single("image"),
   async (req: Request, res: Response) => {
      const data = req.body;
      try {
         if (req.file) {
            const filePath = extractFilePath(req.file);
            const reqBody = {
               image: filePath,
               alt: data.alt,
            };
            const banner = await prisma.banner.create({
               data: reqBody,
            });
            res.status(200).json({ data: banner });
         }
      } catch (error) {
         res.status(500).json({ error: "An error occurred" });
      }
   }
);

router.delete("/", authenticateJWT, async (req: Request, res: Response) => {
   const { id, image } = req.query;
   if (id && image) {
      deleteFileFromUrl(image as string);
      await prisma.banner.delete({
         where: { id: id as string },
      });
      res.status(200).json({ message: "Banner deleted successfully" });
   } else {
      res.status(404).json({ message: "Image or Id not found" });
   }
});

export default router;
