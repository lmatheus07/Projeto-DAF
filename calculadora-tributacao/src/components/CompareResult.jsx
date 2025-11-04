import React, { useState } from "react";

export default function CompareResult({ result, onSendEmailNAF }) {
  const [sending, setSending] = useState(false);
  if (!result) return null;

  const { PF, PJ, input } = result;

  async function handleSendToNAF() {
    setSending(true);
    // Simulação de envio: chamaria API real aqui (fetch). Aqui só aguardamos 1s e retornamos sucesso.
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    onSendEmailNAF && onSendEmailNAF({ success: true });
    alert("Resultado enviado ao NAF (simulado).");
  }

  return (
    <div className="card p-4 mt-4 shadow-lg animate__animated animate__fadeInUp">
      <h5>Resultado da comparação</h5>

      <div className="row mt-3">
        <div className="col-md-6">
          <h6>Pessoa Física (PF)</h6>
          <p className="mb-1"><strong>Renda Bruta:</strong> R$ {Number(input.rendaMensal).toFixed(2)}</p>
          <p className="mb-1"><strong>Custos deduzidos:</strong> R$ {Number(input.custosMensais).toFixed(2)}</p>
          <p className="mb-1"><strong>Base de cálculo:</strong> R$ {PF.base.toFixed(2)}</p>
          <div className="ms-3 mb-2 small">
            <p className="mb-1">Faixa: {PF.bracket ? `${(PF.bracket.rate * 100).toFixed(1)}% (dedução: R$ ${PF.bracket.deduction.toFixed(2)})` : "Isento"}</p>
          </div>
          <p className="mb-1"><strong>Imposto devido (mensal):</strong> R$ {PF.imposto.toFixed(2)}</p>
          <p className="mb-1"><strong>Renda líquida após IR:</strong> R$ {PF.liquido.toFixed(2)}</p>
          <p className="mb-0 small text-muted">Alíquota efetiva: {(PF.effectiveRate * 100).toFixed(2)}%</p>
        </div>

        <div className="col-md-6">
          <h6>Pessoa Jurídica (PJ) — Simples Nacional</h6>
          <p className="mb-1"><strong>Faturamento mensal:</strong> R$ {Number(input.rendaMensal).toFixed(2)}</p>
          <div className="ms-3 mb-2">
            <p className="mb-1"><strong>Simples Nacional ({(PJ.faixa.rate * 100).toFixed(1)}%):</strong> R$ {PJ.impostoMensal.toFixed(2)}</p>
            <p className="mb-1"><strong>Pró-labore (28%):</strong> R$ {PJ.prolabore.toFixed(2)}</p>
            <p className="mb-1"><strong>INSS (11% do pró-labore):</strong> R$ {PJ.inss.toFixed(2)}</p>
            <p className="mb-1"><strong>IR sobre pró-labore:</strong> R$ {PJ.irProlabore.imposto.toFixed(2)}</p>
          </div>
          <p className="mb-1"><strong>Total de impostos:</strong> R$ {PJ.totalImpostos.toFixed(2)}</p>
          <p className="mb-1"><strong>Renda líquida após impostos:</strong> R$ {PJ.liquido.toFixed(2)}</p>
          <p className="mb-0 small text-muted">Alíquota efetiva total: {(PJ.effectiveRate * 100).toFixed(2)}%</p>
          <p className="small text-muted mb-0">Faixa Simples: até R$ {PJ.faixa.upToAnnual.toLocaleString()}</p>
        </div>
      </div>

      <hr />

      <div className="d-flex gap-2">
        <button className="btn btn-outline-secondary" onClick={() => navigator.clipboard?.writeText(JSON.stringify(result))}>Copiar resultado (JSON)</button>
        <button className="btn btn-success" onClick={handleSendToNAF} disabled={sending}>
          {sending ? "Enviando..." : "Enviar ao NAF (simulado)"}
        </button>
      </div>
    </div>
  );
}
