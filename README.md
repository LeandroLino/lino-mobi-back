# Lino mobi teste técnico
<br>
<img width="719" alt="image" src="https://github.com/LeandroLino/lino-mobi-back/assets/72203926/ad5d9ee3-186f-4bd5-a453-d804a3f748b5">


Projeto para teste tecnico da [mobi](https://mobi.com.br/)

Notion com query do banco de dados [Notion](https://moored-cloth-8a0.notion.site/Mobi-teste-t-cnico-2e97d99bba19451c9c5868e363d6da51)

Diagrama do banco de dados
<br>
<img width="610" alt="image" src="https://github.com/LeandroLino/lino-mobi-back/assets/72203926/a8b412d2-77c2-402a-87c9-dc9b5492fd62">



Não é necessário baixar o projeto para pode testar a API, ela está hospedada neste [link](https://lino-mobi-back-production.up.railway.app)

## Instalação

Crie um banco de dados mysql, você pode usar o banco de dados gratuito [planetscale](https://app.planetscale.com/)

Após baixar todo o arquivo de Back end e criar o banco de dados, rode primeiro o 

```node
npm install
```
Em seguinda basta iniciar a conexão
```node
npm start
```
A resposta dada no terminal será:
```
[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
Connected to PlanetScale!
Server running at http://localhost:3000

```
## Utilização
Uma RestAPI de para agenda de contatos,


Como a API está hospedada em um dominio online, usaremos a URL que está no topo do README.

## Problemas possiveis em localhost

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

Tente verificar se existe alguma outra aplicação rodando na porta 3000, caso não consiga achar nenhuma
aplicação rodando utilize os seguintes comandos

```bash
fuser 3000/tcp
```

A resposta desse comando será:

```bash
3000/tcp:            <Sequencia Númerica>
```

Depois de capturar a Sequencia númerica utilize o seguinte comando:
```bash
kill -9 <Sequencia Númerica>
```

Pronto, será finalizado a aplicação e agora você pode rodar o comando npm novamente

Se o problema persistir você pode trocar o valor `3000` para algum numero como `5000`

Se mesmo assim continuar, você pode me contactar pelo email: leao.lino7@gmail.com, ou pelo meu 
celular (11) 940596713

## Documentação dos endpoints
[Collection download](https://drive.google.com/file/d/1dFr6a8UWBSRdrOINxhUj-J6LRvuyKx4g/view?usp=sharing)

## POST /user/register/ - Registrando um Usuário:
Existe uma validação completa do payload e em especifico da senha e do número de telephone
```
{
 "name": "Lino",
 "email": "lino7@gmail.com",
 "password": "Li12345678!",
 "telephones": [
   {
     "number": "940596713",
     "area_code": "11",
		 "name": "Leandro"
   }
 ]
}
```
**RESPONSE STATUS -> HTTP 200 - OK**
```
{
	"id": <ID>,
	"created_at": <Date>,
	"modified_at": <Date>
}
```
## POST /user/login/ - Executando um saque:
Existe uma validação completa do payload
```
{
  "email": "lino@gmail.com",
  "password": "Li1234567"
 }
```
**RESPONSE STATUS -> HTTP 200 - OK**
```
{
  "token": <Token JWT gerado automaticamente>
}
```

## POST /user/search/ - Executando um saque:
Aqui toda informação fornecida pelo usuário para a API será via header
```
{
  <NO BODY>
}
```
Header:
```
Authorization: Bearer <Token JWT gerado na rota de login>
```

**RESPONSE STATUS -> HTTP 200 - OK**
```
{
	"id": <USER_ID>,
	"name": "Lino",
	"email": "lino@gmail.com",
	"created_at": <Date>,
	"modified_at": <Date>,
	"telephone": [
		{
			"id": <ID>,
			"user_id": <USER_ID>,
			"number": "940596713",
			"name": "Leandro",
			"area_code": "11"
		}
	]
}
```
## DELETE /user/delete/ - Efetuando uma Transferência:
Aqui toda informação fornecida pelo usuário para a API será via header
```
<NO BODY>
```
Header:
```
Authorization: Bearer <Token JWT gerado na rota de login>
```

**RESPONSE STATUS -> HTTP 202**
```
{}
```

## PUT /user/update/ - Efetuando uma Transferência:
Aqui toda informação fornecida pelo usuário para a API será via header
```
{
 "name": "Leandro",
 "email": "leandro1@gmail.com",
 "password": "Li1234567!"
}
```
Header:
```
Authorization: Bearer <Token JWT gerado na rota de login>
```

**RESPONSE STATUS -> HTTP 200**
```
{
	"user": {
    "id": <ID>,
	"name": "Lino",
	"email": "leandro1@gmail.com",
	"created_at": <Date>,
	"modified_at": <Date>
    },
    "token": <Token JWT gerado automaticamente>
}
```

## PUT /telephone/update/:id - Efetuando uma Transferência:
Aqui toda informação fornecida pelo usuário para a API será via header
```
{
	"number": "940596719",
  "area_code": "11",
	"name": "Leandro"
}
```
Header:
```
Authorization: Bearer <Token JWT gerado na rota de login>
```

**RESPONSE STATUS -> HTTP 200**
```
{
	"id": <ID>,
	"user_id": <USER_ID>,
	"number": "940596719",
	"name": "Leandro",
	"area_code": "11",
	"created_at": <Date>,
	"modified_at": <Date>
}
```

## POST /telephone/update/:id - Efetuando uma Transferência:
Aqui toda informação fornecida pelo usuário para a API será via header
```
{
	"number": "940596719",
  "area_code": "11",
	"name": "Leandro"
}
```
Header:
```
Authorization: Bearer <Token JWT gerado na rota de login>
```

**RESPONSE STATUS -> HTTP 200**
```
{
	"id": <ID>,
	"user_id": <USER_ID>,
	"number": "940596719",
	"name": "Leandro",
	"area_code": "11",
	"created_at": <Date>,
	"modified_at": <Date>
}
```
## POST /telephone/update/:id - Efetuando uma Transferência:
Aqui as informação serão fornecidas pelo usuário via body jsno e também via header
```
{
	"number": "940596719",
  "area_code": "11",
	"name": "Leandro"
}
```
Header:
```
Authorization: Bearer <Token JWT gerado na rota de login>
```

**RESPONSE STATUS -> HTTP 200**
```
{
	"id": <ID>,
	"user_id": <USER_ID>,
	"number": "940596719",
	"name": "Leandro",
	"area_code": "11",
	"created_at": <Date>,
	"modified_at": <Date>
}
```

## DELETE /telephone/update/:id - Efetuando uma Transferência:
Aqui as informação serão fornecidas pelo usuário via body jsno e também via header
```
<NO BODY>
```
Header:
```
Authorization: Bearer <Token JWT gerado na rota de login>
```

**RESPONSE STATUS -> HTTP 200**
```
{}
```

## POST /telephone/create/ - Efetuando uma Transferência:
Aqui as informação serão fornecidas pelo usuário via body jsno e também via header
```
{
	"number": "940596740",
  "area_code": "22",
	"name": "Leandro"
}
```
Header:
```
Authorization: Bearer <Token JWT gerado na rota de login>
```

**RESPONSE STATUS -> HTTP 200**
```
{
	"id": <ID>,
	"user_id": <USER_ID>,
	"number": "940596740",
	"name": "Leandro",
	"area_code": "22",
	"created_at": <Date>,
	"modified_at": <Date>
}
```
## Observações

Durante o processo de criação eu tive muitas ideias de como melhorar o projeto, pretendo continuar 

desenvolvendo algumas features, uma coisa que eu senti falta foi de testes com banco de dados mockado, e

tabela com relações entre elas.

Acredito que o projeto poderia ser bem mais estruturado na questão de informações, não lidar somente telefones mas também lidar 

com outros meios de contatos.

Uma outra ideia que acho válido é de criar um front end futuramente.

Uma coisa que eu considero importante seria a implementação dessa api utilizando typescript, algo que eu considero relacionado foi

a validação dos payloads utilizando o schema e a biblioteca 'Joi'.

Os testes poderiam vaidar exeptions, cenários como: Registrar o mesmo usuário deve retornar 403, um update de um usuário não existe 

deve retornar 404.
