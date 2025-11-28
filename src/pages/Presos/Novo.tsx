import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import UploadFoto from "../../components/UploadFoto";
import { useNavigate } from "react-router-dom";

export default function NovoPreso() {
  const nav = useNavigate();

  const [nome, setNome] = useState("");
  const [situacao, setSituacao] = useState("Provisório");
  const [foto, setFoto] = useState(null);
  const [presidioId, setPresidioId] = useState("");
  const [presidios, setPresidios] = useState([]);
  
  // Novos campos
  const [matricula, setMatricula] = useState("");
  const [cela, setCela] = useState("");
  const [pavilhao, setPavilhao] = useState("");
  const [ventilador, setVentilador] = useState(false);
  const [colchao, setColchao] = useState(false);
  const [tv, setTv] = useState(false);
  const [radio, setRadio] = useState(false);
  const [diaVisita, setDiaVisita] = useState("");

  async function carregarPresidios() {
    const snap = await getDocs(collection(db, "presidios"));
    setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function salvar(e) {
    e.preventDefault();

    const p = presidios.find((x) => x.id === presidioId);

    await addDoc(collection(db, "Presos"), {
      nome,
      situacao,
      foto: foto || null,
      presidioId: presidioId || null,
      presidioNome: p?.nome ?? "",
      matricula,
      cela,
      pavilhao,
      ventilador,
      colchao,
      tv,
      radio,
      diaVisita,
      criadoEm: new Date(),
    });

    nav("/Presos");
  }

  useEffect(() => {
    carregarPresidios();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Preso</h1>
        <p className="text-gray-600 mt-1">Preencha todos os dados do interno</p>
      </div>

      <form onSubmit={salvar} className="max-w-5xl">
        {/* Card de Foto */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📸</span>
            Foto do Interno
          </h2>
          
          <div className="flex items-start gap-6">
            {foto && (
              <div className="flex-shrink-0">
                <img
                  src={foto}
                  className="w-40 h-40 rounded-2xl border-4 border-gray-200 object-cover shadow-lg"
                  alt="Preview"
                />
              </div>
            )}
            <div className="flex-1">
              <UploadFoto onUpload={setFoto} />
            </div>
          </div>
        </div>

        {/* Card de Informações Básicas */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span>
            Informações Básicas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="Digite o nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Matrícula *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-mono"
                placeholder="Ex: 2024001234"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Presídio *
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                value={presidioId}
                onChange={(e) => setPresidioId(e.target.value)}
                required
              >
                <option value="">Selecione o presídio</option>
                {presidios.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Situação *
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                value={situacao}
                onChange={(e) => setSituacao(e.target.value)}
              >
                <option>Provisório</option>
                <option>Sentenciado</option>
                <option>Saída temporária</option>
                <option>Transferido</option>
                <option>Fuga</option>
                <option>Hospitalizado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card de Localização */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📍</span>
            Localização no Presídio
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pavilhão
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="Ex: A, B, C..."
                value={pavilhao}
                onChange={(e) => setPavilhao(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cela
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="Ex: 15"
                value={cela}
                onChange={(e) => setCela(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dia de Visita
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                value={diaVisita}
                onChange={(e) => setDiaVisita(e.target.value)}
              >
                <option value="">Selecione o dia</option>
                <option value="Segunda-feira">Segunda-feira</option>
                <option value="Terça-feira">Terça-feira</option>
                <option value="Quarta-feira">Quarta-feira</option>
                <option value="Quinta-feira">Quinta-feira</option>
                <option value="Sexta-feira">Sexta-feira</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card de Pertences */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🎒</span>
            Pertences Autorizados
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all">
              <input
                type="checkbox"
                checked={ventilador}
                onChange={(e) => setVentilador(e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <span className="text-xl">🌀</span>
                Ventilador
              </span>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
              <input
                type="checkbox"
                checked={colchao}
                onChange={(e) => setColchao(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <span className="text-xl">🛏️</span>
                Colchão
              </span>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-all">
              <input
                type="checkbox"
                checked={tv}
                onChange={(e) => setTv(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <span className="text-xl">📺</span>
                TV
              </span>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-all">
              <input
                type="checkbox"
                checked={radio}
                onChange={(e) => setRadio(e.target.checked)}
                className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
              />
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <span className="text-xl">📻</span>
                Rádio
              </span>
            </label>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105"
          >
            ✓ Salvar Preso
          </button>
          <button
            type="button"
            onClick={() => nav("/Presos")}
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}


//23 de outubro de 2025
// import { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import { collection, getDocs, addDoc } from "firebase/firestore";
// import UploadFoto from "../../components/UploadFoto";
// import { useNavigate } from "react-router-dom";

// export default function NovoPreso() {
//   const nav = useNavigate();

//   const [nome, setNome] = useState("");
//   const [situacao, setSituacao] = useState("Provisório");
//   const [foto, setFoto] = useState(null);
//   const [presidioId, setPresidioId] = useState("");
//   const [presidios, setPresidios] = useState([]);
  
//   // Novos campos
//   const [matricula, setMatricula] = useState("");
//   const [cela, setCela] = useState("");
//   const [pavilhao, setPavilhao] = useState("");
//   const [ventilador, setVentilador] = useState(false);
//   const [colchao, setColchao] = useState(false);
//   const [tv, setTv] = useState(false);
//   const [radio, setRadio] = useState(false);
//   const [diaVisita, setDiaVisita] = useState("");

//   async function carregarPresidios() {
//     const snap = await getDocs(collection(db, "presidios"));
//     setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//   }

//   async function salvar(e) {
//     e.preventDefault();

//     const p = presidios.find((x) => x.id === presidioId);

//     await addDoc(collection(db, "Presos"), {
//       nome,
//       situacao,
//       foto: foto || null,
//       presidioId: presidioId || null,
//       presidioNome: p?.nome ?? "",
//       matricula,
//       cela,
//       pavilhao,
//       ventilador,
//       colchao,
//       tv,
//       radio,
//       diaVisita,
//       criadoEm: new Date(),
//     });

//     nav("/Presos");
//   }

//   useEffect(() => {
//     carregarPresidios();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Preso</h1>
//         <p className="text-gray-600 mt-1">Preencha todos os dados do interno</p>
//       </div>

//       <form onSubmit={salvar} className="max-w-5xl">
//         {/* Card de Foto */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//             <span>📸</span>
//             Foto do Interno
//           </h2>
          
//           <div className="flex items-start gap-6">
//             {foto && (
//               <div className="flex-shrink-0">
//                 <img
//                   src={foto}
//                   className="w-40 h-40 rounded-2xl border-4 border-gray-200 object-cover shadow-lg"
//                   alt="Preview"
//                 />
//               </div>
//             )}
//             <div className="flex-1">
//               <UploadFoto onUpload={setFoto} />
//             </div>
//           </div>
//         </div>

//         {/* Card de Informações Básicas */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//             <span>📋</span>
//             Informações Básicas
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Nome Completo *
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
//                 placeholder="Digite o nome completo"
//                 value={nome}
//                 onChange={(e) => setNome(e.target.value)}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Matrícula *
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-mono"
//                 placeholder="Ex: 2024001234"
//                 value={matricula}
//                 onChange={(e) => setMatricula(e.target.value)}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Presídio *
//               </label>
//               <select
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
//                 value={presidioId}
//                 onChange={(e) => setPresidioId(e.target.value)}
//                 required
//               >
//                 <option value="">Selecione o presídio</option>
//                 {presidios.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.nome}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Situação *
//               </label>
//               <select
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
//                 value={situacao}
//                 onChange={(e) => setSituacao(e.target.value)}
//               >
//                 <option>Provisório</option>
//                 <option>Sentenciado</option>
//                 <option>Saída temporária</option>
//                 <option>Transferido</option>
//                 <option>Fuga</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Card de Localização */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//             <span>📍</span>
//             Localização no Presídio
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Pavilhão
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
//                 placeholder="Ex: A, B, C..."
//                 value={pavilhao}
//                 onChange={(e) => setPavilhao(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Cela
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
//                 placeholder="Ex: 15"
//                 value={cela}
//                 onChange={(e) => setCela(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Dia de Visita
//               </label>
//               <select
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
//                 value={diaVisita}
//                 onChange={(e) => setDiaVisita(e.target.value)}
//               >
//                 <option value="">Selecione o dia</option>
//                 <option value="Segunda-feira">Segunda-feira</option>
//                 <option value="Terça-feira">Terça-feira</option>
//                 <option value="Quarta-feira">Quarta-feira</option>
//                 <option value="Quinta-feira">Quinta-feira</option>
//                 <option value="Sexta-feira">Sexta-feira</option>
//                 <option value="Sábado">Sábado</option>
//                 <option value="Domingo">Domingo</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Card de Pertences */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//             <span>🎒</span>
//             Pertences Autorizados
//           </h2>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all">
//               <input
//                 type="checkbox"
//                 checked={ventilador}
//                 onChange={(e) => setVentilador(e.target.checked)}
//                 className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
//               />
//               <span className="flex items-center gap-2 font-medium text-gray-700">
//                 <span className="text-xl">🌀</span>
//                 Ventilador
//               </span>
//             </label>

//             <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
//               <input
//                 type="checkbox"
//                 checked={colchao}
//                 onChange={(e) => setColchao(e.target.checked)}
//                 className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//               />
//               <span className="flex items-center gap-2 font-medium text-gray-700">
//                 <span className="text-xl">🛏️</span>
//                 Colchão
//               </span>
//             </label>

//             <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-all">
//               <input
//                 type="checkbox"
//                 checked={tv}
//                 onChange={(e) => setTv(e.target.checked)}
//                 className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
//               />
//               <span className="flex items-center gap-2 font-medium text-gray-700">
//                 <span className="text-xl">📺</span>
//                 TV
//               </span>
//             </label>

//             <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-all">
//               <input
//                 type="checkbox"
//                 checked={radio}
//                 onChange={(e) => setRadio(e.target.checked)}
//                 className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
//               />
//               <span className="flex items-center gap-2 font-medium text-gray-700">
//                 <span className="text-xl">📻</span>
//                 Rádio
//               </span>
//             </label>
//           </div>
//         </div>

//         {/* Botões de Ação */}
//         <div className="flex gap-4">
//           <button
//             type="submit"
//             className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105"
//           >
//             ✓ Salvar Preso
//           </button>
//           <button
//             type="button"
//             onClick={() => nav("/Presos")}
//             className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
//           >
//             Cancelar
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import { collection, getDocs, addDoc } from "firebase/firestore";
// import UploadFoto from "../../components/UploadFoto";
// import { useNavigate } from "react-router-dom";

// export default function NovoPreso() {
//   const nav = useNavigate();

//   const [nome, setNome] = useState("");
//   const [situacao, setSituacao] = useState("Provisório");
//   const [foto, setFoto] = useState(null);
//   const [presidioId, setPresidioId] = useState("");
//   const [presidios, setPresidios] = useState([]);
  
//   // Novos campos
//   const [matricula, setMatricula] = useState("");
//   const [cela, setCela] = useState("");
//   const [pavilhao, setPavilhao] = useState("");
//   const [ventilador, setVentilador] = useState(false);
//   const [colchao, setColchao] = useState(false);
//   const [tv, setTv] = useState(false);
//   const [radio, setRadio] = useState(false);
//   const [diaVisita, setDiaVisita] = useState("");

//   // Carregar lista de presídios
//   async function carregarPresidios() {
//     const snap = await getDocs(collection(db, "presidios"));
//     setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//   }

//   async function salvar(e) {
//     e.preventDefault();

//     const p = presidios.find((x) => x.id === presidioId);

//     await addDoc(collection(db, "Presos"), {
//       nome,
//       situacao,
//       foto: foto || null,
//       presidioId: presidioId || null,
//       presidioNome: p?.nome ?? "",
//       matricula,
//       cela,
//       pavilhao,
//       ventilador,
//       colchao,
//       tv,
//       radio,
//       diaVisita,
//       criadoEm: new Date(),
//     });

//     nav("/Presos");
//   }

//   useEffect(() => {
//     carregarPresidios();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Novo Preso</h1>

//       <form onSubmit={salvar} className="flex flex-col gap-4 max-w-2xl">
        
//         {/* Upload e preview da foto */}
//         <div className="flex flex-col gap-2">
//           <UploadFoto onUpload={setFoto} />
//           {foto && (
//             <img
//               src={foto}
//               className="w-32 h-32 rounded border object-cover"
//               alt="Preview"
//             />
//           )}
//         </div>

//         {/* Informações básicas */}
//         <div className="grid grid-cols-2 gap-4">
//           <input
//             className="border p-2 rounded"
//             placeholder="Nome completo"
//             value={nome}
//             onChange={(e) => setNome(e.target.value)}
//             required
//           />

//           <input
//             className="border p-2 rounded"
//             placeholder="Matrícula"
//             value={matricula}
//             onChange={(e) => setMatricula(e.target.value)}
//             required
//           />
//         </div>

//         {/* Presídio e situação */}
//         <div className="grid grid-cols-2 gap-4">
//           <select
//             className="border p-2 rounded"
//             value={presidioId}
//             onChange={(e) => setPresidioId(e.target.value)}
//             required
//           >
//             <option value="">Selecione o presídio</option>
//             {presidios.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.nome}
//               </option>
//             ))}
//           </select>

//           <select
//             className="border p-2 rounded"
//             value={situacao}
//             onChange={(e) => setSituacao(e.target.value)}
//           >
//             <option>Provisório</option>
//             <option>Sentenciado </option>
//             <option>Saída temporária</option>
//             <option>Transferido</option>
//             <option>Fuga</option>
//           </select>
//         </div>

//         {/* Localização */}
//         <div className="grid grid-cols-2 gap-4">
//           <input
//             className="border p-2 rounded"
//             placeholder="Pavilhão"
//             value={pavilhao}
//             onChange={(e) => setPavilhao(e.target.value)}
//           />

//           <input
//             className="border p-2 rounded"
//             placeholder="Cela"
//             value={cela}
//             onChange={(e) => setCela(e.target.value)}
//           />
//         </div>

//         {/* Dia de visita */}
//         <div>
//           <label className="block text-sm font-semibold mb-1">Dia de Visita</label>
//           <select
//             className="border p-2 rounded w-full"
//             value={diaVisita}
//             onChange={(e) => setDiaVisita(e.target.value)}
//           >
//             <option value="">Selecione o dia</option>
//             <option value="Segunda-feira">Segunda-feira</option>
//             <option value="Terça-feira">Terça-feira</option>
//             <option value="Quarta-feira">Quarta-feira</option>
//             <option value="Quinta-feira">Quinta-feira</option>
//             <option value="Sexta-feira">Sexta-feira</option>
//             <option value="Sábado">Sábado</option>
//             <option value="Domingo">Domingo</option>
//           </select>
//         </div>

//         {/* Pertences - Checkboxes */}
//         <div className="border rounded p-4">
//           <h3 className="font-semibold mb-3">Pertences</h3>
//           <div className="grid grid-cols-2 gap-3">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={ventilador}
//                 onChange={(e) => setVentilador(e.target.checked)}
//                 className="w-4 h-4"
//               />
//               <span>Ventilador</span>
//             </label>

//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={colchao}
//                 onChange={(e) => setColchao(e.target.checked)}
//                 className="w-4 h-4"
//               />
//               <span>Colchão</span>
//             </label>

//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={tv}
//                 onChange={(e) => setTv(e.target.checked)}
//                 className="w-4 h-4"
//               />
//               <span>TV</span>
//             </label>

//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={radio}
//                 onChange={(e) => setRadio(e.target.checked)}
//                 className="w-4 h-4"
//               />
//               <span>Rádio</span>
//             </label>
//           </div>
//         </div>

//         <button className="bg-emerald-600 p-3 rounded text-white font-semibold hover:bg-emerald-700">
//           Salvar
//         </button>
//       </form>
//     </div>
//   );
// }


// codigo original
// import { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import { collection, getDocs, addDoc } from "firebase/firestore";
// import UploadFoto from "../../components/UploadFoto";
// import { useNavigate } from "react-router-dom";


// export default function NovoPreso() {
//   const nav = useNavigate();

//   const [nome, setNome] = useState("");
//   const [situacao, setSituacao] = useState("Provisório");
//   const [foto, setFoto] = useState(null);
//   const [presidioId, setPresidioId] = useState("");
//   const [presidios, setPresidios] = useState([]);

//   // Carregar lista de presídios
//   async function carregarPresidios() {
//     const snap = await getDocs(collection(db, "presidios"));
//     setPresidios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//   }

//   async function salvar(e) {
//     e.preventDefault();

//     const p = presidios.find((x) => x.id === presidioId);

//     await addDoc(collection(db, "Presos"), {
//       nome,
//       situacao,
//       foto: foto || null,
//       presidioId: presidioId || null,
//       presidioNome: p?.nome ?? "",
//       criadoEm: new Date(),
//     });

//     nav("/Presos");
//   }

//   useEffect(() => {
//     carregarPresidios();
//   }, []);

//   return (
//     <div>

//       <h1 className="text-2xl font-bold mb-4">Novo Preso</h1>

//       <form onSubmit={salvar} className="flex flex-col gap-4 w-80">

//         {/* upload */}
//         <UploadFoto onUpload={setFoto} />

//         {/* preview */}
//         {foto && (
//           <img
//             src={foto}
//             className="w-32 h-32 rounded border object-cover"
//           />
//         )}

//         <input
//           className="border p-2 rounded"
//           placeholder="Nome completo"
//           onChange={(e) => setNome(e.target.value)}
//         />

//         <select
//           className="border p-2 rounded"
//           onChange={(e) => setSituacao(e.target.value)}
//         >
//           <option>Provisório</option>
//           <option>Condenado</option>
//           <option>Saída temporária</option>
//           <option>Transferido</option>
//           <option>Fuga</option>
//         </select>

//         <select
//           className="border p-2 rounded"
//           onChange={(e) => setPresidioId(e.target.value)}
//         >
//           <option value="">Selecione o presídio</option>
//           {presidios.map((p) => (
//             <option key={p.id} value={p.id}>
//               {p.nome}
//             </option>
//           ))}
//         </select>

//         <button className="bg-emerald-600 p-2 rounded text-white">
//           Salvar
//         </button>
//       </form>
//     </div>
//   );
// }
