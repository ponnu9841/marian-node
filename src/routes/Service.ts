import { authenticateJWT } from "../utils/auth-middleware";
import { upload } from "../utils/upload";
import { deleteFileFromUrl, extractFilePath } from "../utils/file";
import prisma, { disconnect } from "../utils/prisma";
import createRouter from "../utils/router";
import {
   validateServicePostRequest,
   validateServicePutRequest,
} from "../validation/service";
import { deleteRecord } from "../utils/delete-request";

const router = createRouter();
const uploadMiddleware = upload("service");

router.get("/", async (_, res) => {
   try {
      const services = await prisma.service.findMany({
         orderBy: { createdAt: "desc" },
         select: {
            id: true,
            title: true,
            image: true,
            alt: true,
            short_description: true,
            long_description: true,
         },
      });
      res.status(200).json({
         data: services,
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

         const filePath = extractFilePath(req.file);
         const data = req.body;
         const reqBody = {
            title: data.title,
            image: filePath,
            alt: data.alt,
            short_description: data.shortDescription,
            long_description: data.longDescription,
         };
         const validated = validateServicePostRequest(reqBody);
         const service = await prisma.service.create({
            data: reqBody,
         });

         res.status(200).json({ data: service });
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
         const reqBody: Omit<ServicePutRequest, "id"> = {
            alt: data.alt,
            title: data.title,
            short_description: data.shortDescription,
            long_description: data.longDescription,
         };
         const validated = validateServicePutRequest({
            ...reqBody,
            id: data.id,
         });

         if (req.file) {
            //update without saving image
            reqBody["image"] = extractFilePath(req.file);
            const service = await prisma.service.findUnique({
               where: { id: data.id },
            });
            deleteFileFromUrl(service?.image as string);
         }

         // console.log(validated.value);
         const service = await prisma.service.update({
            where: { id: data.id },
            data: reqBody,
         });
         res.status(200).json({ data: service });
      } catch (error) {
         console.log(error);
      }
   }
);

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "service");
});

export default router;
