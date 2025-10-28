import React, { useState } from "react";
import Header from "./components/Header";
import CalculatorForm from "./components/CalculatorForm";
import CompareResult from "./components/CompareResult";
import { compareTaxes } from "/src/util/tax";

export default function App() {
  const [result, setResult] = useState(null);

  async function handleCompare(data) {
    // data: { rendaMensal, custosMensais, profissao, sendEmail, emailUser, emailNAF }
    const comparison = compareTaxes({ rendaMensal: data.rendaMensal, custosMensais: data.custosMensais });
    setResult({ ...comparison, input: { ...comparison.input, profissao: data.profissao } });

    // Se o usuário pediu envio por e-mail, podemos simular gerando um "payload"
    if (data.sendEmail && data.emailUser) {
      // simulam a criação do e-mail
      const body = buildEmailBody(comparison);
      // aqui você mandaria pra um backend que envia emails — por enquanto só console.log e alert
      console.log("Enviar para usuário:", data.emailUser, body);
      alert(`E-mail com o resultado preparado para: ${data.emailUser} (simulado).`);
    }

    if (data.emailNAF) {
      // habilita botão na tela para "Enviar ao NAF (simulado)"
      // ou chamar endpoint real se existir
      console.log("Email NAF informado:", data.emailNAF);
    }
  }

  function buildEmailBody(comparison) {
    return `
Comparação PF x PJ
Renda mensal: R$ ${comparison.input.rendaMensal.toFixed(2)}
Custos mensais: R$ ${comparison.input.custosMensais.toFixed(2)}

PF - Imposto: R$ ${comparison.PF.imposto.toFixed(2)} / Líquido: R$ ${comparison.PF.liquido.toFixed(2)}
PJ - Imposto: R$ ${comparison.PJ.imposto.toFixed(2)} / Líquido: R$ ${comparison.PJ.liquido.toFixed(2)}
    `;
  }

  return (
    <div className="container mt-4">
      <Header />
      <CalculatorForm onCompare={handleCompare} />
      <CompareResult result={result} onSendEmailNAF={() => { /* feedback opcional */ }} />
    </div>
  );
}
