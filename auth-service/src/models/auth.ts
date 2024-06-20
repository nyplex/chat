import mongoose from "mongoose";
import { Password } from "../utils/password";

// An interface that describes the properties that are required to create a new User
interface AuthAttrs {
  email: string;
  password: string;
  refreshToken: string | null;
  audience: string;
}

// An interface that describes the properties that a User Model has
interface AuthModel extends mongoose.Model<AuthDoc> {
  build(attrs: AuthAttrs): AuthDoc;
}

// An interface that describes the properties that a User Document has
interface AuthDoc extends mongoose.Document {
  email: string;
  password: string;
  refreshToken: string | null;
  audience: string;
}

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: false,
      default: null,
    },
    audience: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
      },
    },
  }
);

authSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password")!);
    this.set("password", hashed);
  }
  // Encrypt refresh token here
  if (this.isModified("refreshToken") && this.get("refreshToken") !== null) {
    const hashed = await Password.toHash(this.get("refreshToken")!);
    this.set("refreshToken", hashed);
  }
  done();
});

authSchema.statics.build = (attrs: AuthAttrs) => {
  return new Auth(attrs);
};

const Auth = mongoose.model<AuthDoc, AuthModel>("User", authSchema);

export { Auth };
