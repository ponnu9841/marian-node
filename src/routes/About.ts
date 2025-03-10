import { authenticateJWT } from "../utils/auth-middleware";
import { upload } from "../utils/upload";
import { deleteFileFromUrl, extractFilePath } from "../utils/file";
import prisma from "../utils/prisma";
import createRouter from "../utils/router";
// import {
//    validateServicePostRequest,
//    validateServicePutRequest,
// } from "../validation/service";
import { deleteRecord } from "../utils/delete-request";

const router = createRouter();
const uploadMiddleware = upload("about");

router.get("/", async (_, res) => {
   try {
      const about = await prisma.about.findFirst();
      res.status(200).json({
         data: about,
      });
   } catch (error) {
      console.log(error);
   }
});

router.post(
   "/",
   authenticateJWT,
   uploadMiddleware.single("image"),
   async (req, res) => {
      try {
         if (!req.file) {
            res.status(400).json({ error: "No file to upload" });
            return;
         }

         const data = req.body;
         const filePath = extractFilePath(req.file);
         const reqBody: About = {
            title: data.title,
            title_badge: data.title_badge,
            image: filePath,
            alt: data.alt || "",
            short_description: data.short_description || "",
            long_description: data.long_description || "",
         };
         //   const validated = validateServicePostRequest(reqBody);
         const about = await prisma.about.create({
            data: reqBody,
         });

         res.status(200).json({ data: about });
      } catch (error) {
         console.log(error);
      }
   }
);

router.put(
   "/",
   authenticateJWT,
   uploadMiddleware.single("image"),
   async (req, res) => {
      try {
         const data = req.body;
         const reqBody: { [key: string]: any } = {
            title: data.title,
            title_badge: data.title_badge,
            alt: data.alt || "",
            short_description: data.short_description || "",
            long_description: data.long_description || "",
         };
         if (req.file) {
            reqBody["image"] = extractFilePath(req.file);
            const about = await prisma.about.findUnique({
               where: { id: data.id },
            });
            deleteFileFromUrl(about?.image as string);
         }
         const about = await prisma.about.update({
            where: { id: data.id },
            data: reqBody,
         });
         res.status(200).json({ data: about });
      } catch (error) {
         console.log(error);
      }
   }
);

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "service");
});

export default router;
