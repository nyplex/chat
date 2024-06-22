import { AuthUpdatedEvent, Listener, Subjects } from "@chat-dev/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Users } from "../../models/users";

export class AuthUpdatedListener extends Listener<AuthUpdatedEvent> {
  readonly subject = Subjects.authUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: AuthUpdatedEvent["data"], msg: Message) {
    const user = await Users.findByEvent({
      id: data.userID,
      version: data.version,
    });

    if (!user) {
      throw new Error("User not found");
    }

    user.set({
      email: data.email,
    });
    await user.save();

    msg.ack();
  }
}
