// Datepicker
$("#datepicker").datepicker({
	onSelect : setFocusInp
});
$("#datepicker2").datepicker({
	onSelect : setFocusInp
});
//Table sorter
$("#myTable table").tablesorter();
//Placeholders
$('input[placeholder], textarea[placeholder]').placeholder();
//Loading and error items
var $loadingItem = $('#loading'),
	$errorItem = $('#errorAjax');

var titleError = $('#rightSide #productList tr td').get();
if(titleError.length == 0){
	$('#tableListError').css('display', 'block');
};
var searchItem = 0;
//Regexp
var regexpEmail = /^\b[0-9A-Z_\.]+@[0-9A-Z]+\.[A-Z]{2,4}\b$/i,	//for email
	regexpNumber = /^\b\d+\b$/i,
	regexpFloatNumber = /^\b[0-9]*\.?[0-9]{1,2}\b$/i;

//Get and set time in cookie
function setTimeCookie(){
	//Formated time
	var	d = new Date(),
		curDate = d.getDate(),
		curMonth = d.getMonth()+1,
		curYear = d.getFullYear();

	var curDay = (curMonth<=9? '0'+curMonth : curMonth)+'/'+(curDate<=9? '0'+curDate : curDate)+'/'+curYear;
	//Time in miliseconds
	var mSeconds = d.getTime();
	//Time zone
	var	timeZone = -d.getTimezoneOffset()/60;
	//Record times in cookies
	$.cookie('day', curDay);
	$.cookie('mSeconds', mSeconds);
	$.cookie('timeZone', timeZone);
	return mSeconds;
}
setTimeCookie();

//Focus on input report date
function setFocusInp(){
	$('#generateReport').focus();
};
//Flour number
function floorN(x, n){
	var numb = Number(x);
	return numb.toFixed(n);
}

//Get Y coordinate
function getYOffset() {
	var pageY;
	if(typeof(window.pageYOffset)=='number') {
	   pageY=window.pageYOffset;
	}
	else {
	   pageY=document.documentElement.scrollTop;
	}
	return pageY;
}

//Function fadeOut error msgs
function fadeoutErrMsgs(){
	$('#searchProdErrorQty, #searchProdErrorExist, #searchProdErrorQty2, #searchProdErrorExistInCheck').fadeOut(200);
}

//Function check ADD and EDIT form
function checkAddEditForm(formID, data, checkMaxQty){
	$.each(data, function(i, val){
		if(val.length == 0){
			$('#'+i).addClass('error');
		}
		else if(i == 'qtyProd' || i == 'priceProd'){
			if(!(regexpFloatNumber.test(val))){
				$('#'+formID+' #'+i).addClass('error');
			}
		}
		else if(typeof(checkMaxQty) !== 'undefined' && checkMaxQty !== 0 && +checkMaxQty < +data.qtyProd){
			$('#'+formID+' #qtyProd').addClass('error');
		}
	});
};

//Forgot password
function sendDataForgotPass(data){
	$('#loading').css('display', 'block');
	$.ajax({
		type: 'GET',
		url: '/forgotPass',
		data: data,
		success: function(request) {
			$('#loading').css('display', 'none');
			if(request == 'email'){
				$('#forgotError').text('Неправильний email.')
			}
			else if(request == 'error'){
				$('#forgotError').text('Відбувся збій, спробуйте ще.')
			}
			else if(request == 'success'){
				$('#forgotSuccess').css('display', 'block');
				$('#forgotEmail').val('');
			}
		}
	});
}
function collectSendDataForgotPass(){
	var data = {};
	data.email = $('#forgotEmail').val();
	$('#forgotError').text('');
	$('#forgotSuccess').css('display', 'none');
	sendDataForgotPass(data);
}
//Submit email to recover password
$('#forgotPass').on('click', function(e){
	e.preventDefault();
	collectSendDataForgotPass();
});
$('#forgotEmail').on('keydown', function(e){
	if(e.keyCode == 13){
		collectSendDataForgotPass();
	}
})
//Popup 'forgot pass' slide down
$('#forgotPassLink').on('click', function(e){
	e.preventDefault();
	$('#forgotPassPoup').slideDown();
	$('#forgotEmail').focus();
	$('#modalWindow').css('display' , 'block');
});

//Edit prod poup
function editPRoduct(e){
	var yPos = e.pageY-15,
		xPos = e.pageX,
		editPopup = $('#editProductPopup');

	var	getParentTr =$(e.target).closest('tr'),
		popup = $('#editProductPopup'),
		editProdData = {};

	$(getParentTr).attr('id' , 'tempEditProd');

	editProdData.editTitleProd = $(getParentTr).find('#tableTitle').text();
	editProdData.editPriceProd = $(getParentTr).find('#tablePrice').text();
	editProdData.editUnit = $(getParentTr).find('#tableUnit').text();
	editProdData.editQtyProd = $(getParentTr).find('#tableQty').text();
	editProdData.editMaxQty = $(getParentTr).find('#tableTitle').attr('maxQty');

	$(popup).find('#nameProd').attr({'name' : editProdData.editTitleProd, 'maxQty' : editProdData.editMaxQty, 'qty' : editProdData.editQtyProd});
	$(popup).find('#nameProd').val(editProdData.editTitleProd);
	$(popup).find('#unitProd [value=' +editProdData.editUnit+ ']').attr("selected", "selected");
	$(popup).find('#priceProd').val(editProdData.editPriceProd);
	$(popup).find('#qtyProd').val(editProdData.editQtyProd);


	$(editPopup).css({'top': yPos, 'left' : xPos});
	$(editPopup).slideDown(400);
	$('#modalWindow').css('display', 'block');
	$('#editProductWraper #nameProd').focus();
}

