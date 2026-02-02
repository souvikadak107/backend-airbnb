const TOKEN_KEY = "token";
const USER_KEY = "user";

function notifyAuthChanged() {
  window.dispatchEvent(new Event("auth_changed"));
}

export const authStore = {
  // token
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t) => {
    localStorage.setItem(TOKEN_KEY, t);
    notifyAuthChanged();
  },
  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    notifyAuthChanged();
  },

  // user
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (u) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    notifyAuthChanged();
  },
  clearUser: () => {
    localStorage.removeItem(USER_KEY);
    notifyAuthChanged();
  },

  // status
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),

  // logout
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    notifyAuthChanged();
  },
};