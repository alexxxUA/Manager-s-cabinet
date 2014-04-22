var templates = {
	esditClient: function(){
		return _.template("<div class='dialog editPopup' clientid='<%= clientId %>'>"+
			"<div class='closeBtn'>close</div>"+
			"<form action='/editClient' ajax='true' ajax-success='clientEdited'>"+
				"<input type='hidden' name='clientId' value='<%= clientId %>'/>"+
			 	"<div class='ws-field'>"+
			 		"<label><%= firstName.label %></label>"+
			 		"<input type='text' name='firstName' value='<%= firstName.val %>' />"+
			 	"</div>"+
			 	"<div class='ws-field'>"+
			 		"<label><%= lastName.label %></label>"+
			 		"<input type='text' name='lastName' value='<%= lastName.val %>' />"+
			 	"</div>"+
			 	"<div class='ws-field'>"+
			 		"<label><%= birthday.label %></label>"+
			 		"<input type='text' name='birthday' value='<%= birthday.val %>' />"+
			 	"</div>"+
			 	"<div class='ws-field'>"+
			 		"<label><%= email.label %></label>"+
			 		"<input type='text' name='email' value='<%= email.val %>' />"+
			 	"</div>"+
			 	"<div class='ws-field'>"+
			 		"<label><%= tel.label %></label>"+
			 		"<input type='text' name='tel' value='<%= tel.val %>' />"+
			 	"</div>"+
			 	"<div class='ws-field'>"+
			 		"<input type='submit' value='Змінити' />"+
			 	"</div>"+
			"</form>"+
		"</div>");
	},
	newClient: function(){
		return _.template(
			"<tr class='d-line-item' id='<%= _id %>'>"+
				"<td>"+
					"<a href='/client/<%= _id %>'>"+
						"<span data-name='firstName' data-val='<%= firstName %>' data-label='Ім‘я'><%= firstName %></span>"+
						"<span> </span>"+
						"<span data-name='lastName' data-val='<%= lastName %>' data-label='Прізвище'><%= lastName %></span>"+
					"</a>"+
				"</td>"+
				"<td>"+
					"<span data-name='birthday' data-val='<%= birthday %>' data-label='День народження'><%= birthday %></span>"+
				"</td>"+
				"<td>"+
					"<span data-name='email' data-val='<%= email %>' data-label='Email'><%= email %></span>"+
				"</td>"+
				"<td>"+
					"<span data-name='tel' data-val='<%= tel %>' data-label='Телефон'><%= tel %></span>"+
				"</td>"+
				"<td>"+
					"<a href='/editClient' class='edit' data-template='editClientTemplate' clientid='<%= _id %>'>Змінити</a>"+
					"<form action='/removeClient' ajax='true' ajax-success='removeLineItem'>"+
						"<input type='hidden' name='clientId' value='<%= _id %>'>"+
						"<input type='submit' class='del' value='Видалити'>"+
					"</form>"+
				"</td>"+
			"</tr>"
			);
	}
}