//Function chose searched item
function selectSearched(){
	var selectedAttr = $('#searchResults .selected').attr('id');
	if(selectedAttr !== 'available')
		return;

	var	searchChosenTitle = $('#searchResults .selected .searchProdNAme').text(),
		searchChosenPrice = $('#searchResults .selected').attr('price'),
		searchChosenMaxQty = $('#searchResults .selected').attr('maxQty'),
		searchChosenUnit = $('#searchResults .selected').attr('data-unit'),
		searchChosenId = $('#searchResults .selected').attr('data-id');
	
	$('#searchResults').css('display', 'none');
	$('#searchProd').val(searchChosenTitle).attr({'data-val': searchChosenTitle, 'data-id': searchChosenId});
	$('#searchProdPrice').val(searchChosenPrice);
	$('#searchProdUnit').val(searchChosenUnit);
	$('#searchProdId').val(searchChosenId);
	$('#searchProdQty, #searchProdSumm').val('');
	$('#searchProdMaxQty').val(searchChosenMaxQty);
	$('#searchProdQty').attr('data-max-qty', searchChosenMaxQty);
	$('#searchResults ul li').removeClass('selected');
	$('#modalWindow').css('display', 'none');
	searchItem = 0;
	setTimeout(function(){
		$('#searchProdQty').focus();
	}, 100);
};

//Add product to list
function addProductToList(prodName, prodQty, prodPrice, prodUnit, tableID, addForm, maxQty){
	var productListItem = "<tr style='display:none'>"+
		"<td id='tableTitle' maxQty='"+maxQty+"'>"+prodName+"</td>"+
		"<td id='tableQty'>"+floorN(prodQty, 2)+"</td>"+
		"<td id='tableUnit'>"+prodUnit+"</td>"+
		"<td id='tablePrice'>"+floorN(prodPrice, 2)+"</td>"+
		"<td id='tableCoast'>"+floorN(prodQty*prodPrice, 2)+"</td>"+
		"<td id='tableActions'>"+
			"<input type='button' id='Edit' name='"+prodName+"' value='Edit'>"+
			"<input type='button' id='Del' name='"+prodName+"' value='Delete'>"+
		"</td>"+
		"</tr>";

	$('#'+tableID+'').append(productListItem);
	$('#'+tableID+' tbody tr:last-child').fadeIn(400);
	$('#tableListError').css('display', 'none');

	if(addForm == true){
		//Clear fields
		$('#addProducForm [type="text"]').val('');
		//Succes icon
		$('#addProdTitle').addClass('success');
		setTimeout(function(){
			$('#addProdTitle').removeClass('success');					
		}, 500);
		$('#nameProd').focus();
	}
	else if(addForm == false){
		var chunkSummCheck = +$('#salingsValueCheck').text();
		$('#checkList').slideDown();
		$('#salingsValueCheck').text(floorN(chunkSummCheck+(prodQty*prodPrice), 2));
	}
}

