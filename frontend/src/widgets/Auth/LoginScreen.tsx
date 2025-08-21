import { useState } from "react";
import { useStore } from "@/store";

export function LoginScreen() {
  const setToken = useStore((s) => s.auth.setToken);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("username", username);
      params.set("password", password);
  // OAuth2PasswordRequestForm requires grant_type=password
  params.set("grant_type", "password");

      const res = await fetch(
        `/api/v1/auth/login?captcha_token=${encodeURIComponent(captcha)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        }
      );

      if (!res.ok) {
        let msg = "Login failed";
        try {
          const data = await res.json();
          msg = (data as any)?.detail || msg;
        } catch {}
        setError(msg);
        return;
      }

  const data = await res.json();
  setToken((data as any).access_token);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-xs mx-auto mt-24 p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-bold mb-2">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input input-bordered w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Captcha (any value)"
          value={captcha}
          onChange={(e) => setCaptcha(e.target.value)}
          required
          className="input input-bordered w-full"
        />
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
