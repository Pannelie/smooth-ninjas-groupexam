import { v4 as uuid } from "uuid";

export function generateUserId() {
  const id = uuid();
  const shortId = id.replace(/-/g, "").substring(0, 5);
  return `user-${shortId}`;
}
