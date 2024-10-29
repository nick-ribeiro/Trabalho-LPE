"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Container, Card, Form, Button, Alert, Accordion } from "react-bootstrap"; // Importando Accordion do React Bootstrap

export const User = () => {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState({

    tipo: session?.user?.tipo || "",
    nome: session?.user?.nome || "",
  });
  const [message, setMessage] = useState(""); // Para armazenar mensagens de sucesso ou erro

  if (!session) {
    return <p>Loading...</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      if (!response.ok) {
        throw new Error("Erro ao atualizar informações.");
      }
      setMessage("Informações atualizadas com sucesso!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <Accordion defaultActiveKey="0">
        {/* Seção de Visualização dos Dados */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>Meus Dados</Accordion.Header>
          <Accordion.Body>
            <Card>
              <Card.Body>
                <Card.Title>{session.user.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{session.user.email}</Card.Subtitle>
                <Card.Text>
                  <strong>Tipo:</strong> {session.user.tipo} <br />
                </Card.Text>
              </Card.Body>
            </Card>
          </Accordion.Body>
        </Accordion.Item>

        {/* Seção de Atualização dos Dados */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>Atualizar Dados</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  type="text"
                  name="tipo"
                  value={userInfo.tipo}
                  onChange={handleChange}
                  placeholder="Digite seu tipo"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={userInfo.nome}
                  onChange={handleChange}
                  placeholder="Digite seu nome"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Atualizar Informações
              </Button>
            </Form>
            {message && <Alert className="mt-3">{message}</Alert>}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default User;
