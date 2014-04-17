var templates = {
	esditClient: function(){
		return _.template("<div='editPopup' clientid='<%= clientid %>'>"+
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
			"</form>"+
		"</div>");
	}
}