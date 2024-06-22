import { AuthCreatedEvent, Publisher, Subjects } from "@chat-dev/common";

export class AuthCreatedPublisher extends Publisher<AuthCreatedEvent> {
  readonly subject = Subjects.authCreated;
}
