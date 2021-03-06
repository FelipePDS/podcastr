# NLW 05 – COMUNIDADE REACT.JS – PODCASTR

## AULA 01 – LITOFF

**Dependências:**

- NODE.JS – npm – yarn
- VS CODE

**Começando o projeto:**

`$ npx create-react-app podcastr`

**Executar projeto:**

`$ yarn start`

Preparando ambiente

**Resolvendo problemas de SEO do react**

- Server Side Rendering
- Static Site Genteration
- Next.js:

`$ npx create-next-app podcastrnext`

**Executar projeto (next.js):**

`$ yarn dev`

<br>

## AULA 02

**Por que Typescript?**

- Ele especifica os tipos de dados que estão em outro local de desenvolvimento
- Especifica os dados que um certo objeto possuí em um parâmetro de uma função (isso ajuda na hora de dar manutenção em um código e saber o que existe em uma certa variável)
  - Melhor manutenção do código
  - Evita erros (como passar um tipo de dado errado, o que o próprio typescript não permite passar um tipo de dado diferente do especificado)
  - Debugar o código de forma Melhor
  - Mais produtividade

Diferença entre um código produzido em Javascript e Typescript:

JAVASCRIPT:

``` javascript
function createWelcomeMessage(user) {
    return `Boas vindas, ${user.name}. Cidade ${user.city} - ${user.state}!`;
}
```

> Como podemos ver fica dificil o que o parâmetro user fornece, quais são os atributos desse objeto

TYPESCRIPT:

``` typescript
type User = {
    name: string,
    address: {
        city: string,
        state: string
    }
};

function createWelcomeMessage(user: User) {
    return `Boas vindas, ${user.name}. Cidade ${user.city} - ${user.state}!`;
}

const welcomeMessage = createWelcomeMessage({
    name: 'Felipe',
    address: {
        city: 'Mauá',
        state: 'São Paulo'
    }
});
```

> Assim a própria IDE vai indicar o que esse parâmetro user têm, sendo obrigatório ele ser colocado com os tipos de dados que estão no type User!

<br>

**Adicionar Typescript no React.js:**

`$ yarn add typescript @types/react @types/node -D`

> Arquivos serão do tipo .tsx agora (códigos typescript em sintaxes html)

<br>

**Arquivos CSS serão em Sass a partir de agora para ter mais vertibilidade na sintaxe das estilizações**

`$ yarn add sass`

> Extensão de arquivo Sass: .scss

Os arquivos .modules.scss nos componentes são importados como objetos dentro do componente e são validos apenas para aquele componente, ou seja, se houver uma mesma classe em outro componente, logo ela não terá a estilização da que foi atribuída para este componente:

``` tsx
import styles from './styles.module.scss';
```

e para atribuir uma classe estilizada ela deve vir a partir desse objeto styles:

``` tsx
<div className="styles.NomeDaClasse">

</div>
```

<br>

**Módulo para trabalhar com datas no react:**

`$ yarn add date-fns`

<br>

**Consumindo API com JSON**

Para "puxar" dados de um arquivo JSON que converte em uma API (com listagens, filtro, relacionamento, criação...), há um pacote chamado json-server:

`$ yarn add json-server -D`

Para executar o json-server:

`$ yarn server`

> No arquivo package.json nas propriedades de scripts está configurado da seguinte maneira

``` json
"server": "json-server server.json -w -d 750 -p 3333"
```

onde:
- -w (watch mode) irá reatualizar toda vez que surgir algum dado;
- -d 750 (delay de 750 ms), pois o código sendo compilado localmente irá muito rápido, assim não daria para mostrar animações de carregamento
- -p 3333 (ele irá executar na porta 3333)

Para consumir a API, podemos fazer isso de 3 formas diferentes:

- SPA:

``` tsx
useEffect(() => {
    fetch('http://localhost:3333/episodes')
        .then(response => response.json())
        .then(data => console.log(data))
}, []);
```

