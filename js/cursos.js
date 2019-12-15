//Desenvolvedora: Arliene Batista

app.initialize();

//abre o banco agenda, do banco de dados Database, com 2000 registros
var db = window.openDatabase("Database", "1.0", "Cursos", 2000);
db.transaction(createDB, errorDB, successDB);

//Quando o objeto documento "escuta" que está pronto executa a Função onDeviceReady
document.addEventListener("deviceready", onDeviceReady, false);

//cria tabela no banco de dados quando dispositivo esiver pronto
function onDeviceReady() {
  db.transaction(createDB, errorDB, successDB);

}

//trata erro de criação do banco de dados
function errorDB(err) {
  alert("Erro: " + err);

}

//Executa se criou o Banco de dados com sucesso
function successDB() { }

//Cria a tabela se a mesma não existir
function createDB(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS Cursos(id INTEGER PRIMARY KEY, nome VARCHAR(50), valor NUM(15), vagas NUM(15))');
  tx.executeSql('CREATE TABLE IF NOT EXISTS vagas_preenchidas(id INTEGER PRIMARY KEY, nome VARCHAR(50), valor NUM(15), vagas NUM(15))');

}


//Prepara para incluir registro na tabela Agenda
function cursos_insert() {
  db.transaction(cursos_insert_bd, errorDB, successDB);

}

//ABRIR TELA DE INCLUSAO
function cursos_abrir_tela_inclusao(cursos_id) {

  $("#tela_padrao").hide(); //esconde tela inicial
  $("#tela_inclusao").show(); //tela mostra tela de inclusao

  $("#cursos_nome_insert").val(cursos_nome);
  $("#cursos_valor_insert").val(cursos_valor);
}

//Inclui registro na tabela Agenda
function cursos_insert_bd(tx) {

  var nome = $("#cursos_nome").val();
  var valor = $("#cursos_valor").val();
  var vagas = $("#cursos_vagas").val();


  if (nome == "") {
    alert("Prencha o curso!");
    return false;
  }
  if (valor == "") {
    alert("Prencha o valor (R$)");
    return false;
  }

  if (vagas == "") {
    alert("Prencha a quantidade de vagas");
    return false;
  }

  if (nome != "" && valor && vagas != "") {
    tx.executeSql('INSERT INTO Cursos (nome, valor, vagas) VALUES ("' + nome + '", ' + valor + ', ' + vagas + ')');
    cursos_view();
    $("#tela_padrao").show();
    $("#tela_inclusao").hide();
  }

  alert('Curso cadastrado com sucesso!');
  $("#nome").val("");
  $("#valor").val("");
  $("#vagas").val("");

}

function cursos_fechar_tela_inclusao() {
  $("#tela_inclusao").hide(); //esconde tela de inclusao
  $("#tela_padrao").show(); //tela mostra tela de edicao
}


//PREPARA PARA DELETAR REGISTRO DA TABELA CURSOS
function cursos_delete(cursos_id) {
  $("#cursos_id_delete").val(cursos_id);
  db.transaction(cursos_delete_db, errorDB, successDB);
}
//DELETA REGISTRO DA TABELA CURSOS E CHAMA A FUNÇÃO CURSOS_VIEW()
function cursos_delete_db(tx) {
  var cursos_id_delete = $("#cursos_id_delete").val();
  tx.executeSql("DELETE FROM Cursos WHERE id = " + cursos_id_delete);
  cursos_view();
}

//PREPARA PARA LER OS REGISTROS DA TABELA AGENDA
function cursos_view() {
  db.transaction(cursos_view_db, errorDB, successDB);
}

//ABRIR TELA DE VIZUALIZACAO
function cursos_abrir_tela_visualizar(cursos_id) {

  $("#tela_padrao").hide(); //esconde tela inicial
  $("#tela_visualizar").show(); //tela mostra tela de vizualizacao
  cursos_view();

}

//Monta a matriz com os registros da tabela Cursos
function cursos_view_db(tx) {
  tx.executeSql('SELECT * FROM Cursos', [], cursos_view_data, errorDB);
}

