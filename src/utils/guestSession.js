const GUEST_SESSION_KEY = "dsp_guest_session_id";

export const getGuestSessionId = () => {
  let id = sessionStorage.getItem(GUEST_SESSION_KEY);
  if (!id) {
    id = globalThis.crypto?.randomUUID?.() || `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(GUEST_SESSION_KEY, id);
  }
  return id;
};