Como podemos ver, utiliza-se o useEffect do React, que basicamente ele sempre verifica quando algum dado é modificado para realizar uma ação, no seu primeiro parâmetro a gente especifica o que vai executar após algum dado mudar, já no segundo especifica-se quando vai executar, sendo mais especifico, indica-se a variável que quando ela mudar, executa a função do primeiro parâmetro. Caso o array do segundo parâmetro estiver vazio, isso indica que ele vai executar esse useEffect apenas uma vez quando o componente for exibido em tela.
Porém esse método não é muito eficiente, pois ele roda no Javascript do browser, o que torna impossível mostrar os dados buscados dessa API assim que o usuário acessar a página.
Então veremos o segundo método...

- SSR (Server Side Render)

``` tsx
export async function getServerSideProps() {
    const response = await fetch('http://localhost:3333/episodes');
    const data = await response.json();

    return {
        props: {
            episodes: data
        }
    }
}
```

Apenas exportando uma função com esse nome em qualquer arquivo dentro do diretório de pages, o next.js já compila-o de forma que ele já satisfaça a necessidade de buscar os dados dessa API. Vemos que ele retorna um objeto props que é para o next.js pegar os dados desse objeto e ele retorna como parâmetro para usar nas funções dos componentes, ou seja, a partir do parâmetro props nos componentes, conseguimos pegar os dados da API, que nesse caso são os episodes.
Basicamente a requisição feita com o getServerSideProps foi feita através da camada do next.js e não no browser.
Utilizando-se o SSR há de perceber que é possível usar o async / await, o que torna um código mais atualizado e versátil.
Com o SSR há um problema caso o propósito do App seja por exemplo lançar um podcast por dia (ou seja, a home do site irá mudar 1 vez por dia) assim pra cada usuário que entrar no site ele irá atualizar já que ele sofreu uma alteração, o que faz sobrecarregar o site, porém o SSG resolve o problema desse caso...

- SSG (Static Side Generation)

``` jsx
export async function getStaticProps() {
    const response = await fetch('http://localhost:3333/episodes');
    const data = await response.json();

    return {
        props: {
            episodes: data
        },

        revalidate: 60 * 60 * 8
    }
}
```

Com o SSG é possível assim que uma pessoa acessar a página, então ele gera uma versão estática pra ela e essa versão que é um HTML é servido para todas as outras pessoas que acessarem a página sucessivamente após essa primeira pessoa acessar a página, o que evita gastar recursos desncessários e deixa a página mais performática
Como podemos ver apenas mudamos o nome da função, o que já é interpretado pelo next.js e foi passado um atributo revalidate no retorno de objeto dessa função, que indica a cada tempo que vai atualizar a página para gerar outra página estática quando uma outra primeira pessoa acessar (nesse caso são 8 horas).

<br>

**Criando uma Build do projeto**

Para isso o projeto em next precisa parar de ser executado mas o servidor (a API) precisa estar executando ainda...

`$ yarn build`

> Podemos ver no log que o next.js retorna o nome das páginas que ele gerou de forma estática.

Para executar o projeto como ele roda em produção é necessário realizar o comando:

`$ yarn start`

<br>

## Aula 03

**Tipando as funções e o seus retornos**

> No typescript conseguimos criar a tipagem de uma função, definindo o seu formato, retorno...
> Para fazer isso a Function precisa virar uma variável que recebe uma arrow function

Exemplo de como tipar uma função:

``` tsx
export const getStaticProps: GetStaticProps = async () => {
    const response = await fetch('http://localhost:3333/episodes');
    const data = await response.json();

    return {
        props: {
            episodes: data
        },

        revalidate: 60 * 60 * 8
    }
}
```

Criando uma tipagem própria (type):

``` tsx
type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
};

type HomeProps = {
    latestEpisodes: Episode[];
    allEpisodes: Episode[];
};
```

**Roteamento no Next.js**

