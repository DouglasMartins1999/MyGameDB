# MyGameDB

O MyGameDB - por vezes “SwitchDB” - é um leve e minimal  aplicativo online, atuando como uma “playlist” pessoal de jogos. Auto  hospedável e construído em Node.js, a página permite pesquisar jogos no  catálogo do [IGDB](https://www.igdb.com/) e adicioná-los a sua lista pessoal. Uma vez adicionado, é possível  visualizar capa, título, descrição, avaliação da crítica, ano de  lançamento, gênero, plataformas disponíveis, bem como screenshots e  trailers do jogo em questão. A lista, responsiva, permite visualizar no  celular e no computador os games adicionados, em ordem aleatória - a fim de evitar viés ao escolher um game 🙃



![img](https://i.imgur.com/ApK4RWv.jpg)



Uma versão de avaliação está disponível em gamedb.dotins.eu.org. Utilize "dotins" como usuário e "demo" como senha para visualizar. Confira a seção “tutorial”  abaixo para pesquisar, adicionar e remover jogos do catálogo



## Tecnicamente…

Minha primeira aplicação construída usando um banco de dados “portátil”. Uma  aplicação simples, sem autenticação nativa, construída em tempo livre  num fim de semana. Node.js, Express e Knex.js - o usuário pode escolher  entre o PostgreSQL ou o SQLite para armazenar seus jogos.



## Posso criar minha própria playlist?

Sim! Pode instalar o MyGameDB em sua máquina, e assim ter uma playlist  privada só pra você. Se você for um desenvolvedor e tiver facilidade com o Docker, confira a [imagem no DockerHub](https://hub.docker.com/r/martindoug/mygamedb). Caso contrário, confira as instruções no [repositório do MyGameDB no GitHub](https://github.com/DouglasMartins1999/MyGameDB).



## Como instalar em minha infraestrutura?

Como pré-requisitos, você precisará:

- Uma conta e um app na Twitch, siga [esse](https://dev.twitch.tv/docs/authentication/register-app) ou [esse](https://api-docs.igdb.com/#about) tutorial.
- O Node.js na versão 14 com NPM ou superior instalado ([tutorial](https://www.treinaweb.com.br/blog/instalacao-do-node-js-windows-mac-e-linux))

Tendo isso:

- Clone/baixe o [repositório no GitHub](https://github.com/DouglasMartins1999/MyGameDB) do projeto.
- Abra um terminal/prompt de comando/console na pasta onde baixou o projeto.
- Instale as dependências do projeto com `npm install`
- Configure as seguntes [variáveis de ambiente](https://www.twilio.com/blog/como-definir-variaveis-de-ambiente):
  - SWITCHDB_PORT = 3750 (ou a de sua preferência)
  - SWITCHDB_ACCESS = [chave de acesso que conseguiu na Twitch]
  - SWITCHDB_SECRET = [secret gerado em seu app na Twitch]


- Após isso, execute no terminal `npm start` para iniciar o app
- Abra seu navegador, acesse http://localhost:3750 e divirta-se!

> *Se desejar, pode definir a variável **NODE_ENV** para production para usar o banco Postgres ao invés de SQLite. Para definir os dados de acesso do banco, utilize **SWITCHDB_DATABASE_URL**. Você também pode personalizar o caminho onde o arquivo SQLite será salvo com **SWITCHDB_DATABASE_FILE**, e o nome da tabela em qualquer um dos bancos com **SWITCHDB_TABLE**.*



## Tutorial de uso

> Para fazer em sua instalação, utilize http://localhost:3750 ao invés de https://gamedb.dotins.eu.org

Para pesquisar games, acesse /search?q=[nome do jogo]. Por ex, se quiser  procurar por todos os GTA, acesse em seu navegador a URL https://gamedb.dotins.eu.org/search?q=GTA, isso lhe trará uma API REST que, no Firefox, é exibida assim:

![img](https://i.imgur.com/9avHuQR.png)

Após encontrar seu game na lista, você poderá salvá-lo em seu banco pessoal  através da rota /register/[id do jogo]. Por exemplo, para registrar o  primeiro game da lista acima (GTA: Chinatown Wars), acesse a rota https://gamedb.dotins.eu.org/register/3270. Aguarde alguns instantes, quando os dados do jogo forem exibidos, significa que seu jogo foi cadastrado.

![img](https://i.imgur.com/L4Eg37H.png)

Você pode procurá-lo na lista da tela inicial, ou simplesmente acessar /[id do jogo], no caso [gamedb.dotins.eu.org/3270](https://gamedb.dotins.eu.org/3270)

![img](https://i.imgur.com/a3vb318.png)

Caso deseje remover o jogo de sua lista, basta acessar /delete/[id do jogo]. No caso [game.dotins.eu.org/delete/3270](https://game.dotins.eu.org/delete/3270). Aguarde até que a mensagem "deleted" seja exibida em sua tela.

![img](https://i.imgur.com/TB71rga.png)

Isso é tudo que precisa para utilizar sua playlist :)
