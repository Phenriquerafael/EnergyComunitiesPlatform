import React, { useState, useEffect } from "react";
import { Button, Upload, Spin, Progress } from "antd";
import { optimizeExcel } from "../services/profileService";

const ProfileUploadComponent = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<string>("");

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setProgress(0);
    setStatus("Iniciando otimização...");

    try {
      const optimizationResult = await optimizeExcel(file); // Enviar o arquivo para otimização
      setResult(optimizationResult);
      setStatus("Otimização concluída.");
      setProgress(100); // Progresso completo
    } catch (error) {
      console.error("Erro ao realizar a otimização:", error);
      setStatus("Erro na otimização.");
    } finally {
      setLoading(false);
    }

    // Iniciar o polling para verificar o progresso
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch("http://localhost:8000/optimization-status");
        const data = await response.json();

        // Atualiza o progresso conforme o status retornado
        setProgress(data.progress);
        setStatus(data.status);

        if (data.progress === 100) {
          clearInterval(intervalId); // Parar o polling quando a otimização estiver completa
        }
      } catch (error) {
        console.error("Erro ao buscar o status da otimização:", error);
        clearInterval(intervalId);
      }
    }, 1000); // Verifica o progresso a cada 1 segundo
  };

  return (
    <div>
      <Upload
        beforeUpload={handleFileUpload}
        showUploadList={false}
        accept=".xlsx, .xls" // Aceita apenas arquivos Excel
      >
        <Button loading={loading} type="primary">Enviar Arquivo Excel</Button>
      </Upload>

      {loading && (
        <div style={{ marginTop: 20 }}>
          <Spin tip={status} spinning={loading} />
          <Progress percent={progress} />
        </div>
      )}

      {result && (
        <div>
          <h3>Resultados da Otimização</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ProfileUploadComponent;
