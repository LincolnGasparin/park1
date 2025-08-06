interface HeaderProps {
  onChangeSection: (section: string) => void;
}
import {useEffect,useState}from 'react';

export default function Header({ onChangeSection }: HeaderProps) {
const [caixaStatus, setCaixaStatus] = useState<"aberto" | "fechado">("fechado");
const [caixaId, setCaixaId] = useState<string | null>(null);


useEffect(() => {
    verificarStatusCaixa();
}, []);

function verificarStatusCaixa() {

    fetch('http://localhost:4000/api/caixa',{
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.id) {
        setCaixaStatus('aberto');
        setCaixaId(data.id);
        localStorage.setItem('caixaId', data.id); // Salva o id no localStorage
      } else {
        setCaixaStatus('fechado');
        setCaixaId(null);
        localStorage.removeItem('caixaId');
      }
    });

}



  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">🚗 Sistema de Estacionamento</h1>
        <div className="flex space-x-4 items-center">
            <div>
                <span className={`px-3 py-1 rounded mr-4 ${caixaStatus === "aberto" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
            {caixaStatus === "aberto"
              ? `Caixa Aberto (ID: ${caixaId})`
              : "Caixa Fechado"}
          </span>
            </div>
          <button onClick={() => onChangeSection("dashboard")} className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">Dashboard</button>
          <button onClick={() => onChangeSection("cadastro")} className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded">Cadastrar Carro</button>
          <button onClick={() => onChangeSection("financeiro")} className="bg-yellow-500 hover:bg-yellow-700 px-4 py-2 rounded">Financeiro</button>
          <button onClick={() => onChangeSection("caixa")} className="bg-purple-500 hover:bg-purple-700 px-4 py-2 rounded">Caixa</button>
        </div>
      </div>
    </header>
  );
}