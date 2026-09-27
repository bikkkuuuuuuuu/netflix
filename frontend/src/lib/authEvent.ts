import { EventEmitter } from "events";

export const authEvent = new EventEmitter();

export type AuthEventType =
  | "TOKEN_EXPIRED"
  | "INVALID_TOKEN"
  | "LOGIN_REQUIRED";

export const emitAuthEvent = (type: AuthEventType, message?: string) => {
  authEvent.emit("auth", { type, message });
};
