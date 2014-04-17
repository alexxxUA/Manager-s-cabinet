var templates = {
	esditClient: function(){
		return _.template("<div class='dialog editPopup' clientid='<%= clientid %>'>"+
			"<div class='closeBtn'>close</div>"+
			"<form action='/editClient' ajax='true' ajax-success='clientEdited'>"+
			 	"<div class='ws-field'>"+
			 		"<label><%= firstName.label %></label>"+
			 		"<input type='text' value='<%= firstName.val %>' />"+
			 	"</div>"+
			 	"<div class='ws-field'>"+
			 		"<label><%= lastName.label %></label>"+
			 		"<input type='text' value='<%= lastName.val %>' />"+
			 	"</div>"+
			 	"<div class='ws-field'>"+
			 		"<label><%= birthday.label %></label>"+
			 		"<input type='text' value='<%= birthday.val %>' />"+
			 	"</div>"+
			 	"<div class='ws-field'>"+
			 		"<label><%= email.label %></label>"+
			 		"<input type='text' value='<%= email.val %>' />"+
			 	"</div>"+
			 	"<div class='ws-field'>"+
			 		"<label><%= tel.label %></label>"+
			 		"<input type='text' value='<%= tel.val %>' />"+
			 	"</div>"+
			 	"<div class='ws-field'>"+
			 		"<input type='submit' value='Змінити' />"+
			 	"</div>"+
			"</form>"+
		"</div>");
	}
}