Quando colocado um arquivo na pasta pages e na url colocar o seu nome, o próprio next.js irá rotear o que tem no arquivo.

Também podemos realizar isso criando uma pasta, assim será criado uma URL com o nome dela. Dentro dessa mesma pasta podemos criar um arquivo, onde seu nome entre colchetes irá referenciar uma queryparams para a URL do nome da pasta. Exemplo:

*baseURL*: http://localhost/

*Nome da pasta*: episode

*Nome do arquivo*: [slug].tsx

*Nova URL*: http://localhost/episode/queryparams -> pode ser passado um id de um episode por exemplo.

Para que isso seja usado, é necessário importar o useRouter dentro do next/router:

``` tsx
import { useRouter } from 'next/router';

export default function Episode() {
    const router = useRouter();
    
    return (
        <h1>Episode</h1>
    )
}
```

Assim, para acessar a queryString que vem da url, é só acessar por: router.query.nomeDoArquivo

**Páginas estáticas dinâmicas**

No next.js é possível exportar outra função que ele auto reconhece para aplicar esse tipo de página.

As páginas estáticas dinâmicas ocorrem quando puxamos dados do servidor de certo em certo tempo e, assim, transformamos a página estática após pegar os dados, porém há páginas que recebem query params, onde o servidor pode puxar mais de um dado.

Então para isso, no next.js adicionamos o seguinte export (além do getStaticProps):

``` tsx
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    };
};
```

## Aula 04 - Contexto e áudio

Para gerar uma página (a partir de um path) de forma estática, é necessário informar os dados para o next.js, através do paths do getStaticPaths (sempre será gerado de forma estática apenas quando o projeto estiver em produção). Então indicaremos qual o query params que ele deverá buscar para pegar os dados e gerar a página de forma estática. Siga um exemplo não completo ainda:

``` tsx
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [{
            params: {
                slug: 'a-importancia-da-contribuicao-em-open-source'
            }
        }],

        fallback: 'blocking'
    };
};
```

- fallback true: indica para o next.js pegar os dados da página quando alguém acessá-la pela primeira vez com o projeto em produção (ele roda pelo servidor do browser);
- fallback false: o inverso do fallback true;
- fallback blocking: ele tem a mesma função do fallback true, porém ele roda no servidor local next.js (servidor node.js).

Realizandoo geramento de página de forma mais dinâmica:

``` tsx
export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    });

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        };
    });

    return {
        paths,

        fallback: 'blocking'
    };
};
```

**Contexto API no React.js**

Funcionalidade do React.js que permite o compartilhamento de dados entre componentes da aplicação.

Um exemplo de uso do Context nessa aplicação do podcastr é, quando o usuário clicar pra tocar um podcast no componente Home e esse podcast ter de exibir no componente Player.

Com um módulo do React.js podemos realizar isso. Como exemplo do PlayerContext a seguir:

``` tsx
import { createContext } from 'react';

export const PlayerContext = createContext('Diego');
```

e para aplicar o contexto nos componentes que queremos aplicar, basta envolver esse componente de contexto por volta dos componentes (colocaremos dentro do _app.tsx):

``` tsx
import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerContext } from '../contexts/PlayerContext';

import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  return (
      <PlayerContext.Provider value={'Diego'}>
          <div className={styles.wrapper}>
            <main>
                <Header />
                <Component {...pageProps} />
            </main>
            
            <Player />
        </div>
      </PlayerContext.Provider>
  )
}

export default MyApp
```

e para usar o context dentro do componente (ou seja, pegar os dados que queremos para o componente)...

replicamos isso no componente Player:

``` tsx
import { useContext } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';

export function Player() {
    const player = useContext(PlayerContext);

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora {player}</strong>
            </header>

            ...
```

> Como todos os componentes estão envolvidos por este context, então todos podem acessar os dados deste context

**Slider no React.js**

`$ yarn add rc-slider`

## Aula 05 - Controlando player

