import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleLogin = async () => {
  try {
    await login(email, password);

    console.log("Login success ✅");

    window.location.reload(); // 🔥 ADD THIS LINE

  } catch (err: any) {
    console.log("ERROR:", err.response?.data);
    alert("Login failed ❌");
  }
};

  return (
    <div className="flex flex-col gap-3 p-5">
      <h1 className="text-xl font-bold">Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2"
      >
        Login
      </button>
    </div>
  );
}

export default Login;