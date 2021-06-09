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