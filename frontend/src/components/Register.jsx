// Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { styles } from './PixPage';

const API_BASE_URL = 'http://PLACEHOLDER_RENDER_API';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Cadastro realizado com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.detail || 'Falha no cadastro.');
      }
    } catch (err) {
      setError('Erro de conexão com a API.');
    }
  };

  return (
    <div style={styles.card}>
      <h2>📝 Cadastro</h2>
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
          placeholder="Senha (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}
        <button type="submit" style={styles.button}>Cadastrar</button>
      </form>
      <p>Já tem conta? <Link to="/" style={styles.link}>Faça login</Link></p>
    </div>
  );
};


// ... (código da função Register)

export default Register; // <--- PRECISA SER ESTE EXPORT PADRÃO!

// ... Estilos (continue na próxima seção)