//Add to sales list
function addSaleList(dat, kindTable, soldType){
	$('#errorAjax').css('display', 'none');
	fadeoutErrMsgs();
	var data = {};

	if(kindTable == 'checkList'){

		data.titleSold = dat.titleSold;
		data.qtySold = dat.qtySold;
		data.priceSold = dat.priceSold;
		data.sold = soldType;

		if($('#searchProd').val().length == 0){
			$('#searchProdErrorExist').slideDown(200);
		}
		else if(regexpFloatNumber.test(data.qtySold)){
			$loadingItem.css('display', 'block');
			$.ajax({
				type: 'GET',
				url: '/addToSaleList',
				data: data,
				success: function(request) {
					$('#loading').css('display', 'none');
					if(request == 'sold'){
						var checkExistingProduct = true; //Check existing product in check
						$('#checkList tbody tr').each(function(index){
							var titleSold = $(this).find('#tableTitle').text();
							if(titleSold == data.titleSold){
								checkExistingProduct = false;
							}
						});
						if(checkExistingProduct){
							var maxQty = $('#searchProd').attr('maxQty');
							addProductToList(data.titleSold, data.qtySold, data.priceSold, 'tableListCheck', false, maxQty);

							//Clear inputs
							$('#searchProd, #searchProdQty, #searchProdPrice, #searchProdSumm').val('');
							$('#searchProd').focus();
						}
						else{
							$('#searchProdErrorExistInCheck').slideDown(200);
						}
					}
					else if(request == 'qty'){
						$('#searchProdErrorQty .availableCount').text(function(){
							return ' '+floorN( +$('#searchProd').attr('maxqty'), 2);
						});
						$('#searchProdErrorQty').slideDown(200);
					}
					else if(request == 'title'){
						$('#searchProdErrorExist').slideDown(200);
					}
				},
				error : function(){
					$('#loading').css('display', 'none');
					$('#errorAjax').css('display', 'block');
				}
			});
		}
		else{
			$('#searchProdErrorQty2').slideDown(200);
		}
	}
	else if(kindTable == 'saleList'){
		data.arrCheckList = dat;
		data.sold = soldType;
		data.mSeconds = setTimeCookie();
		$loadingItem.css('display', 'block');
		$.ajax({
			type: 'GET',
			url: '/addToSaleList',
			data: data,
			success: function(request) {
				$('#loading').css('display', 'none');
				if(request == 'sold'){
					var chekList = data.arrCheckList;

					for(var i=0; i < chekList.length; i++){
						var qtySold = +(chekList[i].qtySold),
							titleSold = chekList[i].titleSold,
							priceSold = +(chekList[i].priceSold);

						var saleTableItem = '<tr style="display:none">'+
							'<td id="salesTableTitle">'+titleSold+'</td>'+
							'<td id="salesTableQty">'+floorN(qtySold, 2)+'</td>'+
							'<td id="salesTablePrice">'+floorN(priceSold, 2)+'</td>'+
							'<td id="salesTableCoast">'+floorN((qtySold*priceSold), 2)+'</td>'+
							'</tr>';

						$('#salesTableList tbody').append(saleTableItem);
						$('#salesTableList tbody tr:last-child').fadeIn(200);
						$('#salingsValue').text(function(index, text){
							var chunkSumm = qtySold*priceSold;
							return floorN((+text+chunkSumm), 2);
						});
						$('#checkList').slideUp();
						$('#checkList #tableListCheck tbody tr').remove();
					}

				}
			},
			error : function(){
				$('#loading').css('display', 'none');
				$('#errorAjax').css('display', 'block');
			}
		});
	}
}
//Display editings in table
function renderEditings(data){
	$('#tempEditProd #tableTitle').text(data.nameProd);
	$('#tempEditProd #tableQty').text(floorN(data.qtyProd, 2));
	$('#tempEditProd #tablePrice').text(floorN(data.priceProd, 2));
	$('#tempEditProd #tableCoast').text(floorN(data.qtyProd*data.priceProd, 2));
	$('#tempEditProd #tableUnit').text(data.unitProd);
	$('#tempEditProd').removeAttr('id');
	$('#editProductPopup').slideUp(300);
	$('#modalWindow').css('display', 'none');
}

//Apply editing product
function applyEditings(changeProductBase){
	$('#editProductPopup input').removeClass('error');

	var data = {},
		attrMaxQty = +$('#editProductPopup #nameProd').attr('maxQty'),
		attrQty = +$('#editProductPopup #nameProd').attr('qty');
	data.defaultProdName = $('#editProductPopup #nameProd').attr('name');
	data.nameProd = $('#editProductPopup #nameProd').val();
	data.qtyProd = +$('#editProductPopup #qtyProd').val();
	data.priceProd = +$('#editProductPopup #priceProd').val();
	data.unitProd = $('#editProductPopup #unitProd').val();

	checkAddEditForm('editProductPopup', data, attrMaxQty);

	var errorEditProd = $('#editProductPopup').find('.error');
	if(errorEditProd.length == 0){
		$('#editProductPopup input').removeClass('error');
		if(changeProductBase){
			$.ajax({
				type: "GET",
				url: "/applyEditing",
				data: data,
				success: function(request) {
					renderEditings(data);
				}
			});
		}
		else{
			renderEditings(data);
			var chunkSummCheck = +$('#salingsValueCheck').text(),
				newSumm = 0;

			if(data.qtyProd > attrQty){
				newSumm = chunkSummCheck + ((data.qtyProd - attrQty) * data.priceProd);
				$('#salingsValueCheck').text(floorN(newSumm, 2));
			}
			else if(data.qtyProd < attrQty){
				newSumm = chunkSummCheck - ((attrQty - data.qtyProd) * data.priceProd);
				$('#salingsValueCheck').text(floorN(newSumm, 2));
			}
		}
	}
}

//Remove list item from list
function removeListItem(e, changeProductBase, ParentTr){
	var getParentTr =$(e.target).closest('tr');
	$(getParentTr).fadeOut(200, function(){
		$(this).remove();
		if(changeProductBase){
			var titleError = $('#rightSide #productList tbody tr').get();
			if(titleError.length == 0){
				$('#tableListError').css('display', 'block');
			}
		}
		else{
			var countCheckList = $('#tableListCheck td');
			if(countCheckList.length == 0){
				$('#checkList').slideUp();
			}
		}
	});
}

