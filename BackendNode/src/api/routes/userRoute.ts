import { Router } from "express";
import { celebrate, Joi } from "celebrate";


import config from "../../../config";
import middlewares from "../middlewares";
import IUserController from "../../controllers/IControllers/IUserController";

//import cl from "multer";
/* import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"; */
import dotenv from "dotenv"
import { Container } from "../../container";
/* import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; */



dotenv.config();
//const upload = multer({ storage: multer.memoryStorage() });
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;
const route = Router();

export default (app: Router) => {


    app.use("/users", route);

    const ctrl = Container.get(config.controllers.user.name) as IUserController;

    route.get("/test", (req, res) => { res.send("Backend Connected");});

    route.get("/all", middlewares.isAuth, (req, res, next) => {
        ctrl.getAllUsers(req, res, next);
    });

    route.post(
        "/signup",
        celebrate({
            body: Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().email().required(),
                phoneNumber: Joi.string().required(),
                password: Joi.string().required(),
                role: Joi.string().required(),
            }),
        }),
        (req, res, next) => ctrl.signUp(req, res, next)
    );

    route.get("/confirm-account",(req, res, next) => ctrl.confirmAccount(req, res, next));

    route.post(
        "/signin",
        celebrate({
            body: Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            }),
        }),
        (req, res, next) => ctrl.signIn(req, res, next)
    );

    route.post("/signout", middlewares.isAuth, (req, res, next) => ctrl.signOut(req, res, next));

    route.post(
        "/forgot-password",
        celebrate({
            body: Joi.object({
                email: Joi.string().email().required(),
            }),
        }),
        (req, res, next) => ctrl.forgotPassword(req, res, next)
    );

    route.post(
        "/reset-password",
        celebrate({
            body: Joi.object({
                token: Joi.string().required(),
                newPassword: Joi.string().required(),
            }),
        }),
        (req, res, next) => ctrl.resetPassword(req, res, next)
    );

    route.get("/find-staff", (req, res, next) => ctrl.findStaff(req, res, next));


    route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, async (req, res, next) => ctrl.getMe(req, res, next));


    /*     // Configuração do AWS S3
        const s3 = new S3Client({
          region: region,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          },
        });

        route.post("/uploadImage/:userId", upload.single("image"), async (req, res) => {
          try {
            const { userId } = req.params;
            const fileName = `profiles/${userId}`; // Nomeando a imagem com o ID do usuário

            // Upload para AWS S3
            await s3.send(new PutObjectCommand({
              Bucket: bucketName,
              Key: fileName,
              Body: req.file.buffer,
              ContentType: req.file.mimetype,
            }));

            const imageUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

            res.json({ imageUrl });
          } catch (error) {
            console.error("Erro no upload:", error);
            res.status(500).json({ error: "Erro no upload da imagem", details: error.message });

          }
        });

        route.get("/getImage/:userId", async (req, res) => {
            try {
                const { userId } = req.params;
                const fileName = `profiles/${userId}`; // Nomeando a imagem com o ID do usuário

                const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                });

                const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

                res.json({ imageUrl: signedUrl });
            } catch (error) {
                console.error("Erro no download:", error);
                res.status(500).json({ error: "Erro no download da imagem", details: error.message });
            }
            }); */

    route.get("/isAdmin/:id", (req, res, next) => ctrl.isAdmin(req, res, next));

    route.put(
        "/update/:id",
        celebrate({
            body: Joi.object({
                firstName: Joi.string().optional(),
                lastName: Joi.string().optional(),
                phoneNumber: Joi.string().optional(),
                email: Joi.string().email().optional(),
                role: Joi.string().optional(),
                password: Joi.string().optional(),
            }),
        }),
        middlewares.isAuth,
        (req, res, next) => ctrl.updateUser(req, res, next)
    );

    route.get("/toogle-active-status/:id", middlewares.isAuth, (req, res, next) => ctrl.toogleActiveStatus(req, res, next));


};