//Mostra os registros da tabela Cursos na tag <tbody id ="cursos_listagem">
function cursos_view_data(tx, results) {
  $("#cursos_listagem").empty();
  var len = results.rows.length;

  for (var i = 0; i < len; i++) {
    $("#cursos_listagem").append(
      "<tr class='curso_item_lista'>" +
      "<td><h3>" + results.rows.item(i).id + "</h3></td>" +
      "<td><h3>" + results.rows.item(i).nome + "</h3></td>" +
      "<td><h3>" + results.rows.item(i).vagas + "</h3></td>" +
      "<td><h3>" + results.rows.item(i).valor + "</h3></td>" +
      "<td><input type='button' class = 'btn btn-lg btn-success' value ='Comprar' onclick='comprar_cursos(" + results.rows.item(i).id + ")'></td>" +
      "</tr>");
  }
}

function cursos_fechar_tela_visualizar() {
  $("#tela_visualizar").hide(); //esconde tela de inclusao
  $("#tela_padrao").show(); //tela mostra tela de edicao
}

function comprar_cursos(curso_id) {
  $("#curso_id").val(curso_id - 1);
  $("#finalizar_compra").show();
}

function finalizar_compra() {
  db.transaction(comprar_cursos_view, errorDB, successDB);
}

function comprar_cursos_view(tx) {
  tx.executeSql('SELECT * FROM Cursos', [], comprar_cursosDB, errorDB)
}

function comprar_cursosDB(tx, results) {
  var id = parseInt($("#curso_id").val());
  var nome = results.rows.item(id).nome;
  var valor = parseFloat(results.rows.item(id).valor);
  var vagas = parseInt($("#vagas_curso").val());

  parseInt(vagas);
  parseFloat(valor);
  $("#finalizar_compra").hide();

  valor *= vagas;
  tx.executeSql('INSERT INTO vagas_preenchidas (nome, valor, vagas) VALUES ("' + nome + '", ' + valor + ', ' + vagas + ')');
  tx.executeSql('UPDATE Cursos SET vagas = ' + (results.rows.item(id).vagas - vagas) + ' WHERE id = ' + (id + 1));

  alert("Curso comprado com sucesso!");
  $("#tela_visualizar").hide(); //esconde tela de inclusao
  $("#tela_padrao").show(); //tela mostra tela de edicao
}

function cursos_abrir_tela_compras(){
  $("#tela_padrao").hide(); //esconde tela inicial
  $("#cursos_tela_compras").show(); //tela mostra tela de vizualizacao
  cursos_comprados_view();
}

function cursos_comprados_view() {
  db.transaction(cursos_comprados_view_db, errorDB, successDB);
}

//Monta a matriz com os registros da tabela Cursos
function cursos_comprados_view_db(tx) {
  tx.executeSql('SELECT * FROM vagas_preenchidas', [], cursos_comprados_view_data, errorDB);
}

//Mostra os registros da tabela Cursos na tag <tbody id ="cursos_listagem">
function cursos_comprados_view_data(tx, results) {
  $("#cursos_comprados_listagem").empty();
  var len = results.rows.length;

  for (var i = 0; i < len; i++) {
    $("#cursos_comprados_listagem").append(
      "<tr class='curso_item_lista'>" +
      "<td><h3>" + results.rows.item(i).id + "</h3></td>" +
      "<td><h3>" + results.rows.item(i).nome + "</h3></td>" +
      "<td><h3>" + results.rows.item(i).vagas + "</h3></td>" +
      "<td><h3>" + results.rows.item(i).valor + "</h3></td>" +
      "<td><input type='button' class = 'btn btn-lg btn-danger' value ='X' onclick='excluir_cursos(" + results.rows.item(i).id + ")'></td>" +
      "</tr>");
  }
}

function cursos_fechar_tela_compras(){
  $("#cursos_tela_compras").hide(); //esconde tela de inclusao
  $("#tela_padrao").show(); //tela mostra tela de edicao
}

function excluir_cursos(excluir){
  $("#curso_id_excluir").val(excluir);
  db.transaction(excluir_cursosDB, errorDB, successDB);
}

function excluir_cursosDB(tx){
  var id_excluir = $("#curso_id_excluir").val();
  tx.executeSql('DELETE FROM vagas_preenchidas WHERE id = ' + id_excluir);
  alert("Curso removido do carrinho de compras com sucesso!");
  cursos_comprados_view();
}