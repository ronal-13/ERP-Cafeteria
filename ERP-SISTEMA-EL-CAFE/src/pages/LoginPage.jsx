import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { Form, FormGroup, FormActions } from "../components/forms/Form";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await login(form.email, form.password);
      navigate("/");
    } catch {
      setError("Correo o contraseña inválidos");
    }
  };

  return (
    <div
      className="page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="auth-wrap" style={{ maxWidth: 1000 }}>
        <div className="auth-left"></div>
        <div className="auth-right">
          <div className="auth-card">
            <div className="brand">
              <div className="brand-title">☕ Cafe Beans</div>
              <div className="brand-sub">Bienvenido de nuevo</div>
            </div>
            <div className="heading">Accede a tu cuenta</div>
            <Form onSubmit={onSubmit}>
              <FormGroup>
                <div className="auth-fields">
                  <label className="label label-dark">Email address</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="usuario@cafe.com"
                    className="input-dark"
                    required
                  />
                  <label className="label label-dark">Password</label>
                  <div style={{ position: "relative" }}>
                    <Input
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="input-dark input-icon-right"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="eye-toggle"
                      aria-label="Mostrar contraseña"
                    >
                      {showPwd ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.78-1.86 2-3.54 3.5-4.9" />
                          <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-1.2 2.86-3.17 5.26-5.66 6.84" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="options-row">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <a className="forgot" href="#">
                    Forgot password ?
                  </a>
                </div>
                {error && (
                  <div className="error-text" style={{ marginTop: 8 }}>
                    {error}
                  </div>
                )}
              </FormGroup>
              <FormActions className="left">
                <Button type="submit" className="btn-light btn-block">
                  Sign In
                </Button>
              </FormActions>
            </Form>
            <div className="divider">Or</div>
            <div style={{ textAlign: "center" }}>
              <a className="link" href="#">
                Sign in with Google
              </a>
            </div>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <span className="muted">Don’t have an account?</span>{" "}
              <a className="link" href="#">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
