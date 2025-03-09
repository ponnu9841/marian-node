import { authenticateJWT } from "../utils/auth-middleware";
import { upload } from "../utils/upload";
import { deleteFileFromUrl, extractFilePath } from "../utils/file";
import prisma, { disconnect } from "../utils/prisma";
import createRouter from "../utils/router";
import { deleteRecord } from "../utils/delete-request";

const router = createRouter();

router.get("/", async (req, res) => {
   try {
      const banner = await prisma.banner.findMany({
         orderBy: { createdAt: "desc" },
         select: {
            id: true,
            image: true,
            alt: true,
         },
      });

      res.status(200).json({
         data: banner,
      });
   } catch (error) {
      res.status(500).json({ error: "An error occurred" });
   }
});

router.post(
   "/",
   authenticateJWT,
   upload("banner").single("image"),
   async (req, res) => {
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

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "banner");
});

export default router;
