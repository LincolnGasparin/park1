"use client";

import React from 'react';
import Dashboard from '@/components/dashboard';
import Header from '@/components/header';
import Cadastro from '@/components/cadastro';
import Financeiro from '@/components/financeiro';
import Caixa from '@/components/caixa';


export default function Home() {
  const [section, setSection] = React.useState("dashboard");
  return (
    <>
    <Header onChangeSection={setSection} />
      {section === "dashboard" && <Dashboard />}
      {section === "cadastro" && <Cadastro />}
      {section === "financeiro" && <Financeiro />}
      {section === "caixa" && <Caixa />}
    </>
  );
}
