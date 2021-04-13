$(function(){
    // 获取当前位置
    getLocationFun();
	/* 微信中不隐去.header */
	var ua = window.navigator.userAgent.toLowerCase();
	/*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		$(".header").show();
		$(".main").css({
			"marginTop":"0.88rem"
		})
	}*/

	var logininf = JSON.parse(localStorage.getItem("logininf"));
	var carInfomation = localStorage.getItem("carInfomation");
	$(".header .txt").html(carInfomation);
	$("title").html(carInfomation);
	
	var myDate = new Date();
	var year= myDate.getFullYear();
	var month= myDate.getMonth()+1 < 10 ? '0'+(myDate.getMonth()+1) : (myDate.getMonth()+1) + '-';
	var date = myDate.getDate() < 10 ? '0'+ myDate.getDate() : myDate.getDate() + ' '; 
	var nowDate = year +'-'+ month +"-"+date;
	console.log(nowDate)
	//获取列表
	var pageNumVal = 1;
	var totalNum = 1;
	$(".main").scroll(function(){
		var scrollNum = document.documentElement.clientWidth / 7.5;
        if($(".main .orderList").outerHeight() - $(".main").scrollTop() - $(".main").height() < 10){
            if($(".ajax-loder-wrap").length > 0){
                return false;
            }
			if(pageNumVal < totalNum){
				pageNumVal = parseInt(pageNumVal) + parseInt(1)
				pageInf.pageInfo.pageNum = pageNumVal;
				getVehicleList();
			}
		}  
	})
	var vehicleDate = localStorage.getItem("vehicleDate");
	var carClassesOrderNo = localStorage.getItem("carClassesOrderNo");
	if(vehicleDate == "" || vehicleDate == null || vehicleDate == undefined || vehicleDate == "null" || vehicleDate == "undefined"){
		var pageInf = {
            "orderNo":carClassesOrderNo,
			"carDrvContactTel":carInfomation.split('-')[2],
			"carDrvEqpNo":carInfomation.split('-')[0],
			"pageInfo": {
				pageNum: pageNumVal,
				pageSize: 30
			}
		};
	}else{
		var pageInf = {
            "orderNo":carClassesOrderNo,
            "carDrvContactTel":carInfomation.split('-')[2],
			"carDrvEqpNo":carInfomation.split('-')[0],
			"pageInfo": {
				pageNum: pageNumVal,
				pageSize: 30
			}
		};
	}
	
	getVehicleList();
	
	var totalQty = 0;
	var totalVolume = 0;
	var totalWeight = 0;
	function getVehicleList(){
		$.ajax({
			url: tmsUrl + '/wx/query/transportOrderInfoPage?token=' + logininf.token + '&timeStamp=' + logininf.timeStamp,
			type: "post",
			contentType: 'application/json',
			data: JSON.stringify(pageInf),
			beforeSend:function(){
		        $(".main").append('<div class="ajax-loder-wrap"><img src="../images/ajax-loader.gif" class="ajax-loader-gif"/><p class="loading-text">加载中...</p></div>');
			},
			success:function(data){
				$(".ajax-loder-wrap").remove();
				totalNum = data.pageInfo.pages;
				if(data.result.length == 0){
					var timer1 = setTimeout(function(){
						$(".listCon").append('<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;">'+
											'<img src="images/noContent.png" alt=""  style="width: 3rem; height: auto; display: block;"/>'+
									'</p>');
					},600)
				}else{
					vehicleHtml(data.result);
				}
			}
		})
		
		function vehicleHtml(vehicleData){
			var vehicleItem = "";
			var colorStatus = "notdone"
			var isComponent = 0
			for(var i = 0; i < vehicleData.length; i ++ ){
				if(vehicleData[i].completeStatus == "0"){
					vehicleData[i].completeStatus = "未开始"
					colorStatus = "notdone"
					isComponent = 0;
				}else if(vehicleData[i].completeStatus == "1"){
					vehicleData[i].completeStatus = "已完成"
					colorStatus = "done"
					isComponent = 1;
				}else if(vehicleData[i].completeStatus == "2"){
					vehicleData[i].completeStatus = "处理中"
					colorStatus = "notdone"
					isComponent = 0;
				}else if(vehicleData[i].completeStatus == "3"){
					vehicleData[i].completeStatus = "配送中"
					colorStatus = "notdone"
					isComponent = 0;
				}else if(vehicleData[i].completeStatus == "INIT"){
					vehicleData[i].completeStatus = "初始化"
					colorStatus = "notdone"
					isComponent = 0;
				}
				//接单：DIST；装车：COFM；配送：LONT；签收：ACPT；
				vehicleItem += '<ul class="listItem" orderId="'+vehicleData[i].omOrderId+'" orderStatus="'+isComponent+'">'+
									'<li>'+vehicleData[i].orderNo+' <span class="associationNo">原单号：'+vehicleData[i].customerOriginalNo+
					   				'<br>客户：'+vehicleData[i].stoPartyName+ '<br>地址：'+vehicleData[i].stoAddress+ '</span>' +
									'<li>'+vehicleData[i].totalQty+'*'+vehicleData[i].totalWeight+'*'+vehicleData[i].totalVolume+'</li>'+
									'<li class="'+colorStatus+'">'+vehicleData[i].completeStatus+'</li>'+
								'</ul>'
			}
			$(".orderList .listCon").append(vehicleItem);
			for(var j = 0; j < $(".listItem").length; j ++){
				if(vehicleData[j].exceptionStatus != 0){
					$(".listItem").eq(j).find("li,span").css("color","red");
				}
			}
			var carSpecification = localStorage.getItem("carSpecification");
			$(".carAmountInf").html("整车件.毛.体： " + carSpecification);
		}
	}
	
	$(".carDetails .listCon").on("click",".listItem",function(){
		var orderid = $(this).attr("orderId");
		var orderStatus = $(this).attr("orderStatus");
		location.href = "orderInfo.html?orderid="+orderid+"&orderStatus="+orderStatus;
		
	})
	
})