//Dell product
function dellPRoduct(e, changeProductBase){
	var getParentTr =$(e.target).closest('tr');
	var data = {};
	data.titleProd = $(getParentTr).find('#tableTitle').text();
	data.loginName = $('#userName').text();

	if(changeProductBase){
		$.ajax({
			type: 'GET',
			url: '/delProduct',
			data: data,
			success: function(request){
				removeListItem(e, changeProductBase, getParentTr);
			}
		});
	}
	else{
		removeListItem(e, changeProductBase, getParentTr);
		var chunkSummCheck = +$('#salingsValueCheck').text(),
			deletedSumm = +$(getParentTr).find('#tableCoast').text();
		$('#salingsValueCheck').text(floorN(chunkSummCheck - deletedSumm, 2));
	}
}
//Function date for rendering report list
function getDayReport(request, i){
	var MILISEC = +(request[i].day);
	var d = new Date(MILISEC),
		curDate = d.getDate(),
		curMonth = d.getMonth()+1,
		curYear = d.getFullYear();
	return (curMonth<=9? '0'+curMonth : curMonth)+'/'+(curDate<=9? '0'+curDate : curDate)+'/'+curYear;
}
//Renderreport list
function renderReportList(){
	$('#errorReport').css({'display' : 'none'});
	$('#errorAjax').css('display', 'none');
	var reportSumm = 0;
	var data = {};
	data.reportDateFrom = $('#datepicker').val(),
	data.reportDaysTill = $('#datepicker2').val();

	$loadingItem.css('display', 'block');
	$.ajax({
		type: "GET",
		url: "/renderReportList",
		data: data,
		success: function(request) {
			$('#loading').css('display', 'none');
			if(request.length > 0){
				$('#reportList tbody tr').remove();
				for(var i=0; i < request.length; i++){
					var reportTableDay = '<tr class="reportDay">'+
					'<td colspan="4">Продажі за : '+getDayReport(request, i)+'</td>'+
					'<tr>';
					var reportTableItem = '<tr>'+
					'<td id="salesTableTitle">'+request[i].title+'</td>'+
					'<td id="salesTableQty">'+floorN(request[i].qty, 2)+'</td>'+
					'<td id="salesTablePrice">'+floorN(request[i].price, 2)+'</td>'+
					'<td id="salesTableCoast">'+floorN(request[i].qty*request[i].price, 2)+'</td>'+
					'</tr>';
					if(i == 0){
						$('#reportList tbody').append(reportTableDay);
					}
					else if(getDayReport(request, i) !== getDayReport(request, i-1)){
						$('#reportList tbody').append(reportTableDay);
					}
					reportSumm += request[i].qty*request[i].price;
					$('#reportList tbody').append(reportTableItem);
				};
				$('#reportSumm').text(floorN(reportSumm, 2));
				$('#reportList').fadeIn(500);
			}
			else{
				$('#reportList').css('display', 'none');
				$('#errorReport').css({'display' : 'block'}).text('За ці дні немає продаж.');
			}
		},
		error : function(){
			$('#loading').css('display', 'none');
			$('#errorAjax').css('display', 'block');
		}
	});
};
//Add to sales list from check list
function fromCheckToSalesList(){
	var arrCheckList = [];
	$('#checkList tbody tr').each(function(index){
		var data = {};
		data.titleSold = $(this).find('#tableTitle').text();
		data.qtySold = $(this).find('#tableQty').text();
		data.priceSold = $(this).find('#tablePrice').text();
		arrCheckList.push(data);
	});
	if(arrCheckList.length !== 0){
		addSaleList(arrCheckList, 'saleList', true);
	}
}

//Clear report list
function clearReportList(){
	$('#reportList').css('display', 'none');
	$('#reportList tbody tr').remove();
};

//Function login
function login(log, pas){
	var data = {};
	data.loginLogin = log;
	data.passwordLogin = pas;

	$.ajax({
		type: "GET",
		url: "/login",
		data: data,
		success: function(request) {
			if(request){
				window.location = '/home';
			}
			else{
				$('#errorMessagesLog').css({'display': 'block'}).text('Логін або пароль невірний');
			}
		}
	});
};
//Function logout
function logout(){
	var data = {};
	data.logout = 'logout';
	$.ajax({
		type: "GET",
		url: "/",
		data: data,
		success: function(request) {
			window.location = '/';
		}
	});
};

$(document).on('keyup', function(e){
	if(e.keyCode == 27){
		logout();
	}
});
$('#salesListGroup #searchProd').focus();

//Logout
$('#logout').on('click', function(e){
	e.preventDefault();
	logout();
});

//Register
function register(){
	var data = {};
	data.firstName = $('#firstName').val();
	data.lastName = $('#lastName').val();
	data.login = $('#login').val();
	data.password = $('#password').val();
	data.email = $('#email').val();


	$('#errorMessagesReg').css({'display': 'none', 'color' : ''}).text('');;
	$('#registerData input').removeClass('error');

	$.each(data, function(i, val){
		if(val.length == 0){
			$('#'+i).addClass('error');
		}
	});

	var errorBorder = $('#register-form').find('.error');
	if(errorBorder.length > 0){
		$('#errorMessagesReg').css('display', 'block').text('Заповніть всі поля');
	}
	else if(!(regexpEmail.test(data.email))){
		$('#errorMessagesReg').css('display', 'block').text('Введіть правильний email');
		$('#email').addClass('error');
	}
	else{
		$.ajax({
			type: "GET",
			url: "/register",
			data: data,
			success: function(request) {
				if(request == 'login'){
					$('#errorMessagesReg').css('display', 'block').text('Login вже існує');
					$('#login').addClass('error');
				}
				else if(request == 'email'){
					$('#errorMessagesReg').css('display', 'block').text('Email вже існує');
					$('#email').addClass('error');
				}
				else if(request.login){
					login(request.login, request.password);
				}
			}
		});
	}
};

