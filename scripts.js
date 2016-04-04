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

	 function deletaPost(idPost) {
		var requisicao = $.ajax({
			url :  "http://localhost:3000/posts/" + idPost,
			method : "DELETE"
		});

		requisicao.done( function() {
			$("#"+idPost).remove();
		});
		requisicao.fail( function() {
			alert("Erro ao excluir Post.");
		});

	}

	function deletaComment(idComment) {
	 var requisicao = $.ajax({
		 url :  "http://localhost:3000/comments/" + idComment,
		 method : "DELETE"
	 });

	 requisicao.done( function() {

	 });
	 requisicao.fail( function() {

	 });

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
			section.attr("class", "post");
			section.appendTo("#posts");
			$("<h3>").text(post.title).appendTo(section);
			$("<p>").text(post.body).appendTo(section);
			var comentario = $("<a>");
			comentario.attr("href", "#"+this.id);
			comentario.attr("onClick", "").click(
				function () {
					var id_post = +$(this).parent().attr("id");
					var id_comment = "?postId=" + id_post;
					var commentPai = $(this).parent();
					var comentarios = $.ajax("http://localhost:3000/comments"+id_comment, {
						dataType: "jsonp"
					});

					comentarios.done(function(comments){
						var divComents = $("<div>");
						divComents.attr("class", "coments")
						divComents.attr("id", "coments"+post.id);

						$(comments).each(function(){
							var divComent = $("<div>").attr("class", "coment");
							$("<h5>").text(this.name).attr("class", "coment_title").appendTo(divComent);
							$("<p>").text(this.body).attr("class", "coment_body").appendTo(divComent);
							divComent.appendTo(divComents);
						});
						divComents.appendTo(commentPai);
						$("<a>").text("Ocultar comentarios").attr("href", "#"+id_post).attr("class", "link_coments").attr("onClick", "").click(
							function () {
								 $(this).parent().remove();
							}
						).appendTo(divComents);
						$("<a>").text("Novo Comentario").attr("class", "link_coments").attr("onClick", "").click(
							function () {
								var divCommentNew = $("<div>").text("Novo Comentario").attr("class","novo_comment").attr("id","novo_comment").appendTo($("#"+$(this).parent().attr("id")));
								$("<br>").appendTo(divCommentNew);
								$("<label>").attr("name","title_comment").attr("for","title_comment").text("Titulo do Comentario").appendTo(divCommentNew);
								$("<input>").attr("name","title_comment").attr("id","title_comment").appendTo(divCommentNew);
								$("<br>").appendTo(divCommentNew);
								$("<label>").attr("name","body_comment").attr("for","body_comment").text("Comentario").appendTo(divCommentNew);
								$("<input>").attr("name","body_comment").attr("id","body_comment").appendTo(divCommentNew);
								$("<br>").appendTo(divCommentNew);
								$("<select>").attr("name","users").attr("id","users").appendTo(divCommentNew);
								$("<br>").appendTo(divCommentNew);
								$("<br>").appendTo(divCommentNew);
								$("<br>").appendTo(divCommentNew);
								var select = $("#users");
								getUsers(select);

								$("<a>").attr("class","link").attr("id","body_comment").text("Enviar Comentario").click(
									function functionName() {

										var requisicao = $.ajax({
											url : "http://localhost:3000/comments/",
											method : "POST",
											data : {
												name : $("#title_comment").val(),
												body : $("#body_comment").val(),
												postId : post.id,
												userId:$("#users").val()
											}
										});
										requisicao.done(function(post) {
											var divComentNew = $("<div>").attr("class", "coment");
											$("<h5>").text($("#title_comment").val()).attr("class", "coment_title").appendTo(divComentNew);
											$("<p>").text($("#body_comment").val()).attr("class", "coment_body").appendTo(divComentNew);
											(divComents).prepend(divComentNew);
										});

								}
								).appendTo(divCommentNew);

							}
						).appendTo(divComents);
					});

					comentarios.fail(function(){
						$("<p>").text("Houve um erro ao carregar os comentários.").appendTo("body");
					});

				}
			);

			var idComentario = "comentario" + post.id;
			comentario.attr("id", idComentario);
			comentario.attr("class", "link_coments");
			comentario.text("comentários");
			comentario.appendTo(section);
			$('<a>').text("Excluir Post").attr("class", "link_coments").attr("onClick", "").click(
				function () {
					 var idRemover = $(this).parent().attr("id");
					 var commentsRemover = $.ajax(
			 			"http://localhost:3000/comments/" + idRemover, {
			 			dataType : "jsonp"
			 		});

			 		commentsRemover.done(function(comments) {
						$(comments).each(function(){
							var comment = this;
							deletaComment(this.id);
						});
			 		});
					 deletaPost(idRemover);
					}
			).appendTo(section);
		});
	});

	requisicao.fail(function(error, status){
		$("<p>").text("Houve um erro ao carregar os posts.").appendTo("#posts");
	});

function getUsers(select) {

	var usuariosList = $.ajax(
		"http://localhost:3000/users/", {
			dataType: "jsonp"
	});

	usuariosList.done(function(users){

		$(users).each(function(){
			var caboco = this;
			$("<option>").attr("value",caboco.id).text(caboco.name).appendTo(select);
		});
	});

}


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

	$("#adicionar_post").click( function() {
		var requisicao = $.ajax({
			url : "http://localhost:3000/posts",
			method : "POST",
			data : {
				title : $("#titulo_novo_post").val(),
				body : $("#corpo_novo_post").val(),
				userId : id_user
			}
		});
		requisicao.done(function(post) {

			var section = $("<section>");
			section.attr("id", post.id);
			section.attr("class", "post");
			$("<h3>").text(post.title).appendTo(section);
			$("<p>").text(post.body).appendTo(section);
			$("#posts:first").prepend(section);
		});
	});

$("#adicionar_user").click(function () {
	var addUser = $.ajax({
		url : "http://localhost:3000/users",
		method : "POST",
		data : {
			name : $("#nome").val(),
			username : $("#username").val(),
			email : $("#email").val(),
			phone:$("#phone").val(),
			website:$("#site").val(),
			company:{
				name:$("#company_name").val()
			}
		}

	});
	addUser.done(function(user_add) {

		$("<p>").text("User incluído:" + user_add.id).appendTo("body");
	});
});

});
