import React from "react";
import { useRef } from "react";


export default function Cadastro() {   


const inputPlaca = useRef<HTMLInputElement>(null);
const inputModelo = useRef<HTMLInputElement>(null);
const andarRef = useRef<HTMLSelectElement>(null);
const ladoRef = useRef<HTMLSelectElement>(null);
const vagaRef = useRef<HTMLSelectElement>(null);
const horaEntradaRef = useRef<HTMLInputElement>(null);




const totalVagas = 252;
const vagas = Array.from({ length: totalVagas }, (_, i) => i + 1);
const totalAndares = 21;
const lados = ["A", "B"];
const vagasPorAndar = 6;

function getCurrentDateTimeLocal() {
  const now = new Date();
const pad = (n: number): string => n.toString().padStart(2, "0");
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

async function createUser(e: React.FormEvent){
    e.preventDefault(); // Impede o recarregamento da página

    const id_caixa = localStorage.getItem('caixaId');

    if (!id_caixa) {
        const alerta = document.getElementById('alertaCaixaFechado');
        if (alerta) alerta.style.display = 'block';
        return;
    }

    const placa = inputPlaca.current?.value;
    const modelo = inputModelo.current?.value;
    const andar = andarRef.current?.value;
    const lado = ladoRef.current?.value;
    const vaga = vagaRef.current?.value;
    const data_entrada = horaEntradaRef.current?.value;

    try {
        const response = await fetch('/api/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_caixa, modelo, placa, lado, andar, vaga, data_entrada }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Ocorreu um erro.');
        }

        console.log('Success:', result);
        alert('Carro cadastrado com sucesso!');
        // Limpa o formulário
        (e.target as HTMLFormElement).reset();

    } catch (error) {
        console.error('Error:', error);
        alert(`Erro ao cadastrar: ${error instanceof Error ? error.message : String(error)}`);
    }
}



    return (
        <>
        <div id="cadastro" className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <form id="formCadastro" onSubmit={createUser}>
            <div id="alertaCaixaFechado" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 hidden">
                ⚠️ O caixa está fechado! Abra o caixa primeiro para cadastrar carros.
            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Placa do Carro</label>
                        <input type="text" id="placa" placeholder="ABC-1234" className="w-full border rounded px-3 py-2" ref={inputPlaca}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Modelo do Carro</label>
                        <input type="text" id="modelo" placeholder="Ex: Honda Civic" className="w-full border rounded px-3 py-2" ref={inputModelo} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Andar</label>
                       <select id="andarCadastro" className="w-full border rounded px-3 py-2" ref={andarRef}>
                            <option value="">Selecione o andar</option>
                            {Array.from({ length: totalAndares }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{`Andar ${i + 1}`}</option>
                            ))}
                            </select>
                    </div>
                    <div>
                            <label className="block text-sm font-medium mb-2">Lado</label>
                            <select id="ladoCadastro" className="w-full border rounded px-3 py-2" ref={ladoRef}>
                                <option value="">Selecione o lado</option>
                                {lados.map(lado => (
                                <option key={lado} value={lado}>{`Lado ${lado}`}</option>
                                ))}
                            </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Vaga</label>
                        <select id="vagaCadastro" className="w-full border rounded px-3 py-2"   ref={vagaRef}>
                            <option value="">Selecione a vaga</option>
                            {Array.from({ length: vagasPorAndar }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{`Vaga ${i + 1}`}</option>
                            ))}
                            </select>
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Hora de Entrada</label>
                    <input type="datetime-local" id="horaEntrada" className="w-full border rounded px-3 py-2"  ref={horaEntradaRef} defaultValue={getCurrentDateTimeLocal()}/>
                </div>
                <div className="flex space-x-4">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">Cadastrar</button>
                    <button type="button" className="bg-gray-500 hover:bg-gray-700 text-white px-6 py-2 rounded">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
        </>
    );
}