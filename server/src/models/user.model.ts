import jwt from "jsonwebtoken";
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  avatar: {
    url?: string;
    public_id?: string;
  };
  googleId: string;
  Tasks: mongoose.Types.ObjectId[] | string[];
  refreshToken: string | null;
  comparePassword(password: string): Promise<boolean>;
  createAccessToken(): string;
  createRefreshToken(): string;
  generateToken: (otp: number, id: string) => Promise<string>;
}

const userSchema: Schema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatar: {
      required: false,
      type: {
        url: String,
        public_id: String,
      },
    },
    Tasks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Task",
      },
    ],
    refreshToken: {
      type: String,
    },
    googleId: String,
  },

  { timestamps: true }
);

userSchema.pre("save", async function (this: IUser & Document, next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.createAccessToken = function () {
  //@ts-ignore
  return jwt.sign(
    { id: this._id, name: this.name, email: this.email },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY! }
  );
};

userSchema.methods.createRefreshToken = function () {
  //@ts-ignore
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY! || "10d" } as {
      expiresIn: string | number;
    }
  );
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
