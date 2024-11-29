# Projeto Integrador IV
## DiagnostIA

### Tabela de Conteúdos
1. [Introdução](#introdução)
2. [Funcionalidades do Site](#funcionalidades-do-site)
3. [Código HTML](#código-html)
4. [Código CSS](#código-css)
5. [Código JavaScript](#código-javascript)
6. [Conclusões](#conclusões)

### Introdução
Este projeto tem como objetivo auxiliar médicos em seu trabalho, promovendo uma otimização no tempo de consulta e facilitando o diagnóstico.

### Funcionalidades do Site
![Tela com funcionalidades numeradas](img/Tela.jpg)

1. Campo para inserir o nome do paciente.
2. Campo para a descrição dos sintomas apresentados pelo paciente.
3. Resultado das possíveis doenças ou problemas identificados pela IA.
4. Botão para gerar um PDF do documento (habilitado somente após clicar em "Consultar"). O PDF contém todos os dados coletados e gerados pela IA.
5. Botão "Consultar" para solicitar uma análise da IA (habilitado somente após os campos de nome e sintomas serem preenchidos). A IA gera possíveis diagnósticos com base nas informações fornecidas.

### Código HTML
O código HTML estabelece a estrutura básica para coleta de dados e os botões que acionam funções do JavaScript.

```html
<!-- Botões para solicitar resultado da IA e gerar PDF -->
<!-- Botões para solicitar resultado da IA e gerar PDF -->
<div class="box-button">
    <button type="button" class="pdf centralizar" onclick="GerarPDF()" disabled>
        <img class="icon" src="img/icon_bloqueio.png" alt=""> Gerar PDF
    </button>
    <button type="button" class="consulta centralizar" onclick="chamarGroqAPI()">
        <img class="icon" src="img/icon_consulta.png" alt=""> Consultar
    </button>
</div>
```
### Código CSS
O CSS define o design do projeto e inclui uma animação de carregamento exibida após clicar em "Consultar".
```css
/* Animação de carregamento (loader): */
.loader {
    animation: spin 2s linear infinite;
}
  
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
```
### Código JS
O JavaScript controla a ativação dos estilos CSS, a comunicação com a IA para obtenção dos resultados, a geração de dados de hora/data e a criação do PDF.

### Código responsável por gerar o PDF
```js
function GerarPDF(){
    var nome= document.getElementById('nome');
    var sintomas= document.getElementById('sintomas');
    var prev= document.getElementById('previa');
    var pdf=  document.querySelector('.pdf');
    var dataAtual= new Date;//!-Variavel pra permitir manipular data
    var mes= dataAtual.getMonth()+1;//!-variavel pra pegar o mês(porém em numero)
    //*Conversão do meses
    switch (mes) {
      case 1:
          mes=('Janeiro');
          break;
      case 2:
          mes=("Fevereiro");
          break;
      case 3:
          mes=("Março");
          break;
      case 4:
          mes=("Abril");
          break;
      case 5:
          mes=("Maio");
          break;
      case 6:
          mes=("Junho");
          break;
      case 7:
          mes=("Julho");
          break;
      case 8:
          mes=("Agosto");
          break;
      case 9:
          mes=("Setembro");
          break;
      case 10:
          mes=("Outubro");
          break;
      case 11:
          mes=("Novembro");
          break;
      case 12:
          mes=("Dezembro");
          break;
      default:
          mes=("Mês inválido");
  }
    //*Criação das variaveis "data", "hora" e "respostaPDF"
    var data= `dia ${dataAtual.getDate()} de ${mes} do ano de ${dataAtual.getFullYear()}`;
    var hora= `${dataAtual.getHours().toString().padStart(2, '0')}:${dataAtual.getMinutes().toString().padStart(2, '0')}`;//!-Tranformar hora e minuto em uma string e faz com que as mesmas sempre começem com 00
    //?-Tem como oitmizaer a linha de código a cima?
    var respostaPDF=`O Sr(a) ${nome.value}, consultado no dia ${data} as ${hora} horas, que apresenta os seguinte(s) sintoma(s): "${sintomas.value}". ${prev.value}`;//todo-Talvez adicionar em breve o cpf do paciente
   //* Acessando a função jsPDF do pacote
   const { jsPDF } = window.jspdf;
   //* Criando uma nova instância do jsPDF
   const doc = new jsPDF();
   //* Adicionando um título ao PDF
   doc.text("Relatório médico", 10, 10);
   //* Adicionando conteúdo
   const larguraMaxima = 180;
   const linhas = doc.splitTextToSize(respostaPDF, larguraMaxima);
   doc.setFontSize(12);
    //* Configurando a posição inicial (margem superior) e espaçamento
    let margemSuperior = 20; //! Posição Y inicial
    const espacamentoEntreLinhas = 10; //! Espaçamento entre as linhas
    //* Adiciona o texto no PDF (quebrado em várias linhas)
    linhas.forEach(function(linha, index) {
      //* Se a posição ultrapassar o limite da página, cria uma nova página
      if (margemSuperior > 280) { //! 280 é o limite da página antes de adicionar uma nova
        doc.addPage();
        //* Reseta a posição na nova página
        margemSuperior = 20;
      }
      doc.text(linha, 10, margemSuperior); //! Adiciona a linha na posição X=10, Y=margemSuperior
      margemSuperior += espacamentoEntreLinhas; //! Move para a próxima linha
    });
   //*Gera e salva o arquivo
   doc.save("Relatório.pdf");
}
```
### CÓDIGO IA
```js
//todo-Faz a requisição à API Groq AI
const apiKey = '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';//!Chave de acesso
//todo-Endpoint da API Groq
const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
//todo-Função que pega os sintoma(s) e faz a pergunta a IA
function requestBody(text) {
    return {
        "messages": [
            {
            "role": "user",
            "content": `Com base nos sintomas a seguir, informe 3 possíveis doenças que um paciente pode estar: ${text}. 
            A resposta deve conter a seguinte estrutura no texto: Nome da doença, pula uma linha, palavra "Probabilidade", seguido da probabilidade de ser aquela doença, pula uma linha, uma informação breve sobre a doença e seguido com o possível tratamento ou cura. 
            Não coloque o titulo em negrito e não coloque mais nada além dessa estrutura que falei. 
            É DE EXTREMA IMPORTANCIA QUE, SE FOR DIGITADO ALGO FORA DO CONTEXTO MÉDICO, A RESPOSTA SER "Por favor, digite um sintoma para começarmos o diagnostico". 
            Além disso,  tanto a pergunta quanto a resposta SEMPRE devem ser em português e em hipotese nenhuma em inglês. Caso o sintoma seja digitado em inglês, solicite que seja escrito em português-BR.`
            }
        ],
        "model": "llama3-8b-8192"
    }
}
//todo-Função ligada ao segundo botão, que permite pegar resposta da IA e liberar botão de pdf
async function chamarGroqAPI() {
    var sint= document.getElementById('sintomas').value;
    var prev= document.getElementById('previa');
    var nome= document.getElementById('nome').value;
    var pdf=  document.querySelector('.pdf');
    var consulta=  document.querySelector('.consulta');
    //!Lembre que o botão de pdf só é liberado após esse permitir
    //*-IF/ELSE pra se algum dado estiver vazio, emitir alerta, porém se os mesmos estiverem preenchidos o programa roda normalmente   
    if(nome!='' && sint!=''){
        prev.innerHTML='CARREGANDO...'
        consulta.innerHTML=`<img class="icon loader" src="img/icon_loading.png" alt="">Loading...`
        // consulta.style.animation= "infinite";

        try {
            const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                //*-Chave de autenticação
                'Authorization': `Bearer ${apiKey}`, 
                //*-Tipo de conteúdo
                'Content-Type': 'application/json'  
            },
            //*-Enviar o payload como JSON
            body: JSON.stringify(requestBody(sint)) 
            });
            if (!response.ok) {
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json(); // Processar a resposta
            console.log('Resposta da API Groq:', data); // Exibir a resposta no console
            prev.innerHTML= data.choices[0].message.content;//!Caminho
            consulta.innerHTML=`<img class="icon" src="icon_consulta.png" alt="">Consultar`
            //*-Configurações do botão PDF 
            pdf.style.backgroundColor= "red";
            pdf.innerHTML=`<img class="icon" src="img/icon_pdf.png" alt=""> Gerar PDF`
            pdf.style.cursor= "pointer";
            pdf.removeAttribute("disabled");
        } catch (error) {
            window.alert('Erro ao chamar a API Groq')
            console.error('Erro ao chamar a API Groq:', error); // Tratamento de erros
        }
    }else{
        window.alert('[ALERTA] Preencha os dados primeiro!')
      }
}

```
### Conclusões
Este projeto é uma solução simples, porém objetiva, desenvolvida para apoiar o trabalho dos profissionais da saúde no dia a dia. **Este site destina-se ao uso exclusivo de médicos e não deve ser utilizado por pacientes.**

