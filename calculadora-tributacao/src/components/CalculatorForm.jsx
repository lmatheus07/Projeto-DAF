import React, { useState } from "react";
import InfoModal from "./InfoModal";

export default function CalculatorForm({ onCompare }) {
  const [renda, setRenda] = useState("");
  const [custos, setCustos] = useState("");
  const [profissao, setProfissao] = useState("Psicólogo(a)");
  const [sendEmail, setSendEmail] = useState(false);
  const [emailUser, setEmailUser] = useState("");
  const [emailNAF, setEmailNAF] = useState("");
  const [errors, setErrors] = useState({});
  const [showInfo, setShowInfo] = useState(false);

  function validate() {
    const e = {};
    const rendaNum = Number(renda);
    const custosNum = Number(custos);

    if (!renda) e.renda = "Renda mensal é obrigatória.";
    else if (rendaNum <= 0 || rendaNum > 15000) e.renda = "Informe um valor entre R$ 1 e R$ 15.000.";

    if (custos === "" || Number.isNaN(custosNum)) e.custos = "Custos mensais obrigatórios.";
    else if (custosNum < 0) e.custos = "Custos não podem ser negativos.";

    if (!profissao) e.profissao = "Profissão obrigatória.";

    if (sendEmail) {
      if (!emailUser) e.emailUser = "Informe um e-mail para envio.";
      else if (!/^\S+@\S+\.\S+$/.test(emailUser)) e.emailUser = "E-mail inválido.";
    }

    if (emailNAF && !/^\S+@\S+\.\S+$/.test(emailNAF)) e.emailNAF = "E-mail NAF inválido.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onCompare({
      rendaMensal: Number(renda),
      custosMensais: Number(custos),
      profissao,
      sendEmail,
      emailUser,
      emailNAF
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-lg animate__animated animate__fadeInUp">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Entradas</h5>
        <button type="button" className="btn btn-link p-0" onClick={() => setShowInfo(true)}>
          <img src="/src/images/info-circle.svg" alt="Informações" />
        </button>
      </div>

      <div className="mb-3">
        <label className="form-label">Renda Mensal (R$) — até R$ 15.000</label>
        <input type="number" min ="0" className={`form-control ${errors.renda ? "is-invalid" : ""}`}
               value={renda} onChange={(e) => setRenda(e.target.value)} step="0.01" />
        <div className="invalid-feedback">{errors.renda}</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Total de Custos Mensais (R$)</label>
        <input type="number" min ="0" className={`form-control ${errors.custos ? "is-invalid" : ""}`}
               value={custos} onChange={(e) => setCustos(e.target.value)} step="0.01" />
        <div className="invalid-feedback">{errors.custos}</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Profissão:</label>
        <select className="form-select" value={profissao} onChange={(e) => setProfissao(e.target.value)}>
          <option>Psicólogo(a)</option>
          {/* você pode adicionar mais opções se quiser */}
        </select>
      </div>

      <div className="form-check form-switch mb-3">
        <input className="form-check-input" type="checkbox" id="sendEmailSwitch" checked={sendEmail}
               onChange={(e) => setSendEmail(e.target.checked)} />
        <label className="form-check-label" htmlFor="sendEmailSwitch">Deseja receber os cálculos por e-mail?</label>
      </div>

      {sendEmail && (
        <div className="mb-3">
          <label className="form-label">Seu e-mail:</label>
          <input type="email" className={`form-control ${errors.emailUser ? "is-invalid" : ""}`}
                 value={emailUser} onChange={(e) => setEmailUser(e.target.value)} />
          <div className="invalid-feedback">{errors.emailUser}</div>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Enviar e-mail para o NAF (opcional)</label>
        <input type="email" className={`form-control ${errors.emailNAF ? "is-invalid" : ""}`}
               placeholder="email@naf.exemplo" value={emailNAF} onChange={(e) => setEmailNAF(e.target.value)} />
        <div className="invalid-feedback">{errors.emailNAF}</div>
        <div className="form-text">Se informado, o resultado será preparado para envio ao NAF (simulação).</div>
      </div>

      <div className="d-grid">
        <button className="btn btn-primary" type="submit">Comparar PF × PJ</button>
      </div>

      <InfoModal show={showInfo} onHide={() => setShowInfo(false)} />
    </form>
  );}