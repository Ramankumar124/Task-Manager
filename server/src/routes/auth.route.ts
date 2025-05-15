import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateAvatar,
  userData,
  refreshAccessToken,

} from "../controller/auth.Controller";
import { upload } from "../middlewares/multer.middleware";
import { jwtVerify } from "../middlewares/verify.middleware";
import validateYup from "../middlewares/validateYup.middleware";
import { registerSchema, signinSchema } from "../schema/AuthSchema";

const router = Router();
router
  .route("/register")
  .post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    validateYup(registerSchema),
    registerUser
  );
router.route("/login").post(validateYup(signinSchema),loginUser);
router.route("/refresh-token").post(refreshAccessToken);
// router.route("/forgotPassword").post(forgotPassword);
// router.route("/resetPassword").post(resetPassword);
// router.route("/verifyForgotPasswordOtp").post(verifyForgotPasswordOtp);
router.route("/logout").post(jwtVerify, logoutUser);
router.route("/getUserData").get(jwtVerify, userData);
// router.route("/get-all-users").get(jwtVerify, AllUserList);
router
  .route("/updateAvatar")
  .post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    jwtVerify,
    updateAvatar
  );
// router.post('/googleLogin',googleLogin)

export { router as authRoutes };
