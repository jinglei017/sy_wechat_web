$(function(){
    // 获取当前位置
    getLocationFun();
	var logininf =  JSON.parse(localStorage.getItem("logininf"));
	/* 微信中不隐去.header */
	var ua = window.navigator.userAgent.toLowerCase();
	/*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		$(".header").show();
		$(".orderList .listTitle").css({
			"top":"0.88rem"
		})
	}*/
	var pagenum = 1;
	var pagenum1 = 1;
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
	var yeTime =  year+'-'+p(month)+'-'+p(date1);

	var pageInf = {
		umTenantId: logininf.umTenantId,
        startCompleteTime:todayTime+" 00:00:00",
		endCompleteTime:todayTime+" 23:59:59",
		"pageInfo": {
			pageNum: pagenum,
			pageSize: 30
		}
	};
	var houseOrderInfo = {};

	var tabnum = 0;

	function GetQueryString(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
	var orderstate = GetQueryString("orderstate");
    var roleId = localStorage.getItem("roleId");
    var orderType = "";
    if(roleId == '0'){
        orderType = "TO"
    } else{
        orderType = "DO"
    }

	if(orderstate == 0){
		pageInf = {
			customerOriginalNo:"",
			exceptionStatus:"",
			completeStatus:"",
			umTenantId: logininf.umTenantId,
            startCompleteTime:todayTime+" 00:00:00",
            endCompleteTime:todayTime+" 23:59:59",
			isOrderInd:"TRUE",
			orderType:orderType,
			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};
		houseOrderInfo = {
			umTenantId: logininf.umTenantId,
            startCompleteTime:todayTime+" 00:00:00",
            endCompleteTime:todayTime+" 23:59:59",
			orderInd:"house",
			"pageInfo": {
				pageNum: pagenum1,
				pageSize: 30
			}
		}

		$(".header .txt").html("全部订单");
		$("title").html("全部订单");
		$(".header .right").show();
		masterOrderList()
	}else if(orderstate == 1){
		pageInf = {
			umTenantId: logininf.umTenantId,
            startCompleteTime:todayTime+" 00:00:00",
			endCompleteTime:todayTime+" 23:59:59",
			completeStatus:"1",
			isNoException:true,
			isOrderInd:"TRUE",
            orderType:orderType,

			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};

		houseOrderInfo = {
			umTenantId: logininf.umTenantId,
            startCompleteTime:todayTime+" 00:00:00",
			endCompleteTime:todayTime+" 23:59:59",
			completeStatus:"1",
			isNoException:true,
			orderInd:"house",
			"pageInfo": {
				pageNum: pagenum1,
				pageSize: 30
			}
		};

		$(".header .txt").html("完成订单");
		$("title").html("完成订单");
		masterOrderList()
	}else if(orderstate == 2){
		pageInf = {
			umTenantId: logininf.umTenantId,
            startCompleteTime:todayTime+" 00:00:00",
			endCompleteTime:todayTime+" 23:59:59",
			isTransit:true,
			isNoException:true,
			orderType:orderType,
			isOrderInd:"TRUE",
			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};
		houseOrderInfo = {
			umTenantId: logininf.umTenantId,
            startCompleteTime:todayTime+" 00:00:00",
			endCompleteTime:todayTime+" 23:59:59",
			isTransit:true,
			isNoException:true,
			orderInd:"house",
			"pageInfo": {
				pageNum: pagenum1,
				pageSize: 30
			}
		};
		$(".header .txt").html("在途订单");
		$("title").html("在途订单");
		masterOrderList()
	}else if(orderstate == 3){
		pageInf = {
			umTenantId: logininf.umTenantId,
            startCompleteTime:todayTime+" 00:00:00",
			endCompleteTime:todayTime+" 23:59:59",
			//actCode:"EXCP",
			isException:true,
			orderType:orderType,
			isOrderInd:"TRUE",
			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};
		houseOrderInfo = {
			umTenantId: logininf.umTenantId,
            startCompleteTime:todayTime+" 00:00:00",
			endCompleteTime:todayTime+" 23:59:59",
			isTransit:true,
			isNoException:true,
			orderInd:"house",
			"pageInfo": {
				pageNum: pagenum1,
				pageSize: 30
			}
		};
		$(".header .txt").html("异常订单");
		$("title").html("异常订单");
		masterOrderList()
	}else if(orderstate == 4){
		pageInf = {
			customerOriginalNo:"",
			exceptionStatus:"",
			completeStatus:"",
			umTenantId: logininf.umTenantId,
			startCreateTime: todayTime+" 00:00:00",
			endCreateTime: todayTime+" 23:59:59",
			isNoException:true,
			orderType:orderType,
			isOrderInd:"TRUE",
			"pageInfo": {
				pageNum: pagenum,
				pageSize: 30
			}
		};
		houseOrderInfo = {
			umTenantId: logininf.umTenantId,
			startCompleteTime:todayTime+" 00:00:00",
			endCompleteTime:todayTime+" 23:59:59",
			isTransit:true,
			isNoException:true,
			orderInd:"house",
			"pageInfo": {
				pageNum: pagenum1,
				pageSize: 30
			}
		};
		$(".header .txt").html("我的订单");
		$("title").html("我的订单");
        $(".header .right").show();
        $(".listTitle").append('<li style="width: 17%;text-align: center;">操作</li>');
        $(".orderList ul li:nth-of-type(1)").css("width","39%");
        $(".orderList ul li:nth-of-type(2),.orderList ul li:nth-of-type(3),.orderList ul li:nth-of-type(4),.orderList ul li:nth-of-type(5)").css("width","11%")
        masterOrderList1()
	}

	$(".header .right").click(function(){
		$(".searchLayer").toggle();
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
                if(orderstate == 4){
                    masterOrderList1();
                }else{
                    masterOrderList();
                }
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
				var orderstatClass = "doneli";
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
                                                    '<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span>' +
                                                        '<span class="associationNo">订单性质：'+changeItemType(data[i].orderNature,"orderNatureList")+'</span>' +
                                                        '<span class="associationNo">金额/币种：'+data[i].totalAmount+'/'+changeItemType(data[i].currency,"currencyList")+'</span>' +
                                                    '</li>'+
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
							if(data[i].actCode == "INIT" || data[i].actCode == "RECV" || data[i].actCode == "SEND" || data[i].actCode == "DIST" || data[i].actCode == "ACTIVE"){
								// RECV接收     初始化INIT
								masterListItem += '<ul class="listItem orderItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
													'<li>'+data[i].customerOriginalNo +
                                                        '<span class="associationNo">客户：'+data[i].stoPartyName+'</span>' +
                                                        '<span class="associationNo">订单性质：'+changeItemType(data[i].orderNature,"orderNatureList")+'</span>' +
                                                        '<span class="associationNo">金额/币种：'+data[i].totalAmount+'/'+changeItemType(data[i].currency,"currencyList")+'</span>' +
                                                        '<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" />' +
                                                        '<input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" />' +
                                                        '<input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" />' +
                                                    '</li>'+
													'<li class="notdone"></li>'+
													'<li class="notdone"></li>'+
													'<li class="notdone"></li>'+
													'<li class="getLocationLi"><img src="images/location.png" alt="" /></li>'+
												'</ul>'
							}else if(data[i].actCode == "SENT" || data[i].actCode == "DCHT"  || data[i].actCode == "COFM"){
								//装车LONT    卸车 DCHT   SENT发出
								masterListItem += '<ul class="listItem orderItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
													'<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span>' +
                                                        '<span class="associationNo">订单性质：'+changeItemType(data[i].orderNature,"orderNatureList")+'</span>' +
                                                        '<span class="associationNo">金额/币种：'+data[i].totalAmount+'/'+changeItemType(data[i].currency,"currencyList")+'</span>' +
                                                        '<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
													'<li class="'+orderstatClass+'"></li>'+
													'<li class="notdone"></li>'+
													'<li class="notdone"></li>'+
													'<li class="getLocationLi"><img src="images/location.png" alt="" /></li>'+
												'</ul>'
							}else if(data[i].actCode == "EXCP" || data[i].actCode == "RJCT" ||  data[i].actCode == "LONT" ){
								//  拒收 RJCT    异常 EXCP
								masterListItem += '<ul class="listItem orderItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
													'<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span>' +
                                                        '<span class="associationNo">订单性质：'+changeItemType(data[i].orderNature,"orderNatureList")+'</span>' +
                                                        '<span class="associationNo">金额/币种：'+data[i].totalAmount+'/'+changeItemType(data[i].currency,"currencyList")+'</span>' +
                                                        '<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
													'<li class="'+orderstatClass+'"></li>'+
													'<li class="'+orderstatClass+'"></li>'+
													'<li class="notdone"></li>'+
													'<li class="getLocationLi"><img src="images/location.png" alt="" /></li>'+
												'</ul>'
							}else if(data[i].actCode == "ACPT" || data[i].actCode == "DONE"){
								//签收ACPT   完成 DONE
								masterListItem += '<ul class="listItem orderItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
													'<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span>' +
                                                        '<span class="associationNo">订单性质：'+changeItemType(data[i].orderNature,"orderNatureList")+'</span>' +
                                                        '<span class="associationNo">金额/币种：'+data[i].totalAmount+'/'+changeItemType(data[i].currency,"currencyList")+'</span>' +
                                                        '<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
													'<li class="'+orderstatClass+'"></li>'+
													'<li class="'+orderstatClass+'"></li>'+
													'<li class="'+orderstatClass+'"></li>'+
													'<li class="getLocationLi"><img src="images/location.png" alt="" /></li>'+
												'</ul>'
							}

						}
					}
					$(".orderList .listCon").append(masterListItem);
				}
			}
		})
	}

	function changeItemType(code,type){
        var selectListData = JSON.parse(localStorage.getItem("basicData"));
        var returnText = "--";
        switch (type) {
            case 'currencyList':
                if (code && selectListData.currencyList) {
                    for (var i = 0; i < selectListData.currencyList.length; i++) {
                        if (selectListData.currencyList[i].code == code) {
                            returnText = selectListData.currencyList[i].text;
                        }
                    }
                }
                return returnText;
                break;
            case 'orderNatureList':
                if (code && selectListData.orderNatureList) {
                    for (var i = 0; i < selectListData.orderNatureList.length; i++) {
                        if (selectListData.orderNatureList[i].code == code) {
                            returnText = selectListData.orderNatureList[i].text;
                        }
                    }
                }
                return returnText;
                break;
        }
    }

	var omOrderIdList = [];
	var extPaymentWayList = [];
	var deleteInfoOrder = [];
    function masterOrderList1(){
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
						omOrderIdList.push(data[i].omOrderId);
						extPaymentWayList.push(data[i].extPaymentWay);
						deleteInfoOrder.push(data[i]);
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
                                '<li>'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span>' +
                                    '<span class="associationNo">订单性质：'+changeItemType(data[i].orderNature,"orderNatureList")+'</span>' +
                                    '<span class="associationNo">金额/币种：'+data[i].totalAmount+'/'+changeItemType(data[i].currency,"currencyList")+'</span>' +
                                '</li>'+
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
                            if(data[i].actCode == "INIT" || data[i].actCode == "RECV" || data[i].actCode == "SEND" || data[i].actCode == "DIST" || data[i].actCode == "ACTIVE"){
                                // RECV接收     初始化INIT
                                masterListItem += '<ul class="listItem orderItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
                                    '<li style="width: 39%;">'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span>' +
                                    '<span class="associationNo">订单性质：'+changeItemType(data[i].orderNature,"orderNatureList")+'</span>' +
                                    '<span class="associationNo">金额/币种：'+data[i].totalAmount+'/'+changeItemType(data[i].currency,"currencyList")+'</span>' +
                                    '<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
                                    '<li class="notdone" style="width: 11%;"></li>'+
                                    '<li class="notdone" style="width: 11%;"></li>'+
                                    '<li class="notdone" style="width: 11%;"></li>'+
                                    '<li class="getLocationLi" style="width: 11%;"><img src="images/location.png" alt="" /></li>'+
                                    '<li style="width: 17%;line-height: 0.58rem;padding: 0.14rem 0;box-sizing: border-box;"><button class="buttonPay">付款方式</button><button class="buttonDel">删除订单</button></li>'+
                                    '<div class="payLayer">'+
                                    '<div><p class="closePay">×</p></div>'+
                                    '<span class="contDivEditLi1">付款方式 : </span>'+
                                    '<p class="contDivEditLi2">'+
                                    '<select class="selectPay" name="">'+
                                    '<option value="">请选择</option>'+
                                    '<option value="spot">现付</option>'+
                                    '<option value="collect">到付</option>'+
                                    '<option value="voucher">凭单回复</option>'+
                                    '</select>'+
                                    '</p>'+
                                    '<button class="surePay">确定</button>'+
                                    '</div>'+
                                    '</ul>'
                            }else if(data[i].actCode == "SENT" || data[i].actCode == "DCHT"  || data[i].actCode == "COFM"){
                                //装车LONT    卸车 DCHT   SENT发出
                                masterListItem += '<ul class="listItem orderItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
                                    '<li style="width: 39%;">'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span>' +
                                    '<span class="associationNo">订单性质：'+changeItemType(data[i].orderNature,"orderNatureList")+'</span>' +
                                    '<span class="associationNo">金额/币种：'+data[i].totalAmount+'/'+changeItemType(data[i].currency,"currencyList")+'</span>' +
                                    '<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
                                    '<li class="'+orderstatClass+'" style="width: 11%;"></li>'+
                                    '<li class="notdone" style="width: 11%;"></li>'+
                                    '<li class="notdone" style="width: 11%;"></li>'+
                                    '<li class="getLocationLi" style="width: 11%;"><img src="images/location.png" alt="" /></li>'+
                                    '<li style="width: 17%;line-height: 0.58rem;padding: 0.14rem 0;box-sizing: border-box;"><button class="buttonPay">付款方式</button><button class="buttonDel">删除订单</button></li>'+
                                    '<div class="payLayer">'+
                                    '<div><p class="closePay">×</p></div>'+
                                    '<span class="contDivEditLi1">付款方式 : </span>'+
                                    '<p class="contDivEditLi2">'+
                                    '<select class="selectPay" name="">'+
                                    '<option value="">请选择</option>'+
                                    '<option value="spot">现付</option>'+
                                    '<option value="collect">到付</option>'+
                                    '<option value="voucher">凭单回复</option>'+
                                    '</select>'+
                                    '</p>'+
                                    '<button class="surePay">确定</button>'+
                                    '</div>'+
                                    '</ul>'
                            }else if(data[i].actCode == "EXCP" || data[i].actCode == "RJCT" ||  data[i].actCode == "LONT" ){
                                //  拒收 RJCT    异常 EXCP
                                masterListItem += '<ul class="listItem orderItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
                                    '<li style="width: 39%;">'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span>' +
                                    '<span class="associationNo">订单性质：'+changeItemType(data[i].orderNature,"orderNatureList")+'</span>' +
                                    '<span class="associationNo">金额/币种：'+data[i].totalAmount+'/'+changeItemType(data[i].currency,"currencyList")+'</span>' +
                                    '<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
                                    '<li class="'+orderstatClass+'" style="width: 11%;"></li>'+
                                    '<li class="'+orderstatClass+'" style="width: 11%;"></li>'+
                                    '<li class="notdone" style="width: 11%;"></li>'+
                                    '<li class="getLocationLi" style="width: 11%;"><img src="images/location.png" alt="" /></li>'+
                                    '<li style="width: 17%;line-height: 0.58rem;padding: 0.14rem 0;box-sizing: border-box;"><button class="buttonPay">付款方式</button><button class="buttonDel">删除订单</button></li>'+
                                    '<div class="payLayer">'+
                                    '<div><p class="closePay">×</p></div>'+
                                    '<span class="contDivEditLi1">付款方式 : </span>'+
                                    '<p class="contDivEditLi2">'+
                                    '<select class="selectPay" name="">'+
                                    '<option value="">请选择</option>'+
                                    '<option value="spot">现付</option>'+
                                    '<option value="collect">到付</option>'+
                                    '<option value="voucher">凭单回复</option>'+
                                    '</select>'+
                                    '</p>'+
                                    '<button class="surePay">确定</button>'+
                                    '</div>'+
                                    '</ul>'
                            }else if(data[i].actCode == "ACPT" || data[i].actCode == "DONE"){
                                //签收ACPT   完成 DONE
                                masterListItem += '<ul class="listItem orderItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
                                    '<li style="width: 39%;">'+data[i].customerOriginalNo+'<span class="associationNo">客户：'+data[i].stoPartyName+'</span>' +
                                    '<span class="associationNo">订单性质：'+changeItemType(data[i].orderNature,"orderNatureList")+'</span>' +
                                    '<span class="associationNo">金额/币种：'+data[i].totalAmount+'/'+changeItemType(data[i].currency,"currencyList")+'</span>' +
                                    '<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
                                    '<li class="'+orderstatClass+'" style="width: 11%;"></li>'+
                                    '<li class="'+orderstatClass+'" style="width: 11%;"></li>'+
                                    '<li class="'+orderstatClass+'" style="width: 11%;"></li>'+
                                    '<li class="getLocationLi" style="width: 11%;"><img src="images/location.png" alt="" /></li>'+
                                    '<li style="width: 17%;line-height: 0.58rem;padding: 0.14rem 0;box-sizing: border-box;"><button class="buttonPay">付款方式</button><button class="buttonDel">删除订单</button></li>'+
                                    '<div class="payLayer">'+
                                    '<div><p class="closePay">×</p></div>'+
                                    '<span class="contDivEditLi1">付款方式 : </span>'+
                                    '<p class="contDivEditLi2">'+
                                    '<select class="selectPay" name="">'+
                                    '<option value="">请选择</option>'+
                                    '<option value="spot">现付</option>'+
                                    '<option value="collect">到付</option>'+
                                    '<option value="voucher">凭单回复</option>'+
                                    '</select>'+
                                    '</p>'+
                                    '<button class="surePay">确定</button>'+
                                    '</div>'+
                                    '</ul>'
                            }
                        }
                    }
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
		if(orderstate == 4){
			var customerOriginalNo = $(".searchCon ul li .orderNo").val();
			var exceptionStatus = $(".searchCon ul li .abnormalStatus").val();
			var completeStatus = $(".searchCon ul li .statusSelect").val();
			var startCreateTime = $("#startTime").val().trim();
			var endCreateTime = $("#endTime").val().trim();
			if(startCreateTime == "" || startCreateTime == "null" || startCreateTime == null){

			}else{
				pageInf.startCreateTime = startCreateTime + " 00:00:00"
			}
			if(endCreateTime == "" || endCreateTime == "null" || endCreateTime == null){

			}else{
				pageInf.endCreateTime = endCreateTime + " 23:59:59"
			}
			if(customerOriginalNo == "" || customerOriginalNo == "null" || customerOriginalNo == null){

			}else{
				pageInf.customerOriginalNo = customerOriginalNo;
			}
			pageInf.exceptionStatus = exceptionStatus;
			pageInf.completeStatus = completeStatus;
			console.log(pageInf);
			masterOrderList1();
		}else{
			var orderNoInp = $(".searchCon ul li .orderNo").val();
			var trackingNoInp = $(".searchCon ul li .trackingNo").val();
			var actCodeSelect = $(".searchCon ul li .statusSelect").val();
			var exceptionStatus = $(".searchCon ul li .abnormalStatus").val();
			var startCompleteTime = $("#startTime").val().trim();
			var endCompleteTime = $("#endTime").val().trim();

			if(startCompleteTime == "" || startCompleteTime == "null" || startCompleteTime == null){

			}else{
				pageInf.startCompleteTime = startCompleteTime + " 00:00:00"
			}

			if(endCompleteTime == "" || endCompleteTime == "null" || endCompleteTime == null){

			}else{
				pageInf.endCompleteTime = endCompleteTime + " 23:59:59"
			}
			pageInf.customerOriginalNo = orderNoInp;
			pageInf.exceptionStatus = exceptionStatus;
			pageInf.completeStatus = actCodeSelect;
			masterOrderList();
		}
	})

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

	$(".orderList .listCon").on("click",".listItem .buttonDel",function(e){
		var index = $(this).parents(".listItem").index();
		var deleteListItem = $(this).parents(".listItem");
		var param = [{
			"refId":deleteInfoOrder[index].omOrderId,
			"refNo":deleteInfoOrder[index].orderNo
		}];
		$.ajax({
			url: '/icdp-tms-app-1.0.0/delete/orderInfo?token=' + logininf.token + '&timeStamp=' + logininf.timeStamp,
			type: "post",
			contentType: 'application/json',
			data: JSON.stringify(param),
			success:function(data){
				if(data.result.success == true){
					deleteListItem.remove();
				}else{
					loadData("show",data.result.message,true)
				}
			}
		})
	})

    $(".orderList .listCon").on("click",".listItem .buttonPay",function(e){
        e.stopPropagation();
        e.preventDefault();
		var index = $(this).parents(".listItem").index();
		$(this).parents(".listItem").find(".payLayer").animate({top:".88rem"},300);
		$(this).parents(".listItem").siblings().find(".payLayer").animate({top:"-1.2rem"},300);
		$(this).parents(".listItem").find(".selectPay option[value = "+extPaymentWayList[index]+"]").attr("selected",true);
    });
    $(".orderList .listCon").on("click",".listItem .payLayer",function(e){
        e.stopPropagation();
        e.preventDefault();
    });
    $(".orderList .listCon").on("click",".listItem .surePay",function(){
        $(this).parents(".listItem").find(".payLayer").animate({top:"-1.2rem"},300);
        var index = $(this).parents(".listItem").index();
		var payExtValue = $(this).parents(".listItem").find(".payLayer").find(".contDivEditLi2").find(".selectPay").val();
		var OmExtVo = {
			refId:omOrderIdList[index],
			extColumn:"payment",
			extValue:payExtValue
		};
		console.log(OmExtVo)
		$.ajax({
			url: '/icdp-tms-app-1.0.0/update/orderPaymentStatus?token=' + logininf.token + '&timeStamp=' + logininf.timeStamp,
			type: "post",
			contentType: 'application/json',
			data: JSON.stringify(OmExtVo),
			success:function(data){
				console.log(data.result)
			}
		})
    });
    $(".orderList .listCon").on("click",".listItem .closePay",function(){
        $(this).parents(".listItem").find(".payLayer").animate({top:"-1.2rem"},300);
    });
    $(document).click(function(e){
        $(".payLayer").animate({top:"-1.2rem"},300);
    });
})
