(function( $, undefined ) {
	"use strict"
	$(document).ready(function(){
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
			if(selectedAttr == 'available'){
				$('#searchResults').css('display', 'none');
				var	searchChosenTitle = $('#searchResults .selected .searchProdNAme').text(),
					searchChosenPrice = $('#searchResults .selected').attr('price'),
					searchChosenMaxQty = $('#searchResults .selected').attr('maxQty');
				$('#searchProd').val(searchChosenTitle).attr('maxQty', searchChosenMaxQty);
				$('#searchProdPrice').val(searchChosenPrice);
				$('#searchProdQty, #searchProdSumm').val('');
				$('#searchProdQty').focus();
				$('#searchResults ul li').removeClass('selected');
				$('#modalWindow').css('display', 'none');
				searchItem = 0;
			}
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
									$('#searchResults ul').append('<li price='+request[i].price+' id="exist">'+request[i].title+'</li>');
								}
								else{
									$('#searchResults ul').append('<li price='+request[i].price+' maxQty='+floorN(request[i].qty, 2)+' id="available"><span class="searchProdNAme">'+request[i].title+'</span><span class="searchCount">'+floorN(request[i].qty, 2)+'</span></li>');
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

		//Search
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

		//Add to check list
		$('#searchProdQty').on('keyup', function(e){
			if(e.keyCode == 13){
				var data = {};
				data.titleSold = $('#searchProd').val();
				data.qtySold = $('#searchProdQty').val();
				data.priceSold = $('#searchProdPrice').val();

				addSaleList(data, 'checkList', false);
			}
			//Summ searcheed prod
			else{
				var	saleProdQty = $('#searchProdQty').val(),
					saleProdPrice = $('#searchProdPrice').val();
				if(regexpFloatNumber.test(saleProdQty)){
					var saleSumm = floorN(saleProdQty*saleProdPrice, 2);
					$('#searchProdSumm').val(saleSumm);
					fadeoutErrMsgs();
				}
			}
		});
		$('#btnAddList').on('click', function(e){
			e.preventDefault();
			var data = {};
			data.titleSold = $('#searchProd').val();
			data.qtySold = $('#searchProdQty').val();
			data.priceSold = $('#searchProdPrice').val();

			addSaleList(data, 'checkList', false);
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

	});
})(jQuery);