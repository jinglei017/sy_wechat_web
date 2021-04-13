$(function(){
    // 获取当前位置
    getLocationFun();
	var logininf =  JSON.parse(localStorage.getItem("logininf"));
	var pagenum = 1;
	var totalNum = 0;
	function p(s) {
	    return s < 10 ? '0' + s: s;
	}
	var myDate = new Date();
	//获取当前年
	var year=myDate.getFullYear();
	//获取当前月
	var month=myDate.getMonth()+1;
	//获取当前日
	var date = myDate.getDate();
	var date1 = myDate.getDate() - 1;
	var h=myDate.getHours();       //获取当前小时数(0-23)
	var m=myDate.getMinutes();     //获取当前分钟数(0-59)
	var s=myDate.getSeconds();
	var todayTime = year+'-'+p(month)+'-'+p(date);
	var yeTime =  year+'-'+p(month);

	function GetQueryString(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  decodeURIComponent(r[2]); return null;
	}
	var activeDate = localStorage.getItem("activeData");
	var orderstate = GetQueryString("orderstate");
	var partycode = GetQueryString("partycode");
	var timeType = GetQueryString("timeType");

	var stopartyCode = "";
	if(partycode == null || partycode == "" || partycode == "null"){
		//alert(1);
		stopartyCode = "";
	}else{
		stopartyCode = partycode;
	}

	if(activeDate == undefined || activeDate == null || activeDate == "" || activeDate == "null" || activeDate == "undefined"){
		var startShpTime = yeTime+"-01 00:00:00"
		var endTime = todayTime+" 23:59:59"

	}else{
		var startShpTime = activeDate + " 00:00:00"
		var endTime = activeDate + " 23:59:59"
	}

	var pageInf = {
		umTenantId: logininf.umTenantId,
        startCompleteTime: startShpTime,
        endCompleteTime: endTime,
		"pageInfo": {
			pageNum: pagenum,
			pageSize: 30
		}
	};

	var houseOrderInfo = {};

	var tabnum = 0;

	if(orderstate == 0){
		var ua = window.navigator.userAgent.toLowerCase();
		/*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			$(".header").show();
			$(".orderList").css({
				"marginTop":"0.88rem"
			})
			$(".orderList .listTitle").css({
				"top":"0.88rem"
			})
		}*/
		pageInf = {
			umTenantId: logininf.umTenantId,
			isOrderInd:"TRUE",
            startCompleteTime: startShpTime,
       		endCompleteTime: endTime,
            sfrPartyCode:stopartyCode,
            orderType:'DO',
			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};

		houseOrderInfo = {
			umTenantId: logininf.umTenantId,
            startCompleteTime: startShpTime,
       		endCompleteTime: endTime,
            sfrPartyCode:stopartyCode,
            orderInd:"house",
			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};

		$(".header .txt").html("全部订单");
		$("title").html("全部订单");
		$(".header .right").show();
		masterOrderList()
	}else if(orderstate == 1){
		pageInf = {
			umTenantId: logininf.umTenantId,
            startCompleteTime: startShpTime,
        	endCompleteTime: endTime,
            sfrPartyCode:stopartyCode,
			completeStatus:"1",
			isNoException:true,
			orderType:'DO',
			isOrderInd:"TRUE",
			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};

		houseOrderInfo = {
			umTenantId: logininf.umTenantId,
            startCompleteTime: startShpTime,
        	endCompleteTime: endTime,
            sfrPartyCode:stopartyCode,
			completeStatus:"1",
			isNoException:true,
			orderInd:"house",
			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};

		$(".header .txt").html("完成订单");
		$("title").html("完成订单");
		masterOrderList()
	}else if(orderstate == 2){
		pageInf = {
			umTenantId: logininf.umTenantId,
            startCompleteTime: startShpTime,
       		endCompleteTime: endTime,
            sfrPartyCode:stopartyCode,
			isTransit:true,
			isNoException:true,
			orderType:'DO',
			isOrderInd:"TRUE",
			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};

		houseOrderInfo = {
			umTenantId: logininf.umTenantId,
            startCompleteTime: startShpTime,
       		endCompleteTime: endTime,
            sfrPartyCode:stopartyCode,
			isTransit:true,
			isNoException:true,
			orderInd:"house",
			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};
		$(".header .txt").html("在途订单");
		$("title").html("在途订单");
		masterOrderList()
	}else if(orderstate == 3){
		pageInf = {
			umTenantId: logininf.umTenantId,
			startCompleteTime: startShpTime,
        	endCompleteTime: endTime,
			sfrPartyCode:stopartyCode,
			//actCode:"EXCP",
			isException:true,
			isOrderInd:"TRUE",
			orderType:'DO',
			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};

		houseOrderInfo = {
			umTenantId: logininf.umTenantId,
			startCompleteTime: startShpTime,
        	endCompleteTime: endTime,
			sfrPartyCode:stopartyCode,
			//actCode:"EXCP",
			isException:true,
			orderInd:"house",
			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};
		$(".header .txt").html("异常订单");
		$("title").html("异常订单");
		masterOrderList()
	}

	$(".header .right").click(function(){
		$(".searchLayer").show();
		$(".searchCon ul li .orderNo").val("")
		$(".searchCon ul li .trackingNo").val("")
		$(".searchCon ul li .statusSelect").val("")
	})

	$(".orderList").scroll(function(){
		var scrollNum = document.documentElement.clientWidth / 7.5;
        if($(".orderList .listCon").outerHeight() - $(".orderList").scrollTop() - $(".orderList").height() < 10){
            if($(".ajax-loder-wrap").length > 0){
                return false;
            }
			if(pagenum < totalNum){
				pagenum = parseInt(pagenum) + parseInt(1)
				pageInf.pageInfo.pageNum = pagenum;
				masterOrderList()
			}
		}
	})


	function masterOrderList(){
		$.ajax({
			url: omsUrl + '/provider/query/selectOrderInfoPage?token=' + logininf.token + '&timeStamp=' + logininf.timeStamp,
			type: "post",
			contentType: 'application/json',
			data: JSON.stringify(pageInf),
			beforeSend:function(){
	           $(".orderList").append('<div class="ajax-loder-wrap"><img src="../images/ajax-loader.gif" class="ajax-loader-gif"/><p class="loading-text">加载中...</p></div>');
			},
			success: function(data) {
                totalNum = data.pageInfo.pages;
				var data = data.result;
				$(".ajax-loder-wrap").remove();
				var orderstatClass = "doneli"
				var masterListItem = "";
				var isComponent = 0;
				if(data.length == 0){
					var timer1 = setTimeout(function(){
						$(".orderList").append('<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;">'+
											'<img src="images/noContent.png" alt=""  style="width: 3rem; height: auto; display: block;"/>'+
									'</p>');
					},600)
				}else{
					for(var i = 0 ; i < data.length;i++){
						var isComplete = "未完成";
						var isCompleteClass = "notcomplate"
						if(data[i].houseCompleteCount == data[i].houseOrderCount){
							isComplete = "已完成"
							isCompleteClass = "complate"
						}
						if(data[i].orderInd == "master"){
							masterListItem += '<div class="masterItem orderItem" orderno="'+data[i].trackingNo+'">'+
												'<ul class="masterTitle">'+
													'<li class="first">+</li>'+
													'<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span></li>'+
													'<li class="'+isCompleteClass+'">'+data[i].houseCompleteCount+'/'+data[i].houseOrderCount+'</li>'+
													'<li class="'+isCompleteClass+'">'+isComplete+'</li>'+
												'</ul>'+
												'<div class="masterListCon"></div>'+
											'</div>'
						}else{
							if(orderstate == 3 || data[i].exceptionStatus == "1" || data[i].exceptionStatus == "2"){
								orderstatClass = "abnormaldoneli";
							}else{
								orderstatClass = "doneli"
							}
							if(data[i].actCode == "INIT" || data[i].actCode == "RECV" || data[i].actCode == "SEND" || data[i].actCode == "DIST"){
								// RECV接收     初始化INIT
								masterListItem += '<ul class="listItem orderItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
													'<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span><input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
													'<li class="notdone"></li>'+
													'<li class="notdone"></li>'+
													'<li class="notdone"></li>'+
													'<li class="getLocationLi"><img src="images/location.png" alt="" /></li>'+
												'</ul>'
							}else if(data[i].actCode == "SENT" || data[i].actCode == "DCHT"  || data[i].actCode == "COFM"){
								//装车LONT    卸车 DCHT   SENT发出
								console.log(data[i]);
								masterListItem += '<ul class="listItem orderItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
													'<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span><input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
													'<li class="'+orderstatClass+'"></li>'+
													'<li class="notdone"></li>'+
													'<li class="notdone"></li>'+
													'<li class="getLocationLi"><img src="images/location.png" alt="" /></li>'+
												'</ul>'
							}else if(data[i].actCode == "EXCP" || data[i].actCode == "RJCT" ||  data[i].actCode == "LONT" ){
								//  拒收 RJCT    异常 EXCP
								masterListItem += '<ul class="listItem orderItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
													'<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span><input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
													'<li class="'+orderstatClass+'"></li>'+
													'<li class="'+orderstatClass+'"></li>'+
													'<li class="notdone"></li>'+
													'<li class="getLocationLi"><img src="images/location.png" alt="" /></li>'+
												'</ul>'
							}else if(data[i].actCode == "ACPT" || data[i].actCode == "DONE"){
								//签收ACPT   完成 DONE
								masterListItem += '<ul class="listItem orderItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
													'<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span><input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
													'<li class="'+orderstatClass+'"></li>'+
													'<li class="'+orderstatClass+'"></li>'+
													'<li class="'+orderstatClass+'"></li>'+
													'<li class="getLocationLi"><img src="images/location.png" alt="" /></li>'+
												'</ul>'
							}

						}
					}
					//console.log(masterListItem);
					$(".orderList .listCon").append(masterListItem);
				}
			}
		})
	}

	$(".orderList .listCon").on("click",".masterItem .masterTitle",function(){
		var orderno = $(this).parents(".masterItem").attr("orderno");
		houseOrderInfo.trackingNo = orderno;
		orderListFun(houseOrderInfo,$(this).parents(".masterItem").index());
		$(this).siblings(".masterListCon").toggle();
		if($(this).children(".first").html() == "+"){
			$(this).children(".first").html("-");
		}else{
			$(this).children(".first").html("+");
		}
	})

	//输入搜索条件查询
	$(".searchCon .searchbtn").click(function(){
		pagenum = 1;
		totalNum = 1;
		pageInf.pageInfo.pageNum = 1;
		$(".orderList .listCon").html("");
		$(".noContent").remove();
		$(".searchLayer").hide();
		console.log($("#startTime").val());
		var startShpTime = $("#startTime").val().trim();
		var endShpTime = $("#endTime").val().trim();
		if(startShpTime == "" || startShpTime == "null" || startShpTime == null){

		}else{
			pageInf.startCompleteTime = startShpTime + " 00:00:00"
		}

		if(endShpTime == "" || endShpTime == "null" || endShpTime == null){

		}else{
			pageInf.endCompleteTime = endShpTime + " 23:59:59"
		}
		masterOrderList();
	})

	//var tasklistData = "";
	function orderListFun(orderListData,index) {
		console.log(index);
		$.ajax({
			url: omsUrl + '/provider/query/selectHouseOrderInfo?token=' + logininf.token + '&timeStamp=' + logininf.timeStamp,
			type: "post",
			contentType: 'application/json',
			data: JSON.stringify(orderListData),
			success: function(data) {
				console.log(data.result);
				var data = data.result;
				var orderstatitem = "";
				var isComponent = 0;
				//tasklistData = data;
				var orderstatClass = "doneli"
				for(var i = 0; i < data.length;i++){
					if(orderstate == 3 || data[i].exceptionStatus == "1" || data[i].exceptionStatus == "2"){
						orderstatClass = "abnormaldoneli";
					}else{
						orderstatClass = "doneli"
					}
					if(data[i].trackingNo == null || data[i].trackingNo == "null"){
						data[i].trackingNo = "-"
					}

					if(data[i].completeStatus == "1"){
						isComponent = 1;
					}else{
						isComponent = 0;
					}
					//RECV 接收      COFM 确认      SENT 已发出      RJCT 拒收      ACPT 验收   DCHT 卸车     LONT 装车    SEND 发送     DONE 完成   INIT 初始化  EXCP 异常
					if(data[i].actCode == "INIT" || data[i].actCode == "RECV" || data[i].actCode == "SEND" || data[i].actCode == "DIST"){
						// RECV接收     初始化INIT
						orderstatitem += '<ul class="listItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
											'<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span><input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
											'<li class="notdone"></li>'+
											'<li class="notdone"></li>'+
											'<li class="notdone"></li>'+
											'<li class="getLocationLi"><img src="images/location.png" alt="" /></li>'+
										'</ul>'
					}else if(data[i].actCode == "SENT" || data[i].actCode == "DCHT"  || data[i].actCode == "COFM"){
						//装车LONT    卸车 DCHT   SENT发出
						console.log(data[i]);
						orderstatitem += '<ul class="listItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
											'<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span><input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
											'<li class="'+orderstatClass+'"></li>'+
											'<li class="notdone"></li>'+
											'<li class="notdone"></li>'+
											'<li class="getLocationLi"><img src="images/location.png" alt="" /></li>'+
										'</ul>'
					}else if(data[i].actCode == "EXCP" || data[i].actCode == "RJCT" ||  data[i].actCode == "LONT" ){
						//  拒收 RJCT    异常 EXCP
						orderstatitem += '<ul class="listItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
											'<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span><input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
											'<li class="'+orderstatClass+'"></li>'+
											'<li class="'+orderstatClass+'"></li>'+
											'<li class="notdone"></li>'+
											'<li class="getLocationLi"><img src="images/location.png" alt="" /></li>'+
										'</ul>'
					}else if(data[i].actCode == "ACPT" || data[i].actCode == "DONE"){
						//签收ACPT   完成 DONE
						orderstatitem += '<ul class="listItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
											'<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span><input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
											'<li class="'+orderstatClass+'"></li>'+
											'<li class="'+orderstatClass+'"></li>'+
											'<li class="'+orderstatClass+'"></li>'+
											'<li class="getLocationLi"><img src="images/location.png" alt="" /></li>'+
										'</ul>'
					}
				}
				$(".orderItem").eq(index).children(".masterListCon").html(orderstatitem);
			},
			error: function(xhr) {
				// markmsg("不存在此账户");
			}
		})
	}

	$(".closeorderinf").click(function(){
		$(".maskLayer").hide();
		$(".maskLayer .popup").hide();
		$(".maskLayer .popup5").hide();
	})


	$(".popup6 .popupTitle a").click(function(){
		$(".maskLayer").hide();
		$(".maskLayer .popup6").hide();
	})

	var seeOrderDetailId = "";

	$(".orderList .listCon").on("click",".listItem",function(){
		var orderid = $(this).attr("orderId");
		var orderStatus = $(this).attr("orderStatus");
		var orderInd = $(this).attr("orderInd");
		if(orderInd == "master"){
			location.href = "orderInfo1.html?orderid="+orderid+"&orderStatus="+orderStatus;
		}else{
			location.href = "orderInfo.html?orderid="+orderid+"&orderStatus="+orderStatus;
		}
	})


	$(".orderList .listCon").on("click",".listItem .getLocationLi",function(e){
		e.stopPropagation();
		e.preventDefault();
		var itemOrderId = $(this).parents(".listItem").attr("orderid");
		var sendaddress =  $(this).parents(".listItem").find(".sendaddress").val();
		var orderInd = $(this).parents(".listItem").attr("orderInd");
		localStorage.setItem("itemOrderId",itemOrderId);
		console.log(sendaddress);
		if(orderInd == "master"){
			loadData("show","请到订单详细页查看物流信息",true)
		}else{
			location.href = "map.html"
		}
	})
})
