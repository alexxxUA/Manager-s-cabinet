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

var titleError = $('#rightSide .prodTable tr td');
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

	curDay = (curMonth<=9? '0'+curMonth : curMonth)+'/'+(curDate<=9? '0'+curDate : curDate)+'/'+curYear;
	//Time in miliseconds
	mSeconds = d.getTime();
	//Time zone
	timeZone = -d.getTimezoneOffset()/60;
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
	Dialog.showModal();
});

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
	$('#searchProdPrice').val(floorN(searchChosenPrice, 2));
	$('#searchProdUnit').val(searchChosenUnit);
	$('#searchProdId').val(searchChosenId);
	$('#searchProdQty, #searchProdSumm').val('');
	$('#searchProdMaxQty').val(searchChosenMaxQty);
	$('#searchProdQty').attr('data-max-qty', searchChosenMaxQty);
	$('#searchResults ul li').removeClass('selected');
	Dialog.hideModal();
	searchItem = 0;
	setTimeout(function(){
		$('#searchProdQty').focus();
	}, 100);
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
				$('#searchResults').find('li').remove();
				if(request.length !== 0){
					Dialog.showModal();
					$('#searchResults').css('display', 'block');
					var i=0,
						searchViewedCount = 15;
					while(i < request.length && i < searchViewedCount){
						if(+request[i].qty <= 0){
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
	Dialog.showModal();
});

//Clear sales list !DATABASE
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
//Available units
var units = ['шт', 'кг', 'л', 'м'];

//Clear table
function clearTable($context){
	$context.find('tbody tr:not(.tableAmount)').remove();
	$context.find('.totalAmount').text('0.00');
}
//Get sring format for DATE
function getFormatedDate(milisec){
	var d = new Date(milisec),
		curDate = d.getDate(),
		curMonth = d.getMonth()+1,
		curYear = d.getFullYear();
		
	return (curMonth<=9? '0'+curMonth : curMonth)+'/'+(curDate<=9? '0'+curDate : curDate)+'/'+curYear;
}

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
function getFormData($context){
	var data = {};
	$context.find('[name]').each(function(){
		var $this = $(this),
			elVal = $this.val();

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
	modalBg: '.modal',
	modalActiveClass: 'active',
	dialogCont: '.dialogs-container',
	dialogSelector: '.dialog',
	dialogStaticSelector: '.static',
	closeBtn: '.closeBtn',
	dialogDataLink: '.dialogData',
	init: function(){
		var obj = this;
		$(document).delegate(obj.dialogDataLink, 'click', $.proxy(obj, 'loadDialog'));
		$(document).delegate(obj.modalBg, 'click', $.proxy(obj, 'hide'));
		$(document).delegate(obj.closeBtn, 'click', $.proxy(obj, 'hide'));
	},
	getAttrData: function($context){
		var $params = $context.find('[data-name]'),
			data = {};

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
			$editLine = $this.closest('.d-line-item'),
			templateName = $this.attr('dialog-template'),
			lineId = $editLine.attr('id'),
			data = this.getAttrData($editLine);

		data.lineId = lineId;
		
		this.show(templates[templateName](data), e);		
	},
	show: function(dialog, event){
		var $dialog = $(dialog),
			offsetTop = window.scrollY,
			screenHeight = window.innerHeight,
			styles = {};
		
		$dialog.css({'visibility': 'hidden', 'top': 0, 'left': 0});
		this.showModal();
		$(this.dialogCont).append($dialog);
		
		
		var dialogWidth = $dialog.outerWidth(),
			dialogHeight = $dialog.outerHeight();		
		
		if(event){
			styles.top = event.pageY-15;
			styles.left = event.pageX - dialogWidth;
		}
		else{
			styles.top = ((screenHeight-dialogHeight)/2)+offsetTop;
			styles.left = '50%';
			styles['margin-left'] = -$dialog.width()/2;		
		}
		styles.visibility = 'visible';
		styles.display = 'block';
		
		$dialog.css(styles);		
	},
	hide: function(){
		this.hideModal();
		//Hide dialogs
		$(this.dialogCont).find(this.dialogSelector).hide();
		
		//Remove static dialogs
		$(this.dialogCont).find(this.dialogSelector).not(this.dialogStaticSelector).remove();

	},
	showModal: function(){
		$(this.modalBg).addClass(this.modalActiveClass);
	},
	hideModal: function(){
		$(this.modalBg).removeClass(this.modalActiveClass);
	}
}

var Validator = {
	fieldClass: 'ws-field',
	errorClass: 'data-error',
	errorMessageClass: 'error-message',
	errorMessageTemplate: _.template('<div class="<%= errorMessageClass %>"><div class="arrow"></div><div class="error-message-content"><%= error %></div></div>'),
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
		notEmpty: /\S+/,
		email: /^\b[0-9A-Z_\.]+@[0-9A-Z]+\.[A-Z]{2,4}\b$/i
	},
	valRules: {
		availQty: function(e, data, obj){
			return (obj.valRegExps.floatNumb).test(data.checkValue) && +data.checkValue <= data.availQty ? true : false;
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
	errorMessages:{
		numb: _.template('Значення повинне бути цілим числом.'),
		floatNumb: _.template('Значення повинне бути числом.'),
		notEmpty: _.template('Поле є обов‘язковим для заповнення.'),
		email: _.template('Email повинен бути в форматі: aaa@aaa.aa .'),
		availQty: _.template('Доступна кількість: <span class="availableQty"><%= availQty %></span>'),
		ifAdded: _.template('Товар вже додано до чеку.'),
		attrVal: _.template('Виберіть будь-ласка товар з пошукового результату.')
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
			};
			
		obj.hideAllErrors(e);

		if(data.validatorType.length){
			for(var i=0; i < data.validatorType.length; i++){
				var isValid = true;
				
				if(typeof obj.valRegExps[data.validatorType[i]] !== 'undefined'){
					if((obj.valRegExps[data.validatorType[i]]).test(data.checkValue))
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
				
				if(isValid == false){
					obj.showError(e, data, data.validatorType[i]);
					obj.showBaseError(e);
					break;
				}
			}
		}			
	},
	showErrorMessage: function(e, data, validatorType){
		var targetWidth = $(e.currentTarget).outerWidth(),
			$closestField = $(e.currentTarget).closest('.'+ this.fieldClass),
			message = this.errorMessages[validatorType](data),
			$message = $(this.errorMessageTemplate({errorMessageClass: this.errorMessageClass, error: message}));
		
		$message.css({'max-width': targetWidth});
		$closestField.append($message);
		$message.css({bottom: -$message.outerHeight(), visibility: 'visible'});
	},
	showBaseError: function(e){
		var $this = $(e.currentTarget);
		$this.closest('.'+ this.fieldClass).addClass(this.errorClass);
	},
	hideBaseError: function(e){
		var $this = $(e.currentTarget);
		$this.closest('.'+ this.fieldClass).removeClass(this.errorClass);
	},
	showError: function(e, data, validatorType){
		var $this = $(e.currentTarget);
		$this.closest('.'+ this.fieldClass).addClass(this.errorClass +'-'+validatorType);
		this.showErrorMessage(e, data, validatorType);
	},
	hideAllErrors: function(e){
		var $this = $(e.currentTarget),
			$closestField = $this.closest('.'+ this.fieldClass);
		$closestField.removeClass(function(index, css){
			return ( css.match(/data-error.*[!' ']/g) || []).join(' ');
		});
		$closestField.find('.'+ this.errorMessageClass).remove();
		this.hideBaseError(e);
	},
	removeAllErrorClasses: function($context){
		$context.find(':regex(class, data-error.*)').removeClass(function(index, css){
			return ( css.match(/data-error.*[!' ']/g) || []).join(' ');
		});
	}
}

//Ajax form submit abort
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

	$tbody.append( $( templates.newClient(request[0]) ) );	
}
function dialogEdited(request, $form){
	var lineId = $form.closest('.editPopup').attr('data-line-id'),
		$updateLine = $('.d-line-item#'+ lineId);

	updateDataLineItem($updateLine, setFlorNumbers(request));
	Dialog.hide();
}
function prodAdded(request, $form){
	var $prodTable = $('.prodTable');

	if(request.error && request.error.length > 0){
		//Error.show(request.error);
	}else{
		$form.find('.ws-field input').val('');
		request.amount = request.price*request.qty;
		$prodTable.prepend( templates.addedProductListItem( setFlorNumbers(request) ) );
	}
}
function prodEdited(request, $form){
	var data = request;
	
	//Set amount into base prod object data
	data.amount = data.qty*data.price;
	
	//Update base fields in form
	dialogEdited( setFlorNumbers(data), $form);	
}

function setFlorNumbers(object){
	var roundNames = 'qty price amount totalAmount';

	for(var key in object){
		var regExp = new RegExp(key, 'i');

		if(regExp.test(roundNames))
			object[key] = floorN(object[key], 2);
	}

	return object;
}
function addProdToSalesList(xhr, opts, $form){
	ajaxStop(xhr);
	
	var formData = getFormData($form),
		prodLineItem = templates.productListItem(formData),
		$checkList = $('#checkList'),
		$checkListAmount = $checkList.find('.totalAmount'),
		checkListAmountVal = +$checkListAmount.text(),
		$formClienField = $form.find('[name="clientId"]'),
		$clientField = $checkList.find('[data-name="clientId"]');
	
	//Reset 'Add form'
	$form.find(':focus').blur();
	$form.find('[type="text"]').val('');
	Validator.removeAllErrorClasses($form);
	$formClienField.attr('disabled', 'disabled');
	
	//Render check list
	$checkList.find('tbody').prepend(prodLineItem);
	$checkListAmount.text(floorN(checkListAmountVal+ (+formData.amount), 2));
	$checkList.slideDown();
	
	//Cliend name and ID
	$clientField.text(formData.clientFullName).attr('data-val', formData.clientId).show();	
}
function prodEditCheck(xhr, opts, $form){
	ajaxStop(xhr);
	
	var lineId = $form.closest('.editPopup').attr('data-line-id'),
		$updateLine = $('.d-line-item#'+ lineId),
		$closestSalesValue = $updateLine.closest('table').find('.totalAmount');

	var prevQty = +$form.find('[name="qty"]').attr('data-prev-val'),
		newQty = +$form.find('[name="qty"]').val(),
		price = +$form.find('[name="price"]').val(),
		amount = newQty*price,
		salesValue = +$closestSalesValue.text(),
		data = {
			qty: newQty,
			amount: amount
		};
	//Set total amount
	$closestSalesValue.text( floorN( salesValue + ((newQty-prevQty) * price), 2));
	//Update lineItem
	updateDataLineItem($updateLine, setFlorNumbers(data));

	Dialog.hide();
}
function saleCheck(e){
	var $this = $(e.currentTarget),
		$dCheckList = $('#checkList'),
		$soldCheckList = $('.soldCheckList'),
		$soldCheckListTotalAmount = $soldCheckList.find('.totalAmount'),
		$saleForm = $('.saleForm'),
		$saleFormClient = $saleForm.find('[name="clientId"]'),
		action = $this.attr('action'),
		formData = {
			clientId: '',
			clientFullName: '',
			prodList: []
		},
		clientId = $this.find('[data-name="clientId"]').attr('data-val'),
		clientFullName = $this.find('[data-name="clientId"]').text();
	
	//Collect data	
	formData.clientId = clientId;
	formData.clientFullName = clientFullName;	
	$this.find('table .d-line-item').each(function(){
		formData.prodList.push(Dialog.getAttrData($(this)));
	});
	
	$.ajax({
		url: action,
		data: formData,
		success: function(request){
			var data = request[0],
				tableTotalAmount = +$soldCheckListTotalAmount.text();
			
			data.dateString = getFormatedDate(data.date);
			
			//Configure other DOM el.
			$saleFormClient.removeAttr('disabled');
			$dCheckList.hide();
			clearTable($dCheckList);
			
			//Render sold check list
			$soldCheckList.find('tbody').prepend(templates.checkItem(setFlorNumbers(data)));
			$soldCheckListTotalAmount.text( floorN(tableTotalAmount + data.totalAmount,2) );			
		},
		error: function(err){
			
		}
	});
}

function populateCheckDialog(request, $form){	
	var checkList = templates.dialog({templateContent: request});
	Dialog.show(checkList);
}

function renderReport(request, $form){
	var $resContainer = $('.reportResults');
	
	$resContainer.html(request.html);
	
	if(request.callback && request.salesList && request.salesList.length > 0 && request.callback.length > 0)
		executeFunctionByName(request.callback, window, request, $resContainer);
}

function salesStatistic(request, $resContainer){
	var salesList = request.salesList,
		plotData = {
			data: [
				[salesList[0].date, salesList[0].totalAmount, getFormatedDate(salesList[0].date)]
			]
		},
		plotConf = {
			series: {
				lines:{ 
					show: true,
					lineWidth: 3
				},
				points:{
					show: true
				},
				label: 'Графік прибутку по даті'
			},
			xaxis:{
				color: '#FFF',
				mode: "time",
				minTickSize: [1, "day"],
				timeformat: "%m/%d/%Y",
			},
			yaxis:{
				color: '#FFF'
			}
		},
		curCheck = 0;
	
	for(var i=1; i<salesList.length; i++){
		if(getFormatedDate(plotData.data[curCheck][0]) == getFormatedDate(salesList[i].date)){
			plotData.data[curCheck][1] += salesList[i].totalAmount;
		}
		else{
			plotData.data.push( [ salesList[i].date, salesList[i].totalAmount, getFormatedDate(salesList[i].date)] );
			curCheck++;
		}	
	}
	
	$.plot($(".salesGraph"), [plotData], plotConf);
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


/*-------------------------------------------------------*/
/*-------------------- DELEGATES ------------------------*/
/*-------------------------------------------------------*/

//Set full name into sibling hidden input
$(document).delegate('[name="clientId"]', 'change', function(){
	var $this = $(this),
		fullName= $this.find(':selected').text(),
		$siblingsFullName = $this.siblings('[name="clientFullName"]');
	
	$siblingsFullName.val(fullName);
});

$(document).delegate('.checkForm', 'submit', function(e){
	e.preventDefault();
	saleCheck(e);
});

$(document).delegate('.delCheckListItem', 'click', function(e){
	var $this = $(e.currentTarget),
		tableItemsLength = $this.closest('table').find('.d-line-item').length,
		$lineItem = $this.closest('.d-line-item'),
		$checkListCont = $('#checkList');
	
	$lineItem.remove();
	if(tableItemsLength <= 1){
		$('.sClienList select').removeAttr('disabled');
		$checkListCont.slideUp();
		$checkListCont.find('.totalAmount').html('');
	}		
});

//Clear DOM element
$(document).delegate('.clearDomElement', 'click', function(e){
	var $this = $(this),
		sourceSelector = $this.attr('data-clear-selector'),
		$sourceEl = $(sourceSelector);
	
	$sourceEl.html('');
});