//Register
$('#registerData').on('submit', function(e) {
	e.preventDefault();
	register();
});

//Login
$('#loginForm').on('submit', function(e){
	e.preventDefault();
	login(($('#loginLogin').val()), ($('#passwordLogin').val()));
});

//Add product
$('#addProducForm').on('submit', function(e){
	e.preventDefault();
	$('#addProducForm input').removeClass('error');

	var data = {};
	data.nameProd = $('#addProducForm #nameProd').val();
	data.qtyProd = $('#addProducForm #qtyProd').val();
	data.priceProd = $('#addProducForm #priceProd').val();
	data.unit = $('#addProducForm #unit').val();

	checkAddEditForm('addProducForm', data);

	var errorAddForm = $('#addProducForm').find('.error');

	if(errorAddForm.length == 0){
		$loadingItem.css('display', 'block');
		$.ajax({
			type: "GET",
			url: "/addProduct",
			data: data,
			success: function(request) {
				$loadingItem.css('display', 'none');
				if(request){
					addProductToList(request.nameProd, request.qtyProd, request.priceProd, request.unit, 'tableList', true, 0);
				}
				else if(!request){
					$('#addProducForm #nameProd').addClass('error');
				}
			}
		});
	}
});

//Delete product from check
$('#checkList #tableActions #Del').live('click', function(e){
	e.preventDefault();
	dellPRoduct(e, false);
});

//Delete product from database
$('#productList #tableActions #Del').live('click', function(e){
	e.preventDefault();
	dellPRoduct(e, true);
});

//Edit product
$('#tableActions #Edit').live('click', function(e){
	e.preventDefault();
	editPRoduct(e);
});

//Apply editing product
$('#editProductWraper input').on('keyup', function(e){
	if(e.keyCode == 13){
		$('#applyEdits, #applyEditsCheck').trigger('click');
	}
});
$('#editProductPopup #applyEdits').on('click', function(e){
	applyEditings(true);
});

//Close modal and poups
function closeModal(){
	$('#modals').text('');

	$('#editProductPopup, #forgotPassPoup, #salesSettings').slideUp(300);
	$('#searchResults, #modalWindow, #forgotSuccess').css('display', 'none');
	$('#tempEditProd').attr('id', '');
	$('#searchResults ul li').removeClass('selected');
	$('#forgotError').text('');
	$('#forgotEmail').val('');
	searchItem = 0;
}

//FadeOut popup
$('#closeBtn').on('click', function(e){
	e.preventDefault();
	closeModal();
})
$('#modalWindow').on('click', function(){
	closeModal();
});

//Live search products
function searchProd(e){
	if(e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 13 && e.keyCode !== 39 && e.keyCode !== 37 && e.keyCode !== 17){
		searchItem = 1;
		var data = {};
		data.saerchName = $('#searchProd').val();

		$.ajax({
			type: "GET",
			url: "/search",
			data: data,
			success: function(request) {
				fadeoutErrMsgs();
				$('#searchResults').find('li').remove();
				if(request.length !== 0){
					$('#modalWindow, #searchResults').css('display', 'block');
					var i=0,
						searchViewedCount = 15;
					while(i < request.length && i < searchViewedCount){
						if(request[i].qty == 0){
							$('#searchResults ul').append('<li price='+request[i].price+' data-unit='+ request[i].unit +' data-id='+ request[i]._id +' id="exist">'+request[i].title+'</li>');
						}
						else{
							$('#searchResults ul').append('<li price='+request[i].price+' data-unit='+ request[i].unit +' data-id='+ request[i]._id +' maxQty='+floorN(request[i].qty, 2)+' id="available"><span class="searchProdNAme">'+request[i].title+'</span><span class="searchCount">'+floorN(request[i].qty, 2)+'</span></li>');
						}
						i++;
					}
					$('#searchResults ul li:nth-child('+searchItem+')').addClass('selected');
				}
			}
		});
	}
	//Keu DOWN
	else if(e.keyCode == 40){
		var countSearchItems = $('#searchResults ul li');
		if(countSearchItems.length > searchItem){
			searchItem += 1;
			$('#searchResults ul li:nth-child('+(searchItem-1)+')').removeClass('selected');
			$('#searchResults ul li:nth-child('+searchItem+')').addClass('selected');
		}
	}
	//Key UP
	else if(e.keyCode == 38){
		var countSearchItems = $('#searchResults ul li');
		if(searchItem > 1){
			searchItem -= 1;
			$('#searchResults ul li:nth-child('+(searchItem+1)+')').removeClass('selected');
			$('#searchResults ul li:nth-child('+searchItem+')').addClass('selected');
		}
	}
	//Key Enter
	else if(e.keyCode == 13){
		selectSearched();
	}
};


//Search delegates
//prevent form submit on prodName field
$(document).delegate('#searchProd', 'keypress', function(e){
	if(e.keyCode == 13)
		e.preventDefault();
});
$('#searchProd').on('keyup', function(e){
	searchProd(e);
});

