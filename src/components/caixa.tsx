
import React, { useState, useRef } from 'react';

export default function Caixa() {

const [statusCaixa, setStatusCaixa] = useState<"aberto" | "fechado">("fechado");
const [caixaId, setCaixaId] = useState<string | null>(null);
const valorInicialRef = useRef<HTMLInputElement>(null);
const operadorRef = useRef<HTMLInputElement>(null);




// if(caixaStatusLocal === "aberto" && caixaIdlocal){
//     setStatusCaixa("aberto");
//     setCaixaId(caixaIdlocal);
// }else{
//     setStatusCaixa("fechado");
//     setCaixaId(null);
// }


function abrirCaixa(e: React.FormEvent) {
    e.preventDefault();
    const valorInicial = valorInicialRef.current?.value;
    const operador = operadorRef.current?.value;
    const dt_entrada = new Date().toISOString().slice(0, 19).replace("T", " ");
 
    fetch('http://localhost:4000/api/caixa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data_abertura: dt_entrada, saldo_abertura: valorInicial, saldo_fechamento: 0, operador: operador }),
    })
      .then(res => res.json())
      .then(() => {
        // Após abrir, buscar status novamente para atualizar id e status
        fetch('/api/caixa')
          .then(res => res.json())
          .then(data => {
            if (data && data.id) {
              setStatusCaixa('aberto');
              setCaixaId(data.id);
              localStorage.setItem('caixaId', data.id);
            }
          });
      });
  }

    function fecharCaixa() {
    const valorFinal = 0; // Substitua pelo valor correto
    const dt_saida = new Date().toISOString().slice(0, 19).replace("T", " ");;

    fetch('http://localhost:4000/api/caixa', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saldo_fechamento: valorFinal, data_fechamento: dt_saida }),
    })
      .then(res => res.json())
      .then(() => {
        setStatusCaixa('fechado');
        setCaixaId(null);
        localStorage.removeItem('caixaId');
      });
  }

  return (
    <>
    <div id="caixa" className="container mx-auto p-6 ">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-6">Controle de Caixa</h2>
          <div className="mb-6">
            <span className={`px-3 py-1 rounded col-auto ${statusCaixa === "aberto" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
              {statusCaixa === "aberto" ? "Caixa Aberto" : "Caixa Fechado"}
            </span>
          </div>
          {statusCaixa === "fechado" && (
          <div id="formAberturaCaixa" className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Abrir Caixa</h3>
            <form onSubmit={abrirCaixa}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                         <div>
                             <label className="block text-sm font-medium mb-2">Valor Inicial (R$)</label>
                             <input type="number" id="valorInicial" step="0.01" min="0" placeholder="0.00" className="w-full border rounded px-3 py-2" ref={valorInicialRef} required />
                         </div>
                         <div>
                             <label className="block text-sm font-medium mb-2">Operador</label>
                             <input type="text" id="operador" placeholder="Nome do operador" className="w-full border rounded px-3 py-2" ref={operadorRef} required/>
                         </div>
                     </div>
                     <div className="flex space-x-4">
                         <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">Abrir Caixa</button>
                     </div>
                 </form>
            </div>
           
          )}
          {statusCaixa === "aberto" && (
            <div id="caixaAberto" className="">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                     <div className="bg-blue-100 p-4 rounded-lg">
                         <h3 className="text-lg font-semibold text-blue-800">Valor Inicial</h3>
                         <p className="text-2xl font-bold text-blue-600" id="valorInicialCaixa">R$ 0,00</p>
                     </div>
                     <div className="bg-green-100 p-4 rounded-lg">
                         <h3 className="text-lg font-semibold text-green-800">Receita do Dia</h3>
                         <p className="text-2xl font-bold text-green-600" id="receitaDiaCaixa">R$ 0,00</p>
                     </div>
                     <div className="bg-purple-100 p-4 rounded-lg">
                         <h3 className="text-lg font-semibold text-purple-800">Total em Caixa</h3>
                         <p className="text-2xl font-bold text-purple-600" id="totalCaixa">R$ 0,00</p>
                     </div>
                 </div>
                
                 <div className="flex space-x-4 mb-6">
                     <button onSubmit={fecharCaixa} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded">Fechar Caixa</button>
                     <button  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">Atualizar Valores</button>
                 </div>
             </div>
          )}
        </div>
    

        {/* <!-- Histórico de Caixas --> */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Histórico de Caixas</h3>
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left">Data</th>
                            <th className="px-4 py-2 text-left">Operador</th>
                            <th className="px-4 py-2 text-left">Abertura</th>
                            <th className="px-4 py-2 text-left">Fechamento</th>
                            <th className="px-4 py-2 text-left">Valor Inicial</th>
                            <th className="px-4 py-2 text-left">Receita</th>
                            <th className="px-4 py-2 text-left">Total Final</th>
                            <th className="px-4 py-2 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="tabelaHistoricoCaixas">
                        {/* <!-- Histórico será preenchido aqui --> */}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    {/* <!-- Modal de Detalhes do Carro --> */}
    <div id="modalDetalhes" className="fixed inset-0 bg-black bg-opacity-50 modal hidden flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Detalhes do Carro</h3>
            <div id="detalhesConteudo">
                {/* <!-- Conteúdo será preenchido dinamicamente --> */}
            </div>
            <div className="flex space-x-4 mt-6">
                <button id="btnLiberar" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Liberar Vaga</button>
                <button className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded">Fechar</button>
            </div>
        </div>
    </div>

    {/* <!-- Modal de Relatório de Fechamento --> */}
    <div id="modalRelatorio" className="fixed inset-0 bg-black bg-opacity-50 modal hidden flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Relatório de Fechamento de Caixa</h3>
            <div id="relatorioConteudo">
                {/* <!-- Conteúdo será preenchido dinamicamente --> */}
            </div>
            <div className="flex space-x-4 mt-6">
                <button  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Confirmar Fechamento</button>
                <button  className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded">Cancelar</button>
            </div>
        </div>
    </div>
    </>
  );
}







{/* <div id="caixa" className="container mx-auto p-6 ">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-6">Controle de Caixa</h2>
            
            {/* <!-- Status do Caixa --> */}
            // <div id="caixaStatus" className="mb-6">
                {/* <!-- Status será preenchido aqui --> */}
            {/* </div> */}

            {/* <!-- Formulário de Abertura de Caixa --> */}
            // <div id="formAberturaCaixa" className="hidden mb-6">
            //     <h3 className="text-lg font-semibold mb-4">Abrir Caixa</h3>
            //     <form >
            //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            //             <div>
            //                 <label className="block text-sm font-medium mb-2">Valor Inicial (R$)</label>
            //                 <input type="number" id="valorInicial" step="0.01" min="0" placeholder="0.00" className="w-full border rounded px-3 py-2" required/>
            //             </div>
            //             <div>
            //                 <label className="block text-sm font-medium mb-2">Operador</label>
            //                 <input type="text" id="operador" placeholder="Nome do operador" className="w-full border rounded px-3 py-2" required/>
            //             </div>
            //         </div>
            //         <div className="flex space-x-4">
            //             <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">Abrir Caixa</button>
            //         </div>
            //     </form>
            // </div>

            {/* <!-- Informações do Caixa Aberto --> */}
            // <div id="caixaAberto" className="hidden">
            //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            //         <div className="bg-blue-100 p-4 rounded-lg">
            //             <h3 className="text-lg font-semibold text-blue-800">Valor Inicial</h3>
            //             <p className="text-2xl font-bold text-blue-600" id="valorInicialCaixa">R$ 0,00</p>
            //         </div>
            //         <div className="bg-green-100 p-4 rounded-lg">
            //             <h3 className="text-lg font-semibold text-green-800">Receita do Dia</h3>
            //             <p className="text-2xl font-bold text-green-600" id="receitaDiaCaixa">R$ 0,00</p>
            //         </div>
            //         <div className="bg-purple-100 p-4 rounded-lg">
            //             <h3 className="text-lg font-semibold text-purple-800">Total em Caixa</h3>
            //             <p className="text-2xl font-bold text-purple-600" id="totalCaixa">R$ 0,00</p>
            //         </div>
            //     </div>
                
            //     <div className="flex space-x-4 mb-6">
            //         <button  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded">Fechar Caixa</button>
            //         <button  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">Atualizar Valores</button>
            //     </div>
            // </div>
        // </div> */}