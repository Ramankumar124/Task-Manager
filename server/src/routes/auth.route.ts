import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateAvatar,
  userData,
  refreshAccessToken,
  updateProfile,
  googleCallback,
} from "../controller/auth.Controller";
import { upload } from "../middlewares/multer.middleware";
import { jwtVerify } from "../middlewares/verify.middleware";
import validateYup from "../middlewares/validateYup.middleware";
import {
  registerSchema,
  signinSchema,
  updateProfileSchema,
} from "../schema/AuthSchema";
import passport from "../utils/passport";

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

router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));
router.route("/google/callback").get(googleCallback);
router.route("/logout").get(logoutUser);

export { router as authRoutes };
