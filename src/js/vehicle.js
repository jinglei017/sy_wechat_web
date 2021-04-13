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
	var myDate = new Date();
	var year= myDate.getFullYear();
	var month= myDate.getMonth()+1 < 10 ? '0'+(myDate.getMonth()+1) : (myDate.getMonth()+1);
	var date = myDate.getDate() < 10 ? '0'+ myDate.getDate() : myDate.getDate() + ' ';
	var nowDate = year+'-'+month+'-'+date;
	var pageNumVal = 1;
	$(".main").scroll(function(){
		var scrollNum = document.documentElement.clientWidth / 7.5;
        if($(".main .carList").outerHeight() - $(".main").scrollTop() - $(".main").height() < 10){
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
	if(vehicleDate == null || vehicleDate == "null" || vehicleDate == ""){

	}else{
		nowDate = vehicleDate;
		$("#startTime").val(nowDate);

	}
	$(".header .txt").html("运输监控 &nbsp" + nowDate);
	var ua = window.navigator.userAgent.toLowerCase();
	/*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		$(".header").show();
		$(".main").css({
			"paddingTop":"0.88rem"
		})
		$(".orderList").css({
			"paddingTop":"0rem"
		})
	}*/
	//获取列表
	var pageInf = {
        endCompleteTime:nowDate,
        startCompleteTime:nowDate,
		pageInfo:{
			pageNum:pageNumVal,
			pageSize:25,
		}
	}
	getVehicleList();
	function getVehicleList(){
		$.ajax({
			url: tmsUrl + '/wx/query/queryTransportMonitorPage?token=' + logininf.token + '&timeStamp=' + logininf.timeStamp,
			type: "post",
			contentType: 'application/json',
			data: JSON.stringify(pageInf),
			beforeSend:function(){
		        $(".main").append('<div class="ajax-loder-wrap"><img src="../images/ajax-loader.gif" class="ajax-loader-gif"/><p class="loading-text">加载中...</p></div>');
			},
			success:function(data){
				$(".ajax-loder-wrap").remove();
				totalNum = data.result.pageModel.pageInfo.pages;
				var loadFactor =  ((data.result.fullyLoaded / data.result.totalLoaded) * 100).toFixed(2);
				if(data.result.totalLoaded != 0){
					$(".carAmountInf").html("今日满载率：" + loadFactor+ "%");
				}
				var data = data.result.pageModel.data;
				if(data.length == 0){
					var timer1 = setTimeout(function(){
						$(".listCon").append('<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;">'+
											'<img src="images/noContent.png" alt=""  style="width: 3rem; height: auto; display: block;"/>'+
									'</p>');
					},600)
				}else{
					vehicleHtml(data);
				}
			}
		})

		function vehicleHtml(vehicleData){
			var vehicleItem = "";
			var statusColour = "notdone";
			for(var i = 0; i < vehicleData.length; i ++ ){
				if(vehicleData[i].completeCount == vehicleData[i].totalCount){
					statusColour = "done";
				}else{
					statusColour = "notdone";
				}

				if(vehicleData[i].int1 == 1){
					vehicleData[i].int1 = "已满载"
				}else{
					vehicleData[i].int1 = "未满载"
				}
				var classesNo = vehicleData[i].str1;
				if(classesNo != null || classesNo != undefined){
					var classesNoLen1 = classesNo.length;
					var classesNoLen2 = classesNo.length - 2;
					classesNo = classesNo.substring(classesNoLen2,classesNoLen1);
				}else{
					classesNo = "--"
				}

				var eqpNo = vehicleData[i].eqpNo;
				if(eqpNo != null || eqpNo != undefined){
					eqpNo = eqpNo;
				}else{
					eqpNo = '暂无'
				}

				//str.substring(0)
				vehicleItem += '<ul class="listItem" vehicleeqpNo="'+vehicleData[i].eqpNo+'" driverName="'+vehicleData[i].contactName+'" specification="'+vehicleData[i].totalQty+' * ' + vehicleData[i].totalWeight + ' * ' + vehicleData[i].totalVolume+'" contactTel="'+vehicleData[i].contactTel+'" orderNo="'+vehicleData[i].orderNo+'">'+
									'<li><span class="classesNo">'+classesNo+'</span></li>'+
									'<li>'+eqpNo+'-'+vehicleData[i].int1+'</li>'+
									'<li class="'+statusColour+'">'+vehicleData[i].completeCount+' / '+vehicleData[i].totalCount+' </li>'+
									'<li>'+vehicleData[i].contactName+'</li>'+
									'<li class="getLocationLi" vehiclePosition="'+vehicleData[i].latLng+'"><img src="images/location.png" alt="" /></li>'+
                                    '<li class="getDetailDataLi" vehicleOrderId="'+vehicleData[i].orderId+'"><img src="images/bottom_btn1.png" alt="" style="width: 0.25rem;height: 0.19rem;padding: 0.1rem;" /></li>'+
                                    '<div class="unwind"></div>'+
								'</ul>'
			}
			$(".orderList .listCon").append(vehicleItem);
		}

	}

	$(".carList .listCon").on("click",".listItem",function(){
		var driverName = $(this).attr("driverName");
		var vehicleeqpNo = $(this).attr("vehicleeqpNo");
		var contactTel = $(this).attr("contactTel");
		var orderNo= $(this).attr("orderNo");
		//var carInfomation = vehicleeqpNo + "-" + driverName + "-" + contactTel+"-"+orderNo;
		var carInfomation = vehicleeqpNo + "-" + driverName + "-" + contactTel;
		var specification = $(this).attr("specification");
		localStorage.setItem("carInfomation",carInfomation);
		localStorage.setItem("carSpecification",specification);
		localStorage.setItem("carClassesOrderNo",orderNo);
		location.href = "vehicleDetails.html"
	})

	$(".header .right").click(function(){
		$(".searchLayer").show();
	})

	$(".searchBox .searchbtn").click(function(){
		console.log($("#startTime").val());
		if($("#startTime").val().trim() == ""){
			loadData("show","请输入您要查找的日期",true)
		}else{
			localStorage.setItem("vehicleDate",$("#startTime").val());
			$(".main .orderList .listCon").html("");
			totalNum = 1;
			pageInf.pageInfo.pageNum = 1;
			pageInf.endCompleteTime = $("#startTime").val();
			pageInf.startCompleteTime = $("#startTime").val();
			getVehicleList();
			$(".searchLayer").hide();
			$(".header .txt").html("运输监控 &nbsp" + $("#startTime").val());
		}
	})

	$(".carList .listCon").on("click"," .listItem .getLocationLi",function(e){
		e.stopPropagation();
		e.preventDefault();
		var carCurrentPlace = $(this).attr("vehiclePosition");
		console.log(carCurrentPlace);
		if(carCurrentPlace == "" || carCurrentPlace == "null" || carCurrentPlace == null || carCurrentPlace == "undefined,undefined" || carCurrentPlace == undefined){
			loadData("show","暂无当前车辆位置信息",true)
		}else{
			localStorage.setItem("carCurrentPlace",carCurrentPlace);
			location.href = "vehiclePosition.html";
		}

	})

    $(".carList .listCon").on("click"," .listItem .getDetailDataLi",function(e){
        e.stopPropagation();
        e.preventDefault();
        $(".unwind").html("");
        var index = $(this).index();
        var vehicleOrderId = $(this).attr("vehicleOrderId");
        var thisUnwind = $(this).siblings(".unwind");
        thisUnwind.toggle();
        $(this).parents(".listItem").siblings().find(".unwind").hide();
        if($(this).hasClass(".hasDetailDataLi")){
            $(this).removeClass(".hasDetailDataLi");
        }else{
            $(this).addClass(".hasDetailDataLi");
            $(this).parents(".listItem").siblings().find(".getDetailDataLi").removeClass(".hasDetailDataLi");
            $.ajax({
                url: omsUrl + '/wx/get/OrderInfoDetail?token='+logininf.token+'&timeStamp='+logininf.timeStamp+"&orderId="+vehicleOrderId,
                type:"get",
                success: function(data) {
                    //费用
                    var OrderAmtList = {
                        itemCost: 0,
                        kgCost: 0,
                        m3Cost: 0
                    };
                    if(data.result.amtList != null && data.result.amtList.length > 0){
                        var amtList = data.result.amtList;
                        for(var m=0;m<amtList.length;m++){
                            if(amtList[m].amtType == 'ITEM_COST'){
                                OrderAmtList.itemCost = amtList[m].amt;
                            } else if(amtList[m].amtType == 'KG_COST'){
                                OrderAmtList.kgCost = amtList[m].amt;
                            } else if(amtList[m].amtType == 'M3_COST'){
                                OrderAmtList.m3Cost = amtList[m].amt;
                            }
                        }
                    }
                    var OrderMeaList = {
                        num3: 0,
                        loadVolume: 0,
                        loadWeight: 0
                    };
                    //满载率
                    if(data.result.num3 != null && data.result.num3 != undefined){
                        OrderMeaList.num3 = data.result.num3;
                    }
                    if(data.result.meaList != null && data.result.meaList.length > 0){
                        var meaList = data.result.meaList;
                        for(var n=0;n<meaList.length;n++){
                            if(meaList[n].meaType == 'LOAD_RATE_VOLUME'){
                                OrderMeaList.loadVolume = meaList[n].mea;
                            } else if(meaList[n].meaType == 'LOAD_RATE_WEIGHT'){
                                OrderMeaList.loadWeight = meaList[n].mea;
                            }
                        }
                    }
                    var unwindDiv =
                        '<p>满载率：'+OrderMeaList.num3+'%</p>'+
                        '<p>体积满载率：'+OrderMeaList.loadVolume+'%</p>'+
                        '<p>重量满载率：'+OrderMeaList.loadWeight+'%</p>'+
                        '<p>件费用：'+OrderAmtList.itemCost+'%</p>'+
                        '<p>体积费用：'+OrderAmtList.m3Cost+'%</p>'+
                        '<p>满重量费用：'+OrderAmtList.kgCost+'%</p>';
                    thisUnwind.html(unwindDiv);
                }
            });
        }
    })
})
