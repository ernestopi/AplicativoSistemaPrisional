import { useState } from "react";
import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UploadFoto({ onUpload }) {
  const [loading, setLoading] = useState(false);

  async function enviarArquivo(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const caminho = `fotos/${Date.now()}-${file.name}`;
    const refArquivo = ref(storage, caminho);

    await uploadBytes(refArquivo, file);

    const url = await getDownloadURL(refArquivo);

    onUpload(url); // devolve a URL da foto
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">Foto do preso:</label>

      <input
        type="file"
        accept="image/*"
        onChange={enviarArquivo}
        className="border rounded p-2"
      />

      {loading && (
        <p className="text-sm text-gray-600">Enviando foto...</p>
      )}
    </div>
  );
}
