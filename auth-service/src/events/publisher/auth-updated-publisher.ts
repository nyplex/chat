import { AuthUpdatedEvent, Publisher, Subjects } from "@chat-dev/common";

export class AuthUpdatedPublisher extends Publisher<AuthUpdatedEvent> {
  readonly subject = Subjects.authUpdated;
}
