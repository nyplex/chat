import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties that are required to create a new User
interface UsersAttrs {
  id: string;
  email: string;
  username: string;
  version: number;
}

// An interface that describes the properties that a User Model has
interface UsersModel extends mongoose.Model<UsersDoc> {
  build(attrs: UsersAttrs): UsersDoc;
  findByEvent(event: { id: string; version: number }): Promise<UsersDoc | null>;
}

// An interface that describes the properties that a User Document has
interface UsersDoc extends mongoose.Document {
  id: string;
  email: string;
  username: string;
  version: number;
}

const usersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);


usersSchema.set("versionKey", "version");
usersSchema.plugin(updateIfCurrentPlugin);

usersSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Users.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

usersSchema.statics.build = (attrs: UsersAttrs) => {
  return new Users({
    _id: attrs.id,
    email: attrs.email,
    username: attrs.username,
  });
};

const Users = mongoose.model<UsersDoc, UsersModel>("Users", usersSchema);

export { Users };
