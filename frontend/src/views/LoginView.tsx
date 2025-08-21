import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_URL = "/api/v1/auth/login";

export default function LoginView() {
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
      const form = new FormData();
      form.append("username", username);
      form.append("password", password);
      form.append("grant_type", "");
      const res = await fetch(
        API_URL + `?captcha_token=${encodeURIComponent(captcha)}`,
        { method: "POST", body: form }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.detail || "Login failed");
        return;
      }
      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      window.location.reload();
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xs w-full mx-auto mt-20 p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full"
        />
        <Input
          type="text"
          placeholder="Captcha (any value)"
          value={captcha}
          onChange={(e) => setCaptcha(e.target.value)}
          required
          className="w-full"
        />
        {error && <div className="text-red-500">{error}</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
