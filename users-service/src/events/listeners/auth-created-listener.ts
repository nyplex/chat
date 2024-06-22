import { Listener, Subjects } from "@chat-dev/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { AuthCreatedEvent } from "@chat-dev/common";
import { Users } from "../../models/users";
import { generateUsername } from "unique-username-generator";


export class AuthCreatedListener extends Listener<AuthCreatedEvent> {
  readonly subject = Subjects.authCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: { userID: string; email: string; version: number },
    msg: Message
  ) {
    const { email, userID, version } = data;

    const user = Users.build({
      email,
      id: userID,
      username: generateUsername("", 4, 10),
      version,
    });

    await user.save();

    msg.ack();
  }
}
