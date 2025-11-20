import { useState } from "react";
import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UploadFoto({ onUpload }) {
  const [preview, setPreview] = useState(null);

  async function enviarArquivo(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const storageRef = ref(storage, `presos/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    onUpload(url);
  }

  return (
    <div className="flex flex-col gap-2">
      {preview && (
        <img
          src={preview}
          className="w-32 h-32 object-cover rounded border"
        />
      )}

      <input type="file" accept="image/*" onChange={enviarArquivo} />
    </div>
  );
}