//Search hover items
$('#searchResults ul li').live('hover', function(){
	$('#searchResults ul li').removeClass('selected');
	$(this).addClass('selected');
	searchItem = ($('#searchResults ul li').index(this))+1;
});

//Select search
$('#searchResults .selected').live('click', function(){
	selectSearched();
});

//Calculate summ
$('#searchProdQty').on('keyup', function(e){
	var	saleProdQty = $('#searchProdQty').val(),
		saleProdPrice = $('#searchProdPrice').val();
	if(regexpFloatNumber.test(saleProdQty)){
		var saleSumm = floorN(saleProdQty*saleProdPrice, 2);
		$('#searchProdSumm').val(saleSumm);
		fadeoutErrMsgs();
	}
});

//Add to sales list
$('#btnSell').on('click', function(e){
	e.preventDefault();
	fromCheckToSalesList();
});

//Add to sales list from check by ctrl+enter
$('#searchProd').on('keydown', function(e){
	if((e.ctrlKey) && (e.keyCode == 13)){
		fromCheckToSalesList();
	}
});

//Apply edit product in ceck
$('#editProductPopup #applyEditsCheck').on('click', function(e){
	applyEditings(false);
});
//Generate report list
$('#generateReport').on('click', function(e){
	e.preventDefault();
	renderReportList();
});
$('#getReport').on('keyup', function(e){
	if(e.keyCode == 13){
		renderReportList();
	}
	else if(e.keyCode == 46){
		clearReportList();
	}
});

//Clear report list
$('#clearReportList').on('click', function(e){
	e.preventDefault();
	clearReportList();
});

//Scroll to TOP
$('#scrollTop').on('click', function(e){
	e.preventDefault();
	$('html').animate({scrollTop:0}, 250);
	$('body').animate({scrollTop:0}, 250);
});
$(window).scroll(function () {
	var scrollLink = $('#scrollTop');
	if(getYOffset() >= 200){
		$(scrollLink).fadeIn(400);
	}
	else{
		$(scrollLink).fadeOut(400);
	}
});

//Get loading position
$(window).on('mousemove', function(e){
	var loadIcon = $loadingItem.css('display'),
		ajaxError = $errorItem.css('display');
	if(loadIcon == 'block' || ajaxError == 'block'){
		var yPosLoad = e.pageY+7,
			xPosLoad = e.pageX+7;
		$loadingItem.css({'top' : yPosLoad+7, 'left' : xPosLoad+7});
		$errorItem.css({'top' : yPosLoad-13 , 'left' : xPosLoad+11});
	}
});

//Settings popup
$('.settings').on('click', function(e){
	e.preventDefault();
	$('#salesSettings').slideDown(300);
	$('#modalWindow').css('display' , 'block');
});

//Clear sales list
$('.clearSalesList').on('click', function(e){
	e.preventDefault();
	$('#loading').css('display', 'block');
	$('#errorAjax').css('display', 'none');
	$.ajax({
		type: "GET",
		url: "/clearSalesList",
		success: function(request) {
			console.log(request);
			$('#loading').css('display', 'none');
			if(request == 'error'){
				$('#errorAjax').css('display', 'block');
			}
			else{
				closeModal();
			}
		},
		error: function(){
			$('#loading').css('display', 'none');
			$('#errorAjax').css('display', 'block');
		}
	});
});

$('.hidePass').live('click', function(){
	console.log('click');
	var $this = $(this);
	$this.animate({"width": "10%"}, "slow", function(){
		$this.removeClass('hidePass').addClass('showPass');
	});
});

$('.showPass').live('click', function(){
	var $this = $(this);
	$this.removeClass('showPass').addClass('hidePass');
	$this.animate({"width": "100%"}, "slow");
});

$('#adminActions #Edit').live('click', function(e){
	var $this = $(this);
	var yPos = e.pageY-15,
		xPos = e.pageX,
		editPopup = $('#editProductPopup');


	$(editPopup).css({'top': yPos, 'left' : xPos});
	$(editPopup).slideDown(400);
	$('#modalWindow').css('display', 'block');
	$('#editProductWraper #nameProd').focus();

	$this.closest('tr').find('td').each(function(i, value){
		console.log(i);
		console.log(value);
	})
})
//Footer at the bootom of the page
var $footer = $('#footer'),
	footerHeight = $footer.height();
$footer.css('margin-top', -(footerHeight + 10));
$('#content').css('padding-bottom', footerHeight+80);


/*
-------------------------------------------------------------
---------------------- NEW PART OF CODE ---------------------
-------------------------------------------------------------

*/

//RegExp selector
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ? 
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

//Get data from form
function getFormData($form){
	var data = {};
	$form.find('[name]').each(function(){
		var $this = $(this),
			elVal = $this.val();

		if($this.prop('tagName') == 'SELECT' && $this.find(':selected').val() == $this.find(':first').val())
			elVal = '';

		data[$this.attr('name')] = elVal;
	});

	return data;
}

