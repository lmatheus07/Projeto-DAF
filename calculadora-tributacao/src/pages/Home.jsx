import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CalculatorForm from "../components/CalculatorForm";
import CompareResult from "../components/CompareResult";
import { compareTaxes } from "../util/tax";

export default function Home() {
  const [result, setResult] = React.useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aqui você implementaria a lógica de logout
    navigate("/login");
  };

  async function handleCompare(data) {
    const comparison = compareTaxes({ 
      rendaMensal: data.rendaMensal, 
      custosMensais: data.custosMensais 
    });
    setResult({ ...comparison, input: { ...comparison.input, profissao: data.profissao } });
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-4">
        <button onClick={handleLogout} className="btn btn-outline-danger animate__animated animate__fadeIn">
          Sair
        </button>
      </div>
      <Header />
      <CalculatorForm onCompare={handleCompare} />
      <CompareResult result={result} />
    </div>
  );
}
