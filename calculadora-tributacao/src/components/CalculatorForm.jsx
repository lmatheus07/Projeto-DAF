import React, { useState } from "react";
import InfoModal from "./InfoModal";

export default function CalculatorForm() {
  const [renda, setRenda] = useState("");
  const [custos, setCustos] = useState("");
  const [profissao, setProfissao] = useState("Psicólogo(a)");
  const [sendEmail, setSendEmail] = useState(false);
  const [emailUser, setEmailUser] = useState("");
  const [emailNAF, setEmailNAF] = useState("");
  const [errors, setErrors] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const [resultado, setResultado] = useState(null); //guarda o resultado da comparação


  // Validação  
  function validate() {
    const e = {};
    const rendaNum = Number(renda);
    const custosNum = Number(custos);

    if (!renda) e.renda = "Renda mensal é obrigatória.";
    else if (rendaNum <= 0 || rendaNum > 15000)
      e.renda = "Informe um valor entre R$ 1 e R$ 15.000.";

    if (custos === "" || Number.isNaN(custosNum))
      e.custos = "Custos mensais obrigatórios.";
    else if (custosNum < 0)
      e.custos = "Custos não podem ser negativos.";

    if (!profissao) e.profissao = "Profissão obrigatória.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // Cálculo de comparação 
  function calcularComparacao(rendaMensal, custosMensais) {
    // Pessoa Física
    const basePF = rendaMensal - custosMensais;
    let faixa = "";
    let aliquota = 0;
    let deducao = 0;

    if (basePF <= 2112) {
      faixa = "Isento";
    } else if (basePF <= 2826.65) {
      faixa = "7,5%";
      aliquota = 0.075;
      deducao = 158.4;
    } else if (basePF <= 3751.05) {
      faixa = "15%";
      aliquota = 0.15;
      deducao = 370.4;
    } else if (basePF <= 4664.68) {
      faixa = "22,5%";
      aliquota = 0.225;
      deducao = 651.73;
    } else {
      faixa = "27,5%";
      aliquota = 0.275;
      deducao = 884.96;
    }

    const irpf = Math.max(basePF * aliquota - deducao, 0);

    // Pessoa Jurídica
    const salarioProLabore = rendaMensal * 0.28;
    const inss = salarioProLabore * 0.11;
    const simples = rendaMensal * 0.06;
    const totalPJ = inss + simples;

    return {
      rendaMensal,
      custosMensais,
      basePF,
      faixa,
      aliquota,
      deducao,
      irpf,
      salarioProLabore,
      inss,
      simples,
      totalPJ,
    };
  }

  // ===== Ao enviar o formulário 
  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const res = calcularComparacao(Number(renda), Number(custos));
    setResultado(res);
  }

  //Renderização 
  return (
    <div>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Entradas</h5>
          <button type="button" className="btn btn-link p-0" onClick={() => setShowInfo(true)}>
            <img src="./src/info-circle.svg" alt="O que é isso?" />
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">Renda Mensal (R$) até R$ 15.000</label>
          <input type="number" min="0" className={`form-control ${errors.renda ? "is-invalid" : ""}`} value={renda} onChange={(e) => setRenda(e.target.value)} step="0.01" />
          <div className="invalid-feedback">{errors.renda}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Total de Custos Mensais (R$)</label>
          <input type="number" min="0" className={`form-control ${errors.custos ? "is-invalid" : ""}`} value={custos} onChange={(e) => setCustos(e.target.value)}step="0.01"/>
          <div className="invalid-feedback">{errors.custos}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Profissão</label>
          <select className="form-select" value={profissao} onChange={(e) => setProfissao(e.target.value)}>
            <option>Psicólogo(a)</option>
          </select>
        </div>

        <div className="form-check form-switch mb-3">
          <input className="form-check-input" type="checkbox" id="sendEmailSwitch" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)}/>
          <label className="form-check-label" htmlFor="sendEmailSwitch"> Deseja receber os cálculos por e-mail? </label>
        </div>

        {sendEmail && (
          <div className="mb-3">
            <label className="form-label">Seu e-mail</label>
            <input type="email" className={`form-control ${errors.emailUser ? "is-invalid" : ""}`} value={emailUser} onChange={(e) => setEmailUser(e.target.value)}/>
            <div className="invalid-feedback">{errors.emailUser}</div>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Enviar e-mail para o NAF (opcional)</label>
          <input type="email" className={`form-control ${errors.emailNAF ? "is-invalid" : ""}`} placeholder="email@naf.exemplo" value={emailNAF} onChange={(e) => setEmailNAF(e.target.value)}/>
          <div className="invalid-feedback">{errors.emailNAF}</div>
          <div className="form-text">Se informado, o resultado será preparado para envio ao NAF (simulação).</div>
        </div>

        <div className="d-grid">
          <button className="btn btn-primary" type="submit"> Comparar PF x PJ</button>
        </div>

        <InfoModal show={showInfo} onHide={() => setShowInfo(false)} />
      </form>

      {resultado && (
        <div className="card mt-4 p-4 shadow-sm">
          <h5>Comparativo de Tributação</h5>
          <p><strong>Renda Mensal:</strong> R$ {resultado.rendaMensal.toFixed(2)}</p>
          <p><strong>Custos Mensais:</strong> R$ {resultado.custosMensais.toFixed(2)}</p>

          <hr />
          <h6>PESSOA FÍSICA</h6>
          <p>Base de cálculo: R$ {resultado.basePF.toFixed(2)}</p>
          <p>Faixa da tabela: {resultado.faixa}</p>
          <p>Dedução: R$ {resultado.deducao.toFixed(2)}</p>
          <p><strong>Total a pagar de IR:</strong> R$ {resultado.irpf.toFixed(2)}</p>

          <hr />
          <h6>PESSOA JURÍDICA</h6>
          <p>28% da renda (pró-labore): R$ {resultado.salarioProLabore.toFixed(2)}</p>
          <p>Simples Nacional (6%): R$ {resultado.simples.toFixed(2)}</p>
          <p>INSS pró-labore (11%): R$ {resultado.inss.toFixed(2)}</p>
          <p><strong>Total a pagar:</strong> R$ {resultado.totalPJ.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}