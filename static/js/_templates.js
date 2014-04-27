var templates = {
	dialog: function(){
		return _.template(
			"<div class='dialog editPopup'>"+
				"<div class='closeBtn'>close</div>"+
				"<div class='content'> <%=templateContent%> </div>"+
			"</div>"
		);
	},
	esditClient: function(){
		return _.template(
			"<div class='dialog editPopup' data-line-id='<%= lineId %>'>"+
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
			"</div>"
		);
	},
	newClient: function(){
		return _.template(
			"<tr id='<%= _id %>' class='d-line-item'>"+
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
					"<a href='#' class='dialogData' data-template='editClientTemplate' clientid='<%= _id %>'>Змінити</a>"+
					"<form action='/removeClient' ajax='true' ajax-success='removeLineItem'>"+
						"<input type='hidden' name='clientId' value='<%= _id %>'>"+
						"<input type='submit' class='del' value='Видалити'>"+
					"</form>"+
				"</td>"+
			"</tr>"
		);
	},
	productListItem: function(){
		return _.template(
			"<tr class='d-line-item', id='<%=_id%>''>"+
				"<td id='tableTitle'>"+
					"<span data-name='title' data-val='<%=title%>' data-label='Назва продукту'><%=title%></span>"+
					"<span class='hidden' data-name='_id' data-val='<%=_id%>', data-label='Id'></span>"+
				"</td>"+
				"<td id='tableQty'>"+
					"<span data-name='qty' data-val='<%=qty%>' data-label='Кількість'><%=qty%></span>"+
					"<span class='hidden' data-name='maxQty' data-val='<%=maxQty%>' data-label=' Максимальна кількість '><%=maxQty%></span>"+
				"</td>"+
				"<td id='tableUnit'>"+
					"<span data-name='unit' data-val='<%=unit%>' data-label='Одиниця вимірювання'><%=unit%></span>"+
				"</td>"+
				"<td id='tablePrice'>"+
					"<span data-name='price' data-val='<%=price%>' data-label='Ціна'><%=price%></span>"+
				"</td>"+
				"<td id='tableCoast'>"+
					"<span data-name='amount' data-val='<%=amount%>' data-label='Сума'><%=amount%></span>"+
				"</td>"+
				"<td id='tableActions'>"+
					"<a href='#' class='dialogData' data-template='editProductInCheck' prodid='<%= _id %>'>Змінити</a>"+
					"<input type='button' id='Del' name='<%=title%>' value='Видалити'>"+
				"</td>"+
			"</tr>"
		);
	},
	editProductInCheck: function(){
		return _.template(
			"<div class='dialog editPopup' data-line-id='<%= lineId %>'>"+
				"<div class='closeBtn'>close</div>"+
				"<form action='#' ajax='true' ajax-before='prodEditCheck'>"+
					"<input type='hidden' name='_id' value='<%= _id.val %>'/>"+
					"<div class='ws-field'>"+
						"<label><%= title.label %></label>"+
						"<input type='text' name='title' value='<%= title.val %>' disabled='disabled'/>"+
					"</div>"+
					"<div class='ws-field'>"+
						"<label><%= qty.label %></label>"+
						"<input type='text' name='qty' value='<%= qty.val %>' data-validate-type='availQty' data-prev-val='<%= qty.val %>' data-max-qty='<%= maxQty.val %>' />"+
					"</div>"+
					"<div class='ws-field'>"+
						"<label><%= unit.label %></label>"+
						"<input type='text' name='unit' value='<%= unit.val %>' disabled='disabled'/>"+
					"</div>"+
					"<div class='ws-field'>"+
						"<label><%= price.label %></label>"+
						"<input type='text' name='price' value='<%= price.val %>' disabled='disabled'/>"+
					"</div>"+
					"<div class='ws-field'>"+
						"<input type='submit' value='Змінити' />"+
					"</div>"+
				"</form>"+
			"</div>"
		);
	},
	checkItem: function(){
		return _.template(
			"<tr class='d-line-item' id='<%= _id %>'>"+
				"<td class='cNumb'>"+
					"<form action='/showCheck' ajax='true' ajax-success='populateCheckDialog'>"+
						"<input type='hidden' name='_id' value='<%= _id %>'>"+
						"<input type='hidden' name='checkNumb' value='<%= checkNumb %>'>"+
						"<input type='submit' value='<%= checkNumb %>'>"+
					"</form>"+
				"</td>"+
				"<td class='checkClient'><%= clientFullName %></td>"+
				"<td class='checkDate'><%= dateString %></td>"+
				"<td class='checkAmount'><%= totalAmount %></td>"+
			"</tr>"
		);
	},
}