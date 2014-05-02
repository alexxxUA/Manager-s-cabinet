var templates = {
	dialog: _.template(
			"<div class='dialog'>"+
				"<div class='closeBtn'>close</div>"+
				"<div class='content'> <%= templateContent %> </div>"+
			"</div>"
	),
	editClient: _.template(
			"<div class='dialog editPopup' data-line-id='<%= lineId %>'>"+
				"<div class='closeBtn'>close</div>"+
				"<form action='/editClient' ajax='true' ajax-success='dialogEdited'>"+
					"<input type='hidden' name='clientId' value='<%= lineId %>'/>"+
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
	),
	newClient: _.template(
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
				"<td class='actionBtns'>"+
					"<a href='#' class='edit dialogData' dialog-template='editClient' clientid='<%= _id %>'>Змінити</a>"+
					"<form action='/removeClient' ajax='true' ajax-success='removeLineItem'>"+
						"<input type='hidden' name='clientId' value='<%= _id %>'>"+
						"<input type='submit' class='del' value='Видалити'>"+
					"</form>"+
				"</td>"+
			"</tr>"
	),
	productListItem: _.template(
			"<tr class='d-line-item', id='<%=_id%>''>"+
				"<td class='tableTitle'>"+
					"<span data-name='title' data-val='<%=title%>' data-label='Назва продукту'><%=title%></span>"+
					"<span class='hidden' data-name='_id' data-val='<%=_id%>', data-label='Id'></span>"+
				"</td>"+
				"<td class='tableQty'>"+
					"<span data-name='qty' data-val='<%=qty%>' data-label='Кількість'><%=qty%></span>"+
					"<span class='hidden' data-name='maxQty' data-val='<%=maxQty%>' data-label=' Максимальна кількість '><%=maxQty%></span>"+
				"</td>"+
				"<td class='tableUnit'>"+
					"<span data-name='unit' data-val='<%=unit%>' data-label='Одиниця вимірювання'><%=unit%></span>"+
				"</td>"+
				"<td class='tablePrice'>"+
					"<span data-name='price' data-val='<%=price%>' data-label='Ціна'><%=price%></span>"+
				"</td>"+
				"<td class='tableCoast'>"+
					"<span data-name='amount' data-val='<%=amount%>' data-label='Сума'><%=amount%></span>"+
				"</td>"+
				"<td class='tableActions'>"+
					"<a href='#' class='dialogData' dialog-template='editProductInCheck' prodid='<%= _id %>'>Змінити</a>"+
					"<input type='button' id='Del' name='<%=title%>' value='Видалити'>"+
				"</td>"+
			"</tr>"
	),
	addedProductListItem: _.template(
			"<tr class='d-line-item', id='<%=_id%>''>"+
				"<td class='tableTitle'>"+
					"<span data-name='title' data-val='<%=title%>' data-label='Назва продукту'><%=title%></span>"+
				"</td>"+
				"<td class='tableQty'>"+
					"<span data-name='qty' data-val='<%=qty%>' data-label='Кількість'><%=qty%></span>"+
				"</td>"+
				"<td class='tableUnit'>"+
					"<span data-name='unit' data-val='<%=unit%>' data-label='Одиниця вимірювання'><%=unit%></span>"+
				"</td>"+
				"<td class='tablePrice'>"+
					"<span data-name='price' data-val='<%=price%>' data-label='Ціна'><%=price%></span>"+
				"</td>"+
				"<td class='tableCoast'>"+
					"<span data-name='amount' data-val='<%=amount%>' data-label='Сума'><%=amount%></span>"+
				"</td>"+
				"<td class='tableActions'>"+
					"<a href='#' class='edit dialogData' dialog-template='editProduct' dialog-before-show='editProdDialog'>Змінити</a>"+
					"<form action='/removeProd/<%= _id %>' ajax='true' ajax-success='removeLineItem'>"+
						"<input type='hidden' name='_id' value='<%= _id %>'/>"+
						"<input type='submit' class='del' value='Видалити'/>"+
					"</form>"+
				"</td>"+
			"</tr>"
	),
	editProductInCheck: _.template(
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
						"<input type='text' name='qty' value='<%= qty.val %>' data-validate-type='availQty floatNumb' data-prev-val='<%= qty.val %>' data-max-qty='<%= maxQty.val %>' />"+
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
	),
	checkItem: _.template(
			"<tr class='d-line-item' id='<%= _id %>'>"+
				"<td class='cNumb'>"+
					"<form action='/showCheck/<%= _id %>' ajax='true' ajax-success='populateCheckDialog'>"+
						"<input type='hidden' name='checkNumb' value='<%= checkNumb %>'/>"+
						"<input type='submit' value='<%= checkNumb %>'/>"+
					"</form>"+
				"</td>"+
				"<td class='checkClient'><%= clientFullName %></td>"+
				"<td class='checkDate'><%= dateString %></td>"+
				"<td class='checkAmount'><%= totalAmount %></td>"+
			"</tr>"
	),
	editProduct: _.template(
		"<div class='dialog editPopup' data-line-id='<%= lineId %>'>"+
			"<div class='closeBtn'>close</div>"+
			"<form action='/editProd/<%= lineId %>' ajax='true' ajax-success='prodEdited'>"+
				"<input type='hidden' name='_id' value='<%= lineId %>'/>"+
				"<div class='ws-field'>"+
					"<label><%= title.label %></label>"+
					"<input type='text' name='title' value='<%= title.val %>'/>"+
				"</div>"+
				"<div class='ws-field'>"+
					"<label><%= qty.label %></label>"+
					"<input type='text' name='qty' value='<%= qty.val %>' data-validate-type='floatNumb'/>"+
				"</div>"+
				"<div class='ws-field'>"+
					"<label><%= unit.label %></label>"+
					"<select name='unit'>"+
					"<% _.each(units, function(val){if(val == unit.val){%> <option value='<%= val %>' selected='selected'><%= val %></option> <%} else{%> <option value='<%= val %>'><%= val %></option> <%} }) %>"+
					"</select>"+
				"</div>"+
				"<div class='ws-field'>"+
					"<label><%= price.label %></label>"+
					"<input type='text' name='price' value='<%= price.val %>'  data-validate-type='floatNumb'/>"+
				"</div>"+
				"<div class='ws-field'>"+
					"<input type='submit' value='Змінити' />"+
				"</div>"+
			"</form>"+
		"</div>"
	)
}