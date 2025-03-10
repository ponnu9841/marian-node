import { authenticateJWT } from "../utils/auth-middleware";
import { upload } from "../utils/upload";
import { deleteFileFromUrl, extractFilePath } from "../utils/file";
import prisma, { disconnect } from "../utils/prisma";
import createRouter from "../utils/router";
import {
   // validateServicePostRequest,
   validateServicePutRequest,
} from "../validation/service";
import { deleteRecord } from "../utils/delete-request";
import {
   createPaginatedResponse,
   getPaginationParams,
} from "../utils/pagination";

const router = createRouter();
const uploadMiddleware = upload("portfolio");

router.get("/", async (req, res) => {
   try {
      const { skip, take } = getPaginationParams(req);
      const page = parseInt(req.query.page as string) || 1;
      const limit = take;

      const portfolios = await prisma.portfolio.findMany({
         skip,
         take,
         orderBy: { createdAt: "desc" },
         select: {
            id: true,
            image: true,
            alt: true,
            title: true,
            description: true,
         },
      });
      // Get total count for pagination metadata
      const totalPosts = await prisma.portfolio.count();
      res.status(200).json(
         createPaginatedResponse(portfolios, totalPosts, page, limit)
      );
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
            image: filePath,
            alt: data.alt,
            title: data.title,
            description: data.description,
         };
         //  const validated = validateServicePostRequest(reqBody);
         const portfolio = await prisma.portfolio.create({
            data: reqBody,
         });

         res.status(200).json({ data: portfolio });
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
            alt: data.alt,
            title: data.title,
            description: data.description,
         };
         const validated = validateServicePutRequest({
            ...reqBody,
            id: data.id,
         });

         if (req.file) {
            //update without saving image
            reqBody["image"] = extractFilePath(req.file);
            const portfolio = await prisma.portfolio.findUnique({
               where: { id: data.id },
            });
            deleteFileFromUrl(portfolio?.image as string);
         }

         // console.log(validated.value);
         const portfolioUpdated = await prisma.portfolio.update({
            where: { id: data.id },
            data: reqBody,
         });
         res.status(200).json({ data: portfolioUpdated });
      } catch (error) {
         console.log(error);
      } finally {
         disconnect();
      }
   }
);

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "portfolio");
});

export default router;
