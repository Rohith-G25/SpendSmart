import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register } = useAuth();

  const handleRegister = async () => {
    try {
      await register(name, email, password);

      alert("Registered successfully ✅");
    } catch (err: any) {
      console.log(err.response?.data);
      alert("Register failed ❌");
    }
  };

  return (
    <div className="flex flex-col gap-3 p-5">
      <h1 className="text-xl font-bold">Register</h1>

      <input
        placeholder="Name"
        className="border p-2"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        className="border p-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="bg-green-500 text-white p-2"
      >
        Register
      </button>
    </div>
  );
}

export default Register;