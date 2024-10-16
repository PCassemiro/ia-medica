function Enviar(){
    var nome= document.getElementById('nome').value;
    var sint= document.getElementById('sintomas').value;
    var prev= document.getElementById('previa');
    var pdf=  document.querySelector('.pdf');
    //
    prev.innerHTML=`O Sr(a) ${nome} que apresenta os seguinte(s) sintoma(s): "${sint}", possivelmente está com {possiveis resultados da IA}`;
    pdf.style.backgroundColor= "red";
    pdf.innerHTML=`<img class="icon" src="icon_pdf.png" alt=""> Gerar PDF`
}
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