//Execute function from string
function executeFunctionByName(functionName, context , args) {
	var args = [].slice.call(arguments).splice(2),
		namespaces = functionName.split("."),
		func = namespaces.pop();
	for(var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].apply(this, args);
}

//Regexp
var regexp = {
	numb: /^\b\d+\b$/i,
	floatNumb: /^\b[0-9]*\.?[0-9]{1,2}\b$/i,
	notEmpty: /.+/,
	email: /^\b[0-9A-Z_\.]+@[0-9A-Z]+\.[A-Z]{2,4}\b$/i
};

var Dialog = {
	modalBg: '#modalWindow',
	dialogCont: '.modals',
	closeBtn: '.closeBtn',
	dialogDataLink: '.dialogData',
	init: function(){
		var obj = this;
		$(document).delegate(obj.dialogDataLink, 'click', $.proxy(obj, 'loadDialog'));
		$(document).delegate(obj.modalBg, 'click', $.proxy(obj, 'hide'));
		$(document).delegate(obj.closeBtn, 'click', $.proxy(obj, 'hide'));
	},
	collectLineData: function($params){
		var data = {};

		$params.each(function(){
			var $this = $(this),
				dName = $this.attr('data-name'),
				dLabel = $this.attr('data-label'),
				dVal = $this.attr('data-val');
			
			data[dName] = {};
			
			if(typeof dLabel !== 'undefined')
				data[dName].label = dLabel;
			else
				data[dName].label = '';

			if(typeof dVal !== 'undefined')
				data[dName].val = dVal;
			else
				data[dName].val = '';
		});

		return data;
	},
	//Loading dialog with data
	loadDialog: function(e){
		e.preventDefault();

		var $this = $(e.currentTarget),
			yPos = e.pageY-15,
			xPos = e.pageX,
			$modals = $('#modals'),
			$editLine = $this.closest('.d-line-item'),
			$params = $editLine.find('[data-name]'),
			templateName = $this.attr('data-template'),
			lineId = $editLine.attr('id'),
			data = this.collectLineData($params);

		data.lineId = lineId;		

		var $dialog = $( templates[templateName]()(data) ).css({'top': yPos, 'left': xPos});
		this.show($dialog);		
	},
	show: function($dialog){
		$(this.modalBg).css({'top': '0', 'left': '0'}).show();
		$(this.dialogCont).append($dialog);
	},
	hide: function(){
		$(this.modalBg).hide().css({'top': '-100%', 'left': '-100%'});
		$(this.dialogCont).text('');
	}
}

var Validator = {
	fieldClass: 'ws-field',
	errorClass: 'data-error',	
	init: function(){
		this.registerEvents();
	},
	registerEvents: function(){
		var obj = this;
		$(document).delegate('[data-validate-type]', 'blur', $.proxy(obj, 'validate'));
	},
	valRegExps: {
		numb: /^\b\d+\b$/i,
		floatNumb: /^\b[0-9]*\.?[0-9]{1,2}\b$/i,
		notEmpty: /.+/,
		email: /^\b[0-9A-Z_\.]+@[0-9A-Z]+\.[A-Z]{2,4}\b$/i
	},
	valRules: {
		availQty: function(e, data, obj){
			return (obj.valRegExps.numb).test(data.checkValue) && data.checkValue <= data.availQty ? true : false;
		},
		ifAdded: function(e, data, obj){
			return $('#'+data._id).length ? false : true;
		},
		attrVal: function(e, data, obj){
			return data.attrVal == data.checkValue ? true : false;
		},
		notEmptySelect: function(e, data, obj){
			return $this.find(':selected').text() !== $this.find(':first').text() ? true : false;
		}
	},
	validate: function(e){
		var obj = this,
			$this = $(e.currentTarget);
			data = {
				validatorType: $this.attr('data-validate-type').split(' '),
				checkValue: $this.val(),
				checkTag: $this.prop('tagName'),
				availQty: +$this.attr('data-max-qty'),
				attrVal: $this.attr('data-val'),
				_id: $this.attr('data-id')	
			},
			isValidBase = true;
			
		
		if(data.validatorType.length){
			for(var i=0; i < data.validatorType.length; i++){
				var isValid = true;
				
				if(typeof obj.valRegExps[data.validatorType[i]] !== 'undefined'){
					if((obj.valRegExps[data.validatorType[i]]).test(checkValue))
						isValid = true;
					else
						isValid = false;
				}
				else if(typeof obj.valRules[data.validatorType[i]] !== 'undefined'){
					if(obj.valRules[data.validatorType[i]](e, data, obj))
						isValid = true;
					else
						isValid = false;
				}
				else{
					console.log('Validator rule exist');
				}
				
				if(isValid == true)
					obj.hideError(e, data.validatorType[i]);
				else
					obj.showError(e, data.validatorType[i]);				
			}
		}
		
		if(isValidBase == true)
			obj.hideBaseError(e);
		else
			obj.showBaseError(e);
	},
	showBaseError: function(e){
		var $this = $(e.currentTarget);
		$this.closest('.'+ this.fieldClass).addClass(this.errorClass);
	},
	hideBaseError: function(e){
		var $this = $(e.currentTarget);
		$this.closest('.'+ this.fieldClass).removeClass(this.errorClass);
	},
	showError: function(e, validatorType){
		var $this = $(e.currentTarget);
		$this.closest('.'+ this.fieldClass).addClass(this.errorClass +'-'+validatorType);
	},
	hideError: function(e, validatorType){
		var $this = $(e.currentTarget);
		$this.closest('.'+ this.fieldClass).removeClass(this.errorClass +'-'+validatorType);
	},
	removeAllErrorClasses: function($context){
		$context.find(':regex(class, data-error.*)').removeClass(function(index, css){
			return ( css.match(/data-error.*[!' ']/g) || []).join(' ');
		});
	}
}

