// src/components/BotoesPDF.tsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { loadImageAsBase64 } from "../utils/loadImageBase64";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type Props = {
  Presos: any[];
  conferencias: any[];
  presidioId?: string;
};

export default function BotoesPDF({ Presos, conferencias, presidioId }: Props) {
  // helper para buscar nome do presídio por id
  async function fetchPresidioNome(id: string) {
    try {
      const snap = await getDoc(doc(db, "presidios", id));
      if (snap.exists()) return snap.data().nome || id;
    } catch (err) {
      console.error("Erro ao buscar presídio:", err);
    }
    return id;
  }

  // helper para buscar nome do usuário (agente)
  async function fetchUsuarioNome(id: string) {
    try {
      const snap = await getDoc(doc(db, "usuarios", id));
      if (snap.exists()) {
        const data = snap.data();
        return data.nomeCompleto || data.email || id;
      }
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
    }
    return id;
  }

  async function gerarPDFConferenciasPremium() {
    // filtra as conferências pelo presidioId (se informado)
    const confsFiltradas = presidioId
      ? conferencias.filter((c) => c.presidioId === presidioId)
      : conferencias;

    if (!confsFiltradas || confsFiltradas.length === 0) {
      alert("Nenhuma conferência encontrada para a unidade selecionada.");
      return;
    }

    // carrega brasões
    const brasaoMaranhao = await loadImageAsBase64("/images/brasao-maranhao.png");
    const brasaoSeap = await loadImageAsBase64("/images/brasao-seap.png");

    // nome do presídio (se presidioId foi passado, buscar somente uma vez)
    let presidioNome = "Todas Unidades";
    if (presidioId) presidioNome = await fetchPresidioNome(presidioId);

    // buscar nomes dos agentes (faz em paralelo)
    const agentesMap: Record<string, string> = {};
    await Promise.all(
      confsFiltradas.map(async (c) => {
        if (c.usuarioId && !agentesMap[c.usuarioId]) {
          agentesMap[c.usuarioId] = await fetchUsuarioNome(c.usuarioId);
        }
      })
    );

    // calculos de resumo agregado (média de ocupação, total etc)
    let somaTotalPresos = 0;
    let somaTotalConferidos = 0;
    for (const c of confsFiltradas) {
      somaTotalPresos += c.totalPresos || 0;
      somaTotalConferidos += c.totalConferidos || 0;
    }
    const somaFaltantes = somaTotalPresos - somaTotalConferidos;
    const mediaOcupacao = confsFiltradas.length
      ? (somaTotalConferidos / (somaTotalPresos || 1)) * 100
      : 0;

    // cria doc em paisagem
    const docPDF = new jsPDF("landscape", "pt", "a4");
    const pageWidth = docPDF.internal.pageSize.width;
    const margin = 40;
    let cursorY = 40;

    // cabeçalho com brasões
    docPDF.addImage(brasaoMaranhao, "PNG", margin, cursorY, 80, 80);
    docPDF.addImage(brasaoSeap, "PNG", pageWidth - margin - 120, cursorY, 120, 80);

    docPDF.setFontSize(18);
    docPDF.setFont(undefined, "bold");
    docPDF.text("SECRETARIA DE ADMINISTRAÇÃO PENITENCIÁRIA", pageWidth / 2, cursorY + 30, { align: "center" });
    docPDF.setFontSize(14);
    docPDF.text("Relatório de Conferências", pageWidth / 2, cursorY + 52, { align: "center" });

    cursorY += 100;
    docPDF.setLineWidth(0.8);

    // Resumo da unidade (dados agregados)
    docPDF.setFontSize(12);
    docPDF.setFont(undefined, "normal");
    docPDF.text(`Unidade: ${presidioNome}`, margin, cursorY);
    docPDF.text(`Total de Conferências: ${confsFiltradas.length}`, margin + 300, cursorY);
    cursorY += 18;
    docPDF.text(`Total de Presos (soma): ${somaTotalPresos}`, margin, cursorY);
    docPDF.text(`Total Conferidos (soma): ${somaTotalConferidos}`, margin + 300, cursorY);
    cursorY += 18;
    docPDF.text(`Faltantes (soma): ${somaFaltantes}`, margin, cursorY);
    docPDF.text(`Média de ocupação: ${mediaOcupacao.toFixed(1)}%`, margin + 300, cursorY);
    cursorY += 24;

    // Para cada conferência, escrever um bloco resumo (se desejar)
    // Aqui apenas pulamos para a tabela principal
    // Prepara linhas da tabela
    const rows: any[] = await Promise.all(
      confsFiltradas.map(async (c) => {
        const dataFormatada = c.data?.seconds
          ? new Date(c.data.seconds * 1000).toLocaleString("pt-BR")
          : (c.data as string) || "-";

        const agente = c.usuarioId ? agentesMap[c.usuarioId] || (await fetchUsuarioNome(c.usuarioId)) : "-";
        const presNomeRow = c.presidioId ? (c.presidioId === presidioId ? presidioNome : await fetchPresidioNome(c.presidioId)) : presidioNome;

        const total = c.totalPresos || 0;
        const conferidos = c.totalConferidos || 0;
        const faltantes = total - conferidos;

        return [dataFormatada, presNomeRow, agente, String(total), String(conferidos), String(faltantes), c.observacao || "-"];
      })
    );

    // inserir tabela com autotable; ajustar startY se cursorY estiver muito baixo
    autoTable(docPDF, {
      startY: cursorY,
      head: [["Data / Hora", "Presídio", "Agente", "Total", "Conferidos", "Faltantes", "Observação"]],
      body: rows,
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [30, 64, 175] },
      theme: "grid",
      margin: { left: margin, right: margin },
    });

    // ASSINATURA (no final da última página)
    const pages = docPDF.getNumberOfPages();
    docPDF.setPage(pages);
    const height = docPDF.internal.pageSize.height;
    const assinaturaY = height - 110;
    docPDF.setFontSize(11);
    docPDF.text("__________________________________", margin + 120, assinaturaY);
    docPDF.text("Assinatura do Responsável", margin + 150, assinaturaY + 18);

    // RODAPÉ
    docPDF.setFontSize(9);
    docPDF.text(
      "Documento gerado automaticamente pelo Sistema SEAP — Governo do Maranhão",
      pageWidth / 2,
      height - 20,
      { align: "center" }
    );

    // salvar com nome que identifica a unidade
    const nomeArquivo = `Relatorio_Conferencias_${presidioNome.replace(/\s+/g, "_")}.pdf`;
    docPDF.save(nomeArquivo);
  }

  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={gerarPDFConferenciasPremium}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700"
      >
        PDF Conferências 
      </button>
    </div>
  );
}
