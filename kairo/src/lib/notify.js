import { toast } from "sonner";

// User-facing notifications. Never pass raw error messages, status codes, ids,
// table or file names to these helpers: plain, friendly language only.
const POSITION = { success: "top-right", warning: "top-right", info: "top-right", error: "bottom-right" };
const DURATION = { success: 3500, warning: 5000, info: 4000, error: 6000 };

const show = (type, title, description, id) =>
  toast[type](title, { description, id, position: POSITION[type], duration: DURATION[type] });

export const notify = {
  success: (title, description, id) => show("success", title, description, id),
  warning: (title, description, id) => show("warning", title, description, id),
  info: (title, description, id) => show("info", title, description, id),
  error: (title, description, id) => show("error", title, description, id),
};
