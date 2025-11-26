const users = [
  {
    id: 1,
    nombre: "Ronal Asencio",
    email: "admin@cafe.com",
    password: "admin123",
    rol: "admin",
  },
  {
    id: 2,
    nombre: "Vendedor",
    email: "venta@cafe.com",
    password: "venta123",
    rol: "vendedor",
  },
];

const KEY_TOKEN = "auth_token";
const KEY_USER = "auth_user";

const authService = {
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        if (!user) {
          reject(new Error("Credenciales inválidas"));
          return;
        }
        const token = Math.random().toString(36).slice(2);
        localStorage.setItem(KEY_TOKEN, token);
        localStorage.setItem(KEY_USER, JSON.stringify(user));
        resolve({ token, user });
      }, 400);
    });
  },
  logout() {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER);
  },
  getCurrentUser() {
    const raw = localStorage.getItem(KEY_USER);
    return raw ? JSON.parse(raw) : null;
  },
  getToken() {
    return localStorage.getItem(KEY_TOKEN);
  },
};

export default authService;