//Ajax form submit
function ajaxStop(xhr, options){
	xhr.abort();
	$('#loading').css('display', 'none');
}
$(document).delegate('form[ajax="true"]', 'submit', function(e){
	e.preventDefault();

	var $form = $(this),
		formAction = $form.attr('action'),
		formData = $form.serialize(),
		formBeforeSend = $form.attr('ajax-before'),
		formSuccess = $form.attr('ajax-success'),
		formError = $form.attr('ajax-err');

	$form.find('[data-validate-type]').trigger('focusout');
				
	var formErrors = $form.find(':regex(class, data-error.*)');
	if(formErrors.length > 0){
		console.log('Form errors.');
		return false;
	}

	$.ajax({
		type: "GET",
		url: formAction,
		data: formData,
		beforeSend: function(xhr, opts){
			$('#loading').css('display', 'block');
			if(typeof formBeforeSend !== 'undefined' && formBeforeSend.length)
				executeFunctionByName(formBeforeSend, window, xhr, opts, $form);
		},
		success: function(request) {
			$('#loading').css('display', 'none');
			if(typeof formSuccess !== 'undefined' && formSuccess.length)
				executeFunctionByName(formSuccess, window, request, $form);
		},
		error: function(err){
			if(typeof formError !== 'undefined' && formError.length)
				executeFunctionByName(formError, window, request, $form);
			$('#loading').css('display', 'none');
			$('#errorAjax').css('display', 'block');
		}
	});
});

function updateDataLineItem($lineItem, dataObj){
	var $params = $lineItem.find('[data-name]');

	$params.each(function(){
		var $this = $(this),
			dName = $this.attr('data-name');
		if(typeof dataObj[dName] !== 'undefined'){
			$this.text(dataObj[dName]);
			$this.attr('data-val', dataObj[dName]);	
		}
	});
}

//Form callbacks
function removeLineItem(request, $form){
	$form.closest('.d-line-item').remove();
}
function clientAdded(request, $form){
	var $tbody = $('.usersTable').find('tbody');

	$tbody.append( $( templates.newClient()(request[0]) ) );	
}
function clientEdited(request, $form){
	var lineId = $form.closest('.editPopup').attr('data-line-id'),
		$updateLine = $('.d-line-item#'+ lineId);

	updateDataLineItem($updateLine, request);
	Dialog.hide();
}
function addProdToSalesList(xhr, opts, $form){
	ajaxStop(xhr);
	
	var formData = getFormData($form),
		prodLineItem = templates.productListItem()(formData),
		chunkSummCheck = +$('#salingsValueCheck').text(),
		$checkList = $('#checkList');
	
	//Add form
	$form.find(':focus').blur();
	$form.find('[type="text"]').val('');
	Validator.removeAllErrorClasses($form);
	$('#searchProd').focus();
	
	//Render check list
	$checkList.find('tbody').append(prodLineItem);
	$('#salingsValueCheck').text(floorN(chunkSummCheck+ (+formData.amount), 2));
	$checkList.slideDown();
}
function prodEditCheck(xhr, opts, $form){
	ajaxStop(xhr);
	
	var lineId = $form.closest('.editPopup').attr('data-line-id'),
		$updateLine = $('.d-line-item#'+ lineId),
		$closestSalesValue = $updateLine.closest('#checkList').find('#salingsValueCheck');

	var prevQty = +$form.find('[name="qty"]').attr('data-prev-val'),
		newQty = +$form.find('[name="qty"]').val(),
		price = +$form.find('[name="price"]').val(),
		amount = newQty*price,
		salesValue = +$closestSalesValue.text(),
		data = {
			qty: newQty,
			amount: amount
		};

	$closestSalesValue.text(salesValue + ( (newQty-prevQty) * price));
	updateDataLineItem($updateLine, data);

	Dialog.hide();

	console.log('Edit prod');
}


//Inits
Dialog.init();
Validator.init();

	

//Ajax loader
// var loader = {
// 	loaderSelector: '#loading',
// 	errorSelector: '#errorAjax',
// 	getPos: function (e){
// 		e.preventDefault();
// 		var yPosLoad = e.pageY+7,
// 			xPosLoad = e.pageX+7;
// 		$loadingItem.css({'top' : yPosLoad+7, 'left' : xPosLoad+7, 'display' : 'block'});
// 	},
// 	on: function(){
// 		var obj = this;
// 		$(window).on('mousemove', function(e){
// 			obj.getPos.apply(obj, e);
// 		});
// 	},
// 	off: function(){
// 		$(window).unbind('mousemove');
// 	}
// }
