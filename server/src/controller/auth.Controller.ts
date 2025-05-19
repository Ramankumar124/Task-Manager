import type { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

import { asyncHandler } from "../utils/Asynchandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import jwt from "jsonwebtoken";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudnary";
import logger from "../utils/logger";
import passport from "../utils/passport";

interface UserDataRequest extends Request {
  user?: { email: string; id?: string } | any;
}

const accessTokenOptions = {
  httpOnly: true,
  secure:true,
  sameSite: "none" as const,
  maxAge: 60 * 60 * 1000,
};

const refreshTokenOptions = {
  httpOnly: true,
  secure:true,
  sameSite: "none" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const genrerateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, "user not found");

    const accessToken = await user.createAccessToken();
    const refreshToken = await user.createRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error: any) {
    throw new ApiError(500, "Something went wrong while gernrating tokens");
  }
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken: any = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    const user = await User.findById(decodedToken?.id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await genrerateAccessAndRefreshToken(user._id as string);

    return res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenOptions)
      .cookie("refreshToken", newRefreshToken, refreshTokenOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const registerUser = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password, userName } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError(400, "User already exists"));
  }

  let uploadAvatar = {
    url: "",
    public_id: "",
  };
  //@ts-ignore
  if (req?.files?.avatar?.length > 0) {
    const files = req.files as { [key: string]: Express.Multer.File[] };

    const localFilepath = files?.avatar[0].path;
    const data = await uploadToCloudinary(localFilepath);

    uploadAvatar.public_id = data?.public_id!;
    uploadAvatar.url = data?.url!;
    if (!uploadAvatar) {
      return next(new ApiError(400, "avatar upload failed"));
    }
  }
  const user = await User.create({
    email,
    password,
    userName,
    avatar: {
      url: uploadAvatar.url,
      public_id: uploadAvatar.public_id,
    },
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );

  if (!createdUser)
    return next(new ApiError(400, "Something went wrong while creating user"));

  const { accessToken, refreshToken } = await genrerateAccessAndRefreshToken(
    user._id as string
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new ApiResponse(201, createdUser, "user registered Successfully"));
});

const loginUser = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(400, "Invalid Crendeitals"));
  }
  const isMatchPassword = await user.comparePassword(password);

  if (!isMatchPassword) {
    return next(new ApiError(400, "invalid credentials"));
  }

  const { accessToken, refreshToken } = await genrerateAccessAndRefreshToken(
    user.id
  );
  const logedInUser = await User.findById(user._id)
    .select("-password -refreshToken ")
    .populate("Tasks");
  if (!logedInUser) {
    return next(new ApiError(400, "Something went wrong while signing user"));
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new ApiResponse(200, logedInUser, "user signin Successfully"));
});

const logoutUser = asyncHandler(
  async (req: UserDataRequest, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(
      req.user?.id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      sameSite: "none" as const,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "signout successfully"));
  }
);

const updateAvatar = asyncHandler(
  async (req: UserDataRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return next(new ApiError(404, "user not found"));
    }
    if (user.avatar.public_id !== "") {
      await deleteFromCloudinary(user?.avatar.public_id!);
    } else {
      await User.findByIdAndUpdate(
        req.user?.id,
        {
          avatar: {
            url: "",
            public_id: "",
          },
        },
        {
          new: true,
        }
      );
    }

    const files = req.files as {
      [key: string]: Express.Multer.File[];
    };

    const localFilePath = files?.avatar[0].path;

    const uploadAvatar = await uploadToCloudinary(localFilePath);
    if (!uploadAvatar) {
      return next(new ApiError(400, "avatar upload failed"));
    }
    await deleteFromCloudinary(user?.avatar.public_id!);
    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      {
        avatar: {
          url: uploadAvatar?.url,
          public_id: uploadAvatar?.public_id,
        },
      },
      {
        new: true,
      }
    )
      .select("-password -refreshToken") 
      .populate("Tasks");

    if (!updatedUser) {
      return next(new ApiError(400, "avatar Update failed"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "avatar update successfully"));
  }
);
const userData = asyncHandler(
  async (req: UserDataRequest, res: Response, next: NextFunction) => {
    const user = await User.findOne({
      email: (req.user as { email: string }).email,
    })
      .select("-password -refreshToken")
      .populate("Tasks");

    if (!user) {
      return next(new ApiError(404, "User Not found"));
    }
    logger.info("populated contacts of user", user);

    res
      .status(200)
      .json(new ApiResponse(200, user, "User Data sended Succesfully"));
  }
);
const updateProfile = asyncHandler(
  async (req: UserDataRequest, res: Response, next: NextFunction) => {
    const { userName, email } = req.body;

    const user = await User.findById(req.user?.id);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    if (email !== user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user?.id },
      });
      if (existingUser) {
        return next(new ApiError(400, "Email is already in use"));
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      {
        userName,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-password -refreshToken")
      .populate("Tasks");

    if (!updatedUser) {
      return next(new ApiError(400, "Failed to update profile"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
  }
);
const googleCallback = asyncHandler(
  async (req: UserDataRequest, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      { session: false },
      async (err: Error, user: any) => {
        if (err || !user) {
          return res.redirect(
            `${process.env.CLIENT_URL}/login?error=authentication_failed`
          );
        }
        const { accessToken, refreshToken } =
          await genrerateAccessAndRefreshToken(user._id);
        return res
          .status(200)
          .cookie("accessToken", accessToken, accessTokenOptions)
          .cookie("refreshToken", refreshToken, refreshTokenOptions)
          .redirect(`${process.env.CLIENT_URL}/dashboard`);
      }
    )(req, res, next);
  }
);
export {
  registerUser,
  logoutUser,
  loginUser,
  updateAvatar,
  updateProfile,
  userData,
  refreshAccessToken,
  googleCallback,
};
