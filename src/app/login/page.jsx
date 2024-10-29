'use client';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { signIn } from "next-auth/react";
import { useState } from 'react';

export default function Login({ searchParams }) {
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Envia o formulário com base no estado de registro ou login
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (isRegister) {
      await handleRegister(formData);
    } else {
      await handleLogin(formData);
    }
  };

  const handleLogin = async (formData) => {
    setErrorMessage('');
    console.log('Tentando login com dados:', Object.fromEntries(formData));

    const result = await signIn("credentials", {
      email: formData.get('email'),
      senha: formData.get('senha'),
      redirect: false,
    });

    if (!result.error) {
      window.location.href = '/';
    } else {
      setErrorMessage("Usuário ou senha inválidos");
    }
  };

const handleRegister = async (formData) => {
  setErrorMessage('');

  try {
    const response = await fetch('/api/user/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        senha: formData.get('senha'),
        tipo: formData.get('tipo') || '',
        telefone: formData.get('telefone') || '',
        nome: formData.get('nome') || ''
      })
    });

    if (response.ok) {
      alert('Registro realizado com sucesso! Faça login.');
      setIsRegister(false);
    } else {
      const errorData = response.headers.get('content-type')?.includes('application/json')
        ? await response.json()
        : { message: 'Erro desconhecido ao registrar' };
        
      setErrorMessage(errorData.message || 'Erro ao registrar');
    }
  } catch (error) {
    console.error("Erro de rede ou servidor:", error);
    setErrorMessage('Erro de rede ou servidor. Tente novamente mais tarde.');
  }
};

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div style={{ textAlign: 'center' }}>
          <h2>{isRegister ? 'Registro de Usuário' : 'Login de Usuário'}</h2>
        </div>

        {errorMessage && (
          <h4 className="text-center" style={{ color: 'red' }}>{errorMessage}</h4>
        )}

        <div className="col-12 col-md-6">
          <Form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <Form.Group controlId="txtNome" className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" name="nome" placeholder="Informe seu nome" required />
                </Form.Group>
                <Form.Group controlId="txtTipo" className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control type="text" name="tipo" placeholder="Informe o tipo" />
                </Form.Group>
                <Form.Group controlId="txtTelefone" className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type="text" name="telefone" placeholder="Informe seu telefone" />
                </Form.Group>
              </>
            )}
            <Form.Group controlId="txtEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" placeholder="Informe o email" required />
            </Form.Group>
            <Form.Group controlId="txtSenha" className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control type="password" name="senha" placeholder="Senha" required />
            </Form.Group>
            <div className="text-center mt-3">
              <Button type="submit">{isRegister ? 'Registrar' : 'Efetuar Login'}</Button>
            </div>
            <div className="text-center mt-2">
              <Button variant="link" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Registre-se'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
