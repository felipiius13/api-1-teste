// PixPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://PLACEHOLDER_RENDER_API';

const PixPage = () => {
  const [pixInfo, setPixInfo] = useState(null);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPixInfo();
  }, []);

  const fetchPixInfo = async () => {
    setError('');
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/pix`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPixInfo(data);
      } else {
        // Se a rota protegida falhar (token expirado/inválido), desloga
        localStorage.removeItem('token');
        navigate('/');
        setError(data.detail || 'Sessão expirada. Por favor, faça login novamente.');
      }
    } catch (err) {
      setError('Erro ao buscar informações do PIX.');
    }
  };

  const copyToClipboard = () => {
    if (pixInfo && pixInfo.codigo_copia_cola) {
      navigator.clipboard.writeText(pixInfo.codigo_copia_cola).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }).catch(err => {
        console.error('Falha ao copiar:', err);
        setError('Falha ao copiar o código.');
      });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={styles.card}>
      <h2>💰 PIX de Confirmação (Simulado)</h2>
      {error && <p style={styles.error}>{error}</p>}
      
      {pixInfo ? (
        <div style={styles.pixContainer}>
          <p>O PIX de 1 centavo confirma sua conta e é necessário apenas uma vez.</p>
          <div style={styles.infoBox}>
            <p><strong>Chave PIX (Telefone):</strong> {pixInfo.chave_pix}</p>
            <p><strong>Valor:</strong> R$ {pixInfo.valor}</p>
            <hr />
            <p style={{ fontWeight: 'bold' }}>Código Copia e Cola:</p>
            <div style={styles.codeBox}>
              <code>{pixInfo.codigo_copia_cola}</code>
            </div>
            
            <button 
              onClick={copyToClipboard} 
              style={{ ...styles.button, backgroundColor: copySuccess ? '#28a745' : '#007bff' }}
            >
              {copySuccess ? 'Copiado! ✅' : 'Copiar Código PIX'}
            </button>
            <p style={{ marginTop: '10px', fontSize: '0.9em' }}>
              <span style={{ fontWeight: 'bold' }}>Instrução:</span> Abra o app do seu banco, escolha PIX Copia e Cola e cole o código acima.
            </p>
          </div>
        </div>
      ) : (
        <p>Carregando informações do PIX...</p>
      )}
      
      <button onClick={handleLogout} style={{ ...styles.button, backgroundColor: '#dc3545', marginTop: '20px' }}>
        Sair
      </button>
    </div>
  );
};

// --- Estilos para TODOS os componentes ---
const styles = {
    card: {
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginBottom: '20px',
    },
    input: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      fontSize: '16px',
    },
    button: {
      padding: '10px 15px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#007bff',
      color: 'white',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    error: {
      color: '#dc3545',
      fontSize: '0.9em',
      backgroundColor: '#f8d7da',
      padding: '10px',
      borderRadius: '4px',
    },
    success: {
        color: '#28a745',
        fontSize: '0.9em',
        backgroundColor: '#d4edda',
        padding: '10px',
        borderRadius: '4px',
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
    },
    pixContainer: {
        marginTop: '20px',
        border: '1px solid #ddd',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    },
    infoBox: {
        marginBottom: '15px',
        textAlign: 'left',
    },
    codeBox: {
        backgroundColor: '#eee',
        padding: '10px',
        borderRadius: '4px',
        overflowWrap: 'break-word',
        marginBottom: '10px',
        fontSize: '1.1em',
        fontWeight: 'bold',
    }
  };
  
  // Exporta os estilos para os outros componentes
  export { styles }; 
  
  export default PixPage;
  
  // Adicione a linha de exportação `export { styles };` no final do PixPage.jsx
  // e importe em Login.jsx e Register.jsx (substitua a linha de exportação padrão)
  // Ex: import { styles } from './PixPage';