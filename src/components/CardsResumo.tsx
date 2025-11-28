export default function CardsResumo({ Presos, conferencias, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="animate-pulse h-24 bg-gray-200 rounded-xl"></div>
        <div className="animate-pulse h-24 bg-gray-200 rounded-xl"></div>
        <div className="animate-pulse h-24 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="bg-white shadow-sm border rounded-xl p-5">
        <p className="text-sm text-gray-500">Total de Presos</p>
        <p className="text-3xl font-bold text-gray-900">{Presos.length}</p>
      </div>

      <div className="bg-white shadow-sm border rounded-xl p-5">
        <p className="text-sm text-gray-500">Conferências Realizadas</p>
        <p className="text-3xl font-bold text-blue-700">{conferencias.length}</p>
      </div>

      <div className="bg-white shadow-sm border rounded-xl p-5">
        <p className="text-sm text-gray-500">Média de Presos por Pavilhão</p>
        <p className="text-3xl font-bold text-green-700">
          {Presos.length > 0 ? Math.round(Presos.length / 6) : 0}
        </p>
      </div>

    </div>
  );
}
