import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateAvatar,
  userData,
  refreshAccessToken,
  updateProfile,
} from "../controller/auth.Controller";
import { upload } from "../middlewares/multer.middleware";
import { jwtVerify } from "../middlewares/verify.middleware";
import validateYup from "../middlewares/validateYup.middleware";
import {
  registerSchema,
  signinSchema,
  updateProfileSchema,
} from "../schema/AuthSchema";

const router = Router();
router
  .route("/register")
  .post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    validateYup(registerSchema),
    registerUser
  );
router.route("/login").post(validateYup(signinSchema), loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(jwtVerify, logoutUser);
router.route("/getUserData").get(jwtVerify, userData);
router
  .route("/updateAvatar")
  .post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    jwtVerify,
    updateAvatar
  );
router
  .route("/updateProfile")
  .put(jwtVerify, validateYup(updateProfileSchema), updateProfile);


export { router as authRoutes };
