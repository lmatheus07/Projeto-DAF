import React, { useState } from "react";
import Header from "./components/Header";
import CalculatorForm from "./components/CalculatorForm";
import CompareResult from "./components/CompareResult";

export default function App() {
  const [result, setResult] = useState(null);

  function handleCompare(res) {
    setResult(res);
  }

  function handleSendEmailNAF(payload) {
    // callback opcional para quando CompareResult 'envia' ao NAF
    console.log("Enviar ao NAF: ", payload);
  }

  return (
    <div className="container mt-4">
      <Header />
      <CalculatorForm onCompare={handleCompare} />
      <CompareResult result={result} onSendEmailNAF={handleSendEmailNAF} />
    </div>
  );
}
