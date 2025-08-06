import { useState, useEffect, useMemo } from 'react';

// Define a interface para os dados das vagas que virão da API
interface VagaOcupada {
  id: number;
  placa: string;
  modelo: string;
  andar: string;
  lado: 'A' | 'B';
  vaga: string;
  data_entrada: string;
}

export default function Dashboard() {
  const totalAndares = 21;
  const lados = ["A", "B"]; // Corrigido de ["A", "V"] para corresponder aos filtros
  const vagasPorAndar = 6;
  const totalVagas = totalAndares * lados.length * vagasPorAndar;

  const [vagasOcupadas, setVagasOcupadas] = useState<VagaOcupada[]>([]);
  const [filtroAndar, setFiltroAndar] = useState('');
  const [filtroLado, setFiltroLado] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    // Busca os carros estacionados para saber quais vagas estão ocupadas
    fetch('http://localhost:4001/api/cadastrar')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.carros)) {
          setVagasOcupadas(data.carros);
        }
      })
  }, []);

  // Otimiza a verificação de vagas ocupadas
  const occupiedSpots = useMemo(() => {
    const spotSet = new Set<string>();
    vagasOcupadas.forEach(v => {
      spotSet.add(`${v.andar}-${v.lado}-${v.vaga}`);
    });
    return spotSet;
  }, [vagasOcupadas]);

  const isSpotOccupied = (andar: number, lado: string, vaga: number): boolean => {
    return occupiedSpots.has(`${andar}-${lado}-${vaga}`);
  };

  const handleLimparFiltros = () => {
    setFiltroAndar('');
    setFiltroLado('');
    setFiltroStatus('');
  };

  const numVagasOcupadas = vagasOcupadas.length;
  const vagasLivres = totalVagas - numVagasOcupadas;
  const taxaOcupacao = totalVagas > 0 ? ((numVagasOcupadas / totalVagas) * 100).toFixed(1) : "0";

  return (
    <>
      <div id="dashboard" className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* <!-- Cards de Estatísticas --> */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Total de Vagas</h3>
                <p className="text-3xl font-bold text-blue-600">{totalVagas}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Vagas Ocupadas</h3>
                <p className="text-3xl font-bold text-red-600" id="vagasOcupadas">{numVagasOcupadas}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Vagas Livres</h3>
                <p className="text-3xl font-bold text-green-600" id="vagasLivres">{vagasLivres}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Taxa de Ocupação</h3>
                <p className="text-3xl font-bold text-purple-600" id="taxaOcupacao">{taxaOcupacao}%</p>
            </div>
        </div>

        {/* <!-- Filtros --> */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select id="filtroAndar" className="border rounded px-3 py-2" value={filtroAndar} onChange={e => setFiltroAndar(e.target.value)}>
                    <option value="">Todos os Andares</option>
                    {Array.from({ length: totalAndares }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{`Andar ${i + 1}`}</option>
                    ))}
                </select>
                <select id="filtroLado" className="border rounded px-3 py-2" value={filtroLado} onChange={e => setFiltroLado(e.target.value)}>
                    <option value="">Todos os Lados</option>
                    <option value="A">Lado A</option>
                    <option value="B">Lado B</option>
                </select>
                <select id="filtroStatus" className="border rounded px-3 py-2" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                    <option value="">Todos os Status</option>
                    <option value="livre">Livres</option>
                    <option value="ocupada">Ocupadas</option>
                </select>
                <button onClick={handleLimparFiltros} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded col-span-1 md:col-start-5">Limpar Filtros</button>
            </div>
        </div>

        {/* <!-- Visualização das Vagas --> */}
        <div id="vagasVisualizacao" className="max-h-96 overflow-y-auto space-y-6 border rounded-lg p-4">
                {Array.from({ length: totalAndares }, (_, andarIdx) => {
                    const andar = andarIdx + 1;
                    if (filtroAndar && andar.toString() !== filtroAndar) {
                        return null;
                    }

                    return (
            <div key={andar} className="mb-4">
                    <h4 className="font-bold mb-2">{`Andar ${andar}`}</h4>
                <div className="grid grid-cols-2 gap-4 justify-center">
                        {lados.map(lado => {
                            if (filtroLado && lado !== filtroLado) {
                                return <div key={lado}></div>;
                            }}
                        )}
                </div>
            </div>
                )
                })}
        </div>
    </div>
    </>
  );
}
