import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function listarConferencias() {
  const snap = await getDocs(collection(db, "conferencias"));
  const conferencias = [];

  for (const docu of snap.docs) {
    const data = docu.data();

    let presidioNome = "";
    if (data.presidioId) {
      const presRef = doc(db, "presidios", data.presidioId);
      const presSnap = await getDoc(presRef);
      presidioNome = presSnap.exists() ? presSnap.data().nome : "Presídio não encontrado";
    }

    let usuarioNome = "";
    if (data.usuarioId) {
      const userRef = doc(db, "usuarios", data.usuarioId);
      const userSnap = await getDoc(userRef);
      usuarioNome = userSnap.exists() ? userSnap.data().nome : "Usuário não encontrado";
    }

    conferencias.push({
      id: docu.id,
      presidioNome,
      usuarioNome,
      ...data
    });
  }

  return conferencias;
}

export async function excluirConferencia(id) {
  await deleteDoc(doc(db, "conferencias", id));
}
