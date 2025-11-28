import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

import Filtros from "../../components/Filtros";
import CardsResumo from "../../components/CardsResumo";
import TabelaBase from "../../components/TabelaBase";
import BotoesPDF from "../../components/BotoesPDF";


export default function Relatorios() {
  const [presidio, setPresidio] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [Presos, setPresos] = useState([]);
  const [conferencias, setConferencias] = useState([]);

  const [loading, setLoading] = useState(true);

  async function carregarDados() {
    setLoading(true);

    const PresosSnap = await getDocs(collection(db, "Presos"));
    const PresosList = PresosSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const confSnap = await getDocs(collection(db, "conferencias"));
    const confList = confSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const filtrados = presidio
      ? PresosList.filter((p) => p.presidioId === presidio)
      : PresosList;

    setPresos(filtrados);
    setConferencias(confList);
    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, [presidio, dataInicio, dataFim]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>

      <Filtros
        presidio={presidio}
        setPresidio={setPresidio}
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFim={dataFim}
        setDataFim={setDataFim}
      />

      <CardsResumo Presos={Presos} conferencias={conferencias} loading={loading} />

      <BotoesPDF Presos={Presos} conferencias={conferencias} />

      <TabelaBase Presos={Presos} conferencias={conferencias} loading={loading} />
    </div>
  );
}
