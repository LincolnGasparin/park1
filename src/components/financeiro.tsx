export default function Financeiro() {
  return (
   <>
   <div id="financeiro" className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-6">Painel Financeiro</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800">Receita Hoje</h3>
                    <p className="text-2xl font-bold text-green-600" id="receitaHoje">R$ 0,00</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800">Receita Semanal</h3>
                    <p className="text-2xl font-bold text-blue-600" id="receitaSemanal">R$ 0,00</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-800">Receita Mensal</h3>
                    <p className="text-2xl font-bold text-purple-600" id="receitaMensal">R$ 0,00</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Histórico de Saídas</h3>
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left">Placa</th>
                            <th className="px-4 py-2 text-left">Modelo</th>
                            <th className="px-4 py-2 text-left">Entrada</th>
                            <th className="px-4 py-2 text-left">Saída</th>
                            <th className="px-4 py-2 text-left">Dias</th>
                            <th className="px-4 py-2 text-left">Valor Pago</th>
                        </tr>
                    </thead>
                    <tbody id="tabelaHistorico">
                        {/* <!-- Histórico será preenchido aqui --> */}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
   </>
  );
}