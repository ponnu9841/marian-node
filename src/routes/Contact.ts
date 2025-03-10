import { authenticateJWT } from "../utils/auth-middleware";
import { upload } from "../utils/upload";
import prisma from "../utils/prisma";
import createRouter from "../utils/router";
import { deleteRecord } from "../utils/delete-request";

const router = createRouter();
const uploadMiddleware = upload("service");

router.get("/", async (_, res) => {
   try {
      const contact = await prisma.contact.findFirst();
      res.status(200).json({
         data: contact,
      });
   } catch (error) {
      console.log(error);
   }
});

router.post("/", authenticateJWT, async (req, res) => {
   try {
      const data = req.body;
      const reqBody: Contact = {
         location: data.location,
         contactno_one: data.contactOne,
         contactno_two: data.contactTwo,
         email_one: data.emailOne,
         email_two: data.emailTwo,
      };
    //   const validated = validateServicePostRequest(reqBody);
      const contact = await prisma.contact.create({
         data: reqBody,
      });

      res.status(200).json({ data: contact });
   } catch (error) {
      console.log(error);
   }
});

router.put(
   "/",
   authenticateJWT,
   uploadMiddleware.single("image"),
   async (req, res) => {
      try {
         const data = req.body;
         const reqBody: Contact = {
            location: data.location,
            contactno_one: data.contactOne,
            contactno_two: data.contactTwo || "",
            email_one: data.emailOne,
            email_two: data.emailTwo || "",
         }
         const contact = await prisma.contact.update({
            where: { id: data.id },
            data: reqBody,
         });
         res.status(200).json({ data: contact });
      } catch (error) {
         console.log(error);
      }
   }
);

router.delete("/", authenticateJWT, async (req, res) => {
   deleteRecord(req, res, "service");
});

export default router;
