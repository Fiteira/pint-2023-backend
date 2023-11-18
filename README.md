# PROJETO INTEGRADO - SOFTINSA APP API

Bem-vindo(a) à documentação da API (backend) do **PROJETO INTEGRADO - SOFTINSA APP**. Esta API foi desenvolvida utilizando Node.js e Express para fornecer suporte ao website e à aplicação mobile do projeto, permitindo a interação com uma base de dados.
No contexto deste projeto, a API serve como uma ponte entre o frontend (website e aplicação mobile) e a base de dados, permitindo que os dados sejam solicitados, enviados e manipulados de maneira eficiente e organizada.

## Instruções de Uso

Siga estas instruções para utilizar a API do **PROJETO INTEGRADO - SOFTINSA APP**:

1. Clone este repositório para o seu ambiente local.
2. Certifique-se de que você possui o Node.js instalado em sua máquina.
3. Abra o terminal e navegue até a pasta do projeto.
4. Instale as dependências do projeto executando o seguinte comando:

```bash
npm install
```
Crie um arquivo chamado .env na raiz do projeto para definir as variáveis de ambiente necessárias. As variáveis necessárias estão listadas abaixo:
env
```bash
DB_HOST=
DB_USER=
DB_PASSWORD=
```
Complete as variáveis de ambiente com as informações de conexão à sua base de dados.

Após configurar as variáveis de ambiente, você pode iniciar a API executando o seguinte comando:
```bash
npm start
```
Isso iniciará o servidor da API e você poderá acessá-lo em http://localhost:4000 (ou a porta que você configurar).

## Endpoints da API
### Autenticação
#### Autenticar Usuário
Método: POST
Endpoint: /api/login
Exemplo de requisição:
```bash
{
    "Email" : "xpto123@gmail.com",
    "Senha" : "123"
}
```
Descrição: Realiza o login do usuário e retorna um token de autenticação válido.
Usuários
Registrar Usuário

Método: POST
Endpoint: /api/register
Exemplo de requisição:
```bash
{
    "Nome" : "Arthur",
    "Email" : "josedelas@gmail.com",
    "Senha" : "123",
    "NCargo" : "0",
    "Telefone" : "967062751",
    "Foto" : "1.png",
    "Genero" : "Masculino",
    "DataNascimento" : "2002-10-11"
}
```
Descrição: Registra um novo usuário na plataforma.
Obter Usuários

Método: GET
Endpoint: /api/usuarios
Descrição: Retorna a lista de todos os usuários.
Obter Usuários Ativos

Método: GET
Endpoint: /api/usuarios?estado=1
Descrição: Retorna a lista de usuários que estão ativados.
Obter Usuário por ID

Método: GET
Endpoint: /api/usuarios/:nusuario
Descrição: Retorna os detalhes de um usuário específico com base no ID.
Clientes
Obter Clientes

Método: GET
Endpoint: /api/clientes
Descrição: Retorna a lista de clientes.
Obter Cliente por ID

Método: GET
Endpoint: /api/clientes/:ncliente
Descrição: Retorna os detalhes de um cliente específico com base no ID.
Benefícios
Obter Benefícios


Verificar Token
Método: GET
Endpoint: /api/checktoken
Descrição: Verifica se um token é válido e retorna os dados do usuário associado ao token.
Validação de E-mail
Validar E-mail
Método: GET
Endpoint: /api/validaremail?code=[codigo]
Descrição: Valida uma conta por meio de um código recebido por e-mail.
Observação: Substitua [codigo] pelo código recebido por e-mail para validar a conta.

**Veja a documentação completa dos endpoints [aqui](https://docs.google.com/document/d/1enwBvsDcaeuq5apk8Lbw1CKjxeZhj1WFurJOxL4aVjc/edit?usp=sharing)**



Em caso de dúvidas ou problemas, entre em contato conosco através dos canais apropriados.
