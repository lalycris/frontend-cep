"use client";

import { useState } from 'react';
import { Input, List, Card } from 'antd';

export default function Home() {
  const [cep, setCep] = useState('');
  const [cepData, setCepData] = useState({
    current: {
      cep: '12345-678',
      logradouro: 'Rua Exemplo',
      bairro: 'Bairro Exemplo',
      localidade: 'Cidade Exemplo',
      uf: 'EX',
    },
    history: [
      {
        cep: '98765-432',
        logradouro: 'Avenida Teste',
        bairro: 'Bairro Teste',
        localidade: 'Cidade Teste',
        uf: 'TS',
      },
    ],
  });

  const handleSearch = async () => {
    console.log('handleSearch called with cep:', cep);
    try {
      const response = await fetch(`http://localhost:3002/cep/${cep}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setCepData((prevData) => ({
        ...prevData,
        current: data,
        history: [
          ...prevData.history,
          data,
        ],
      }));
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-4">
        <Input.Search
          placeholder="Digite o CEP"
          enterButton="Buscar"
          size="large"
          onSearch={handleSearch}
          onChange={(e) => setCep(e.target.value)}
          className="mb-4"
        />
        {cepData.current && (
          <Card title="Resultado Atual" className="mb-4">
            <p>CEP: {cepData.current.cep}</p>
            <p>Logradouro: {cepData.current.logradouro}</p>
            <p>Bairro: {cepData.current.bairro}</p>
            <p>Cidade: {cepData.current.localidade}</p>
            <p>Estado: {cepData.current.uf}</p>
          </Card>
        )}
        <List
          header={<div>Histórico de Buscas</div>}
          bordered
          dataSource={cepData.history}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={`CEP: ${item.cep}`}
                description={`${item.logradouro}, ${item.bairro}, ${item.localidade} - ${item.uf}`}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
