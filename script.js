/*function Enviar(){
  var nome= document.getElementById('nome').value;
  var sint= document.getElementById('sintomas').value;
  var prev= document.getElementById('previa');
  var pdf=  document.querySelector('.pdf');
  var dataAtual= new Date;
  var mes= dataAtual.getMonth()+1;
  //
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
  //
  var data= `dia ${dataAtual.getDate()} de ${mes} do ano de ${dataAtual.getFullYear()}`;
  var hora= `${dataAtual.getHours().toString().padStart(2, '0')}:${dataAtual.getMinutes().toString().padStart(2, '0')}`;
  //
  if(nome!='' && sint!=''){
    prev.innerHTML=`O Sr(a) ${nome}, portador do cpf {xxx.xxx.xxx-xx}, consultado no dia ${data} as ${hora} horas, que apresenta os seguinte(s) sintoma(s): "${sint}", possivelmente está com {possiveis resultados da IA}`;
    pdf.style.backgroundColor= "red";
    pdf.innerHTML=`<img class="icon" src="icon_pdf.png" alt=""> Gerar PDF`
    pdf.removeAttribute("disabled");
    pdf.style.cursor= "pointer";
  }else{
    window.alert('[ALERTA] Preencha os dados primeiro!')
  }
 
}*/
function Enviar2(){
  var prev= document.getElementById('previa');
  var pdf=  document.querySelector('.pdf');
   // Acessando a função jsPDF do pacote
   const { jsPDF } = window.jspdf;

   // Criando uma nova instância do jsPDF
   const doc = new jsPDF();
   // Adicionando um título ao PDF
   doc.text("Relatório médico", 10, 10);
   // Adicionando conteúdo
   const larguraMaxima = 180;
   const linhas = doc.splitTextToSize(prev.value, larguraMaxima);
   doc.setFontSize(12);

    // Configurando a posição inicial (margem superior) e espaçamento
    let margemSuperior = 20; // Posição Y inicial
    const espacamentoEntreLinhas = 10; // Espaçamento entre as linhas

    // Adiciona o texto no PDF (quebrado em várias linhas)
    linhas.forEach(function(linha, index) {
      // Se a posição ultrapassar o limite da página, cria uma nova página
      if (margemSuperior > 280) { // 280 é o limite da página antes de adicionar uma nova
        doc.addPage();
        margemSuperior = 20; // Reseta a posição na nova página
      }
      doc.text(linha, 10, margemSuperior); // Adiciona a linha na posição X=10, Y=margemSuperior
      margemSuperior += espacamentoEntreLinhas; // Move para a próxima linha
    });
  //  doc.text(String(linhas), 10, 20);

   // Gerando o arquivo e salvando
   doc.save("Relatório.pdf");
}

// Substitua com sua chave de API
const apiKey = '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';
// Função que faz a requisição à API Groq AI

// Endpoint da API Groq
const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

//pega os sintomas e pergunta a IA
function requestBody(text) {
    return {
        "messages": [
            {
            "role": "user",
            "content": `Me informe as top 3 possíveis doenças para os seguintes sintomas: ${text} e começe a resposta sempre com um 'como base'`
            }
        ],
        "model": "llama3-8b-8192"
    }
}

// Função para fazer a requisição POST
async function chamarGroqAPI() {
    var sint= document.getElementById('sintomas').value;
    var prev= document.getElementById('previa');
    var nome= document.getElementById('nome').value;
    var pdf=  document.querySelector('.pdf');
//
    var dataAtual= new Date;
    var mes= dataAtual.getMonth()+1;
    //
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
    //
    var data= `dia ${dataAtual.getDate()} de ${mes} do ano de ${dataAtual.getFullYear()}`;
    var hora= `${dataAtual.getHours().toString().padStart(2, '0')}:${dataAtual.getMinutes().toString().padStart(2, '0')}`;

    if(nome!='' && sint!=''){
        var respostaPDF=`O Sr(a) ${nome}, portador do cpf {xxx.xxx.xxx-xx}, consultado no dia ${data} as ${hora} horas, que apresenta os seguinte(s) sintoma(s): "${sint}. ${prev}`;
        pdf.style.backgroundColor= "red";
        pdf.innerHTML=`<img class="icon" src="icon_pdf.png" alt=""> Gerar PDF`
        pdf.removeAttribute("disabled");
        pdf.style.cursor= "pointer";
      }else{
        window.alert('[ALERTA] Preencha os dados primeiro!')
      }
      //
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`, // Chave de autenticação
        'Content-Type': 'application/json'  // Tipo de conteúdo
      },
      body: JSON.stringify(requestBody(sint)) // Enviar o payload como JSON
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json(); // Processar a resposta
    console.log('Resposta da API Groq:', data); // Exibir a resposta no console
    prev.innerHTML= data.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao chamar a API Groq:', error); // Tratamento de erros
  }
}

// Adicionar um listener para o botão
//document.getElementById('analisarBtn').addEventListener('click', analisarTexto);
