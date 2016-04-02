$(document).ready(function(){
	$.urlParam = function(name){
	 var results = new RegExp('[\?&]' + name +
	'=([^&#]*)').exec(window.location.href);
	 if (results==null){
	 return null;
	 }
	 else{
	 return results[1] || 0;
	 }
	}
	var id_user = $.urlParam("id_user");
	//a partir daqui faz a resquisição ajax sem precisar de cliques
	var requisicao = $.ajax(
	 "http://localhost:3000/posts?userId=" + id_user, {
	dataType : "jsonp"
	});

	requisicao.done(function(posts){
		$(posts).each(function(){
			var post = this;
			var section = $("<section>");
			section.attr("id", post.id);
			section.appendTo("#posts");
			$("<h3>").text(post.title).appendTo(section);
			$("<p>").text(post.body).appendTo(section);
			var comentario = $("<a>");
			comentario.attr("href", "#");
			var idComentario = "comentario";
			comentario.attr("id", idComentario);
			comentario.attr("class", post.id);
			comentario.text("comentários");
			comentario.appendTo(section);
			$("<hr>").appendTo(section);

		});
	});

	requisicao.fail(function(error, status){
		$("<p>").text("Houve um erro ao carregar os posts.").appendTo("#posts");
	});

	var usuarios = $.ajax(
		"http://localhost:3000/users/", {
			dataType: "jsonp"
	});

	usuarios.done(function(users){

		$(users).each(function(){
			var caboco = this;
			if(caboco.id == id_user){
				var nav = $("<section>");
				nav.attr("id", caboco.id);
				nav.appendTo("#dados_do_caboco");
				//TODO adicionar uma imagem com o avatar dele.
				$("<h3>").text(caboco.name).appendTo(nav);
				$("<p>").text(caboco.email).appendTo(nav);
				$("<p>").text(caboco.website).appendTo(nav);
				$("<p>").text(caboco.company.name).appendTo(nav);
			}
			else{
				var lista = $("#lista_dos_todos");
				var item = $("<li>").appendTo(lista);
				var link = $("<a>").text(caboco.name);
				link.attr("href", "index.html?id_user="+caboco.id);
				link.appendTo(item);
			}
		});
	});

	usuarios.fail(function(error, status){
			$("<p>").text("Houve um erro ao carregar os posts.").appendTo("#dados_do_caboco");
	});
function chamarComentarios ( idPost){
	var id_comment = "?postId=" +idPost;

	var comentarios = $.ajax("http://localhost:3000/comments"+id_comment, {
		dataType: "jsonp"
	});

	comentarios.done(function(){
		alert("Deu certo");
	});

	comentarios.fail(function(){
		$("<p>").text("Houve um erro ao carregar os comentários.").appendTo("body");
	});

};



});
