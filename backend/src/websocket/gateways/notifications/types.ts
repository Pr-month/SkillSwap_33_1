export enum NotificationTypes {
  New = 'NEW_REQUEST',
  Accepted = 'REQUEST_ACCEPTED',
  Rejected = 'REQUEST_REJECTED',
}

export interface NotificationPayload {
  type: NotificationTypes;
  createdAt: Date;
  fromUser: string;
}
