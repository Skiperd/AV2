
//VOCÊ PRECISARA RODAR ESSE CÓDIGO NUM IDE ONLINE, PORQUE O VSCODE NÃO TÁ PERMITINDO DIGITAR NO
//TERMINAL AS VARIAVEIS..
//USE DE PREFERENCIA ESSE PORQUE ELE JA TEM O NODE ---> https://www.programiz.com/javascript/online-compiler/
class Gramatica {
  constructor() {
    this.producoes = {};
  }

  addProducaoAgramatica(simbolo, producao) {
    if (!this.producoes[simbolo]) {
      this.producoes[simbolo] = [];
    }
    this.producoes[simbolo].push(producao);
  }

  toString() {
    let gstring = '';
    for (const simbolo in this.producoes) {
      if (this.producoes.hasOwnProperty(simbolo)) {
        const producoes = this.producoes[simbolo];
        for (const producao of producoes) {
          gstring += simbolo + ' -> ' + producao + '\n';
        }
      }
    }
    return gstring;
  }
}


function converterParaFNG(inputGramatica) {
  const formaNormalGreibach = new Gramatica();
  let contadorVariavelNova = 1;


  function NovaVari() {
    let variavelNova = 'A' + contadorVariavelNova;

    while (formaNormalGreibach.producoes[variavelNova]) {
      contadorVariavelNova++;
      variavelNova = 'A' + contadorVariavelNova;
    }

    return variavelNova;
  }


  for (const simbolo in inputGramatica.producoes) {
    if (inputGramatica.producoes.hasOwnProperty(simbolo)) {
      const producoes = inputGramatica.producoes[simbolo];
      for (const producao of producoes) {
        if (producao[0] === simbolo) {
          const variavelNova = NovaVari();
          formaNormalGreibach.addProducaoAgramatica(variavelNova, producao.slice(1));
          formaNormalGreibach.addProducaoAgramatica(simbolo, variavelNova);
        } else {
          formaNormalGreibach.addProducaoAgramatica(simbolo, producao);
        }
      }
    }
  }

  let alteracao = true;

  while (alteracao) {
    alteracao = false;

    for (const simbolo in formaNormalGreibach.producoes) {
      if (formaNormalGreibach.producoes.hasOwnProperty(simbolo)) {
        const producoes = formaNormalGreibach.producoes[simbolo];
        const producoesNovas = [];

        for (const producao of producoes) {
          if (producao.length === 1 && formaNormalGreibach.producoes[producao]) {
            for (const novaProducao of formaNormalGreibach.producoes[producao]) {
              if (!producoesNovas.includes(novaProducao)) {
                producoesNovas.push(novaProducao);
                alteracao = true;
              }
            }
          } else {
            producoesNovas.push(producao);
          }
        }

        formaNormalGreibach.producoes[simbolo] = producoesNovas;
      }
    }
  }


  const variaveisFNG = {};

  for (const simbolo in formaNormalGreibach.producoes) {
    if (formaNormalGreibach.producoes.hasOwnProperty(simbolo)) {
      const producoes = formaNormalGreibach.producoes[simbolo];
      const producoesFNG = [];

      for (const producao of producoes) {
        let producaoFNG = '';
        let contadorSimbolosTerminais = 0;

        for (let i = 0; i < producao.length; i++) {
          const atual = producao[i];

          if (formaNormalGreibach.producoes[atual]) {
            if (!variaveisFNG[atual]) {
              variaveisFNG[atual] = NovaVari();
            }

            producaoFNG += variaveisFNG[atual];
          } else {
            const variavelTerminal = 'X' + (++contadorSimbolosTerminais);
            formaNormalGreibach.addProducaoAgramatica(variavelTerminal, atual);
            producaoFNG += variavelTerminal;
          }
        }

        producoesFNG.push(producaoFNG);
      }

      formaNormalGreibach.producoes[simbolo] = producoesFNG;
    }
  }

  return formaNormalGreibach;
}


const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let entradaGramatica = '';
console.log('PROFESSOR NÃO USE O VSCODE POR AQUI O CÓDIGO NÃO FUNCIONARÁ')
console.log('USE ESSA IDE ONLINE "https://www.programiz.com/javascript/online-compiler/"')
console.log('****************************************************************')
console.log('****************************************************************')
console.log('DIGITE A GRAMÁTICA POR PARTES DESSE JEITO S -> AB | CSB  APERTE ENTER UMA VEZ')
console.log('DIGITE A GRAMÁTICA POR PARTES DESSE JEITO A -> aB | C    APERTE ENTER UMA VEZ')
console.log('DIGITE A GRAMÁTICA POR PARTES DESSE JEITO B -> bbB | b   APERTE ENTER UMA VEZ')
console.log('AO FINAL DE DIGITAR A GRAMATICA APERTE ENTER DUAS VEZES PARA INICIAR')

rl.on('line', (linha) => {
  if (linha.trim() !== '') {
    entradaGramatica += linha + '\n';
  } else {
    rl.close();
  }
});

rl.on('close', () => {
  const linhaAtual = entradaGramatica.trim().split('\n');
  const inputGramatica = new Gramatica();

  for (const linha of linhaAtual) {
    const partes = linha.split('->');
    const simbolo = partes[0].trim();
    const producoes = partes[1].trim().split('|');

    for (const producao of producoes) {
      inputGramatica.addProducaoAgramatica(simbolo, producao.trim());
    }
  }

  console.log('\nGramática fornecida:');
  console.log(inputGramatica.toString());


  const formaNormalGreibach = converterParaFNG(inputGramatica);

  console.log('\nGramática em Forma Normal de Greibach:');
  console.log(formaNormalGreibach.toString());
});
