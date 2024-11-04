//Função de cada comentario
//todo-Pendentes e Funções
//!-Importantes/Critico
//?-Duvidas/Questões
//*-Explicação
////////////////////
//todo-Função ligada ao primeiro botão, que permite gerar um arquivo PDF
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
            "content": `Informe as top 3 possíveis doenças para os seguintes sintomas: ${text}, começe a resposta sempre com um 'Com base' e essa resposta tem que auxiliar o médico`
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
