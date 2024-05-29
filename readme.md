# Daily Diet API

Esse projeto foi realizado a partir de um dasafio no qual foi passado 
as regras de negócio e uma contextualização de como seria utilizado esse sistema,
segue abaixo as regras da aplicação

<hr/>

## Regras da Aplicação

- [x] Deve ser possível criar um usuário;
- [x] Deve ser possível identificar o usuário entre as requisições;
- [x] Deve ser possível registrar uma refeição feita,, com as seguintes informações:
  _As refeições devem ser relacionadas a um usuário_
  <ul>
    <li>Nome</li>
    <li>Descrição</li>
    <li>Data e Hora</li>
    <li>Está dentro ou não da dieta</li>
  </ul>
- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima;
- [x] Deve ser possível apagar uma refeição;
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário
  <ul>
    <li>Quantidade total de refeições registradas</li>
    <li>Quantidade total de refeições dentro da dieta</li>
    <li>Quantidade total de refeições fora da dieta</li>
    <li>Melhor sequência de refeições dentro da dieta</li>
  </ul>
- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou
- [x] implementar testes

<hr/>

## Como rodar esta aplicação?

### Pré-requisitos

- Node.js
- npm ou yarn
- SQLITE (ou outro banco de dados suportado pelo Knex)

### Instalação

1. **Clonar o repositório**:
Clone o repositório do GitHub para o seu ambiente local. 
* ```bash
  git clone https://github.com/Urias01/daily-diet-api.git
  cd daily-diet-api
  ```

2. **Instale as dependências**:
* ```bash
    npm install
    # ou
    yarn install
  ```

3. **Configure as variáveis de ambiente**:

- Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`.
- Configure as variáveis de ambiente conforme necessário.

4. **Executar as migrations**:
* ```bash
    npm run knex migrate:latest
  ```

5. **Iniciar o servidor**:
Inicie o servidor da API com o seguinte comando.
* ```bash
    npm run dev
  ```

6. **Para acessar a API**:
Você pode acessar a API através de `http://localhost:3333` (ou outra porta configurada, dependendo do seu arquivo `.env`).

7. **Rodar Testes (Opcional)**:
* ```bash
    npm test
    # ou
    npm run tes
  ```

## Conclusão

O Daily Diet API estará configurado e pronto para execução no seu ambiente local. Se atente em ajustar quaisquer detalhes específicos do ambiente ou configurações conforme necessário para o seu caso de uso.
