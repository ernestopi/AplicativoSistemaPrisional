import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      nav("/presidios");
    } catch (error) {
      setErro("Email ou senha inválidos");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={entrar}
        className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">Login</h1>

        {erro && <p className="text-red-600">{erro}</p>}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="border p-2 rounded"
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
