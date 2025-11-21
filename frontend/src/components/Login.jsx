// Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { styles } from './PixPage';

const API_BASE_URL = 'http://localhost:8000'; // Mudar para a URL do Render depois

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso: armazena o token e navega
        localStorage.setItem('token', data.token);
        navigate('/pix');
      } else {
        // Erro do backend
        setError(data.detail || 'Falha no login. Verifique suas credenciais.');
      }
    } catch (err) {
      setError('Erro de conexão com a API.');
    }
  };

  return (
    <div style={styles.card}>
      <h2>🔒 Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Entrar</button>
      </form>
      <p>Não tem conta? <Link to="/register" style={styles.link}>Cadastre-se aqui</Link></p>
    </div>
  );
};

// ... (código da função Login)

export default Login; // <--- PRECISA SER ESTE EXPORT PADRÃO!

// ... Estilos (continue na próxima seção)