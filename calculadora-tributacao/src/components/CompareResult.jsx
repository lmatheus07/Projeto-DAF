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
    alert("Resultado enviado ao NAF.");
  }

  return (
    <div className="card p-4 mt-4 shadow-sm">
      <h5>Resultado da comparação</h5>

      <div className="row mt-3">
        <div className="col-md-6">
          <h6>Pessoa Física (PF)</h6>
          <p className="mb-1"><strong>Renda:</strong> R$ {Number(input.rendaMensal).toFixed(2)}</p>
          <p className="mb-1"><strong>Custos deduzidos:</strong> R$ {Number(input.custosMensais).toFixed(2)}</p>
          <p className="mb-1"><strong>Base de cálculo:</strong> R$ {PF.base.toFixed(2)}</p>
          <p className="mb-1"><strong>Imposto devido (mensal):</strong> R$ {PF.imposto.toFixed(2)}</p>
          <p className="mb-1"><strong>Renda líquida após IR:</strong> R$ {PF.liquido.toFixed(2)}</p>
          <p className="mb-0 small text-muted">Alíquota efetiva aproximada: {(PF.effectiveRate * 100).toFixed(2)}%</p>
        </div>

        <div className="col-md-6">
          <h6>Pessoa Jurídica (PJ) — Simples (estimado)</h6>
          <p className="mb-1"><strong>Faturamento:</strong> R$ {Number(input.rendaMensal).toFixed(2)}</p>
          <p className="mb-1"><strong>Imposto (Simples) mensal:</strong> R$ {PJ.imposto.toFixed(2)}</p>
          <p className="mb-1"><strong>Renda líquida após impostos:</strong> R$ {PJ.liquido.toFixed(2)}</p>
          <p className="mb-0 small text-muted">Alíquota efetiva aproximada: {(PJ.effectiveRate * 100).toFixed(2)}%</p>
          <p className="small text-muted mb-0">Faixa utilizada: {PJ.faixa ? `até R$ ${PJ.faixa.upToAnnual.toLocaleString()}` : "—"}</p>
        </div>
      </div>

      <hr />

      <div className="d-flex gap-2">
        <button className="btn btn-outline-secondary" onClick={() => navigator.clipboard?.writeText(JSON.stringify(result))}>Copiar resultado (JSON)</button>
        <button className="btn btn-success" onClick={handleSendToNAF} disabled={sending}>
          {sending ? "Enviando..." : "Enviar ao NAF"}
        </button>
      </div>
    </div>
  );
}
