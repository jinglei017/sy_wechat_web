$(function(){
    // 获取当前位置
    getLocationFun();
	/* 微信中不隐去.header */
	var ua = window.navigator.userAgent.toLowerCase();
	/*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		$(".header").show();
	}*/
	var logininf =  JSON.parse(localStorage.getItem("logininf"));
	localStorage.removeItem("activeData");
	$(".todayStat li").click(function(){
		var index = $(this).index();
		location.href = "orderStatList-client.html?orderstate="+index;
	})

	$(".weekStat li").click(function(){
		var index = $(this).index();
		location.href = "weekTimeList-client.html?orderstate="+index+"&timeType=1";
	})

	$(".monthStat li").click(function(){
		var index = $(this).index();
		location.href = "orderCostList-client.html?orderstate="+index+"&timeType=2";
	})
	//bl   taoc   123456
	function p(s) {
	    return s < 10 ? '0' + s: s;
	}
	var myDate = new Date();
	//获取当前年
	var year=myDate.getFullYear();
	//获取当前月
	var month=myDate.getMonth()+1;
	var month1 = myDate.getMonth();
	//获取当前日
	var date = myDate.getDate();
	var date1 = myDate.getDate() - 1;
	var h=myDate.getHours();       //获取当前小时数(0-23)
	var m=myDate.getMinutes();     //获取当前分钟数(0-59)
	var s=myDate.getSeconds();
	var todayTime = year+'-'+p(month)+'-'+p(date);
	var yeTime =  year+'-'+p(month)+'-'+p(date1);
	var monthTime = year+'-'+p(month);
    var roleId = localStorage.getItem("roleId");
    var orderType = "";
    if(roleId == '0'){
        orderType = "TO"
    } else{
        orderType = "DO"
    }

    setTimeout(function(){getOrderTotalNum()},100);
    setTimeout(function(){getOrderWeekNum()},100);
    setTimeout(function(){getOrderMonthNum()},200);

	function getOrderMonthNum(){
		var merchantInf = {
			tenantId: logininf.umTenantId,
            orderType: orderType,
			startTime:monthTime+"-01 00:00:00",
			endTime:todayTime+" 23:59:59"
		}
		$.ajax({
			url: chartUrl + '/tenant/getOrderTotalNum?token='+logininf.token+'&timeStamp='+logininf.timeStamp,
		    type:"post",
            beforeSend:function(){
                loadData('show');
            },
		    contentType : 'application/json',
		    data: JSON.stringify(merchantInf),
		    success: function(data) {
                if(data != null){
                    if(data.msg != 'success' && data.msg != 'SUCCESS'){
                        if ($('.loadingExceptionMsg').length < 1) {
                            loadData('show', '查询出错，请刷新重试');
                            $(".loading").addClass('loadingExceptionMsg');
                        }
                        return false;
                    }else{
                        if ($('.loadingExceptionMsg').length < 1) {
                            loadData('hide');
                        }
                    }
                }else{
                    if ($('.loadingExceptionMsg').length < 1) {
                        loadData('show', '查询出错，请刷新重试');
                        $(".loading").addClass('loadingExceptionMsg');
                    }
                    return false;
                }
		    	var allordernum = data.result.allOrderstotal;
		    	var lontActcurrentnum = data.result.lontActcurrent;
		    	var normalordernum = data.result.normalOrderstotal;
		    	var doneordernum = data.result.doneOrderstotal;
		    	var deviantordernum = data.result.deviantOrderstotal;
		    	//$(".todayOrder .todayStat li").eq(1).find(".num").html(normalordernum);
		    	//$(".todayOrder .todayStat li").eq(2).find(".num").html(doneordernum);
		    	//$(".todayOrder .todayStat li").eq(3).find(".num").html(deviantordernum);

		    	$(".todayOrder .monthStat li").eq(0).find(".num").html(allordernum);

		    	if(doneordernum == 0 || allordernum == 0){
		    		$(".todayOrder .monthStat li").eq(1).find(".num").html(doneordernum + "&nbsp&nbsp&nbsp" + "0%");

		    	}else{
		    		$(".todayOrder .monthStat li").eq(1).find(".num").html(doneordernum + "&nbsp&nbsp&nbsp" + (doneordernum/allordernum * 100).toFixed(2) + "%");
		    	}

		    	if(lontActcurrentnum == 0 || allordernum == 0){
		    		$(".todayOrder .monthStat li").eq(2).find(".num").html(lontActcurrentnum + "&nbsp&nbsp&nbsp" + "0%");

		    	}else{
		    		$(".todayOrder .monthStat li").eq(2).find(".num").html(lontActcurrentnum + "&nbsp&nbsp&nbsp" + ((parseInt(lontActcurrentnum))/allordernum * 100).toFixed(2) + "%");

		    	}

		    	if(deviantordernum == 0 || allordernum == 0){
		    		$(".todayOrder .monthStat li").eq(3).find(".num").html(deviantordernum + "&nbsp&nbsp&nbsp" + "0%");

		    	}else{
		    		$(".todayOrder .monthStat li").eq(3).find(".num").html(deviantordernum + "&nbsp&nbsp&nbsp" + ((parseInt(deviantordernum))/allordernum * 100).toFixed(2) + "%");

		    	}

		    	$(".todayOrder .monthStat li").eq(0).find(".line i").css({
		    		"width":allordernum/allordernum * 100 + "%"
		    	});

		    	$(".todayOrder .monthStat li").eq(1).find(".line i").css({
		    		"width":doneordernum/allordernum * 100 + "%"
		    	});

		    	$(".todayOrder .monthStat li").eq(2).find(".line i").css({
		    		"width":lontActcurrentnum/allordernum * 100 + "%"
		    	});

		    	$(".todayOrder .monthStat li").eq(3).find(".line i").css({
		    		"width":deviantordernum/allordernum * 100 + "%"
		    	});

		    	if(allordernum == 0 || doneordernum == 0){
			    	$(".todayOrder .monthStat li").eq(1).find(".line i").css({
			    		"width":"1%"
			    	});

		    	}

		    	if(allordernum == 0 || deviantordernum == 0){
			    	$(".todayOrder .monthStat li").eq(3).find(".line i").css({
		    			"width":"1%"
		    		});
		    	}

		    	if(allordernum == 0 || lontActcurrentnum == 0){
			    	$(".todayOrder .monthStat li").eq(2).find(".line i").css({
		    			"width":"1%"
		    		});
		    	}

		    	if(allordernum == 0){
			    	$(".todayOrder .monthStat li").eq(0).find(".line i").css({
		    			"width":"1%"
		    		});
		    	}
		    }
		})
	}

	function getOrderWeekNum(){
		var merchantInf = {
			tenantId: logininf.umTenantId,
            orderType: orderType,
			startTime:getCurrentTime(7) +" 00:00:00",
			endTime:getCurrentTime(1) + " 23:59:59"
		}
		$.ajax({
			url: chartUrl + '/tenant/getOrderTotalNum?token='+logininf.token+'&timeStamp='+logininf.timeStamp,
		    type:"post",
            beforeSend:function(){
                loadData('show');
            },
		    contentType : 'application/json',
		    data: JSON.stringify(merchantInf),
		    success: function(data) {
                if(data != null){
                    if(data.msg != 'success' && data.msg != 'SUCCESS'){
                        if ($('.loadingExceptionMsg').length < 1) {
                            loadData('show', '查询出错，请刷新重试');
                            $(".loading").addClass('loadingExceptionMsg');
                        }
                        return false;
                    }else{
                        if ($('.loadingExceptionMsg').length < 1) {
                            loadData('hide');
                        }
                    }
                }else{
                    if ($('.loadingExceptionMsg').length < 1) {
                        loadData('show', '查询出错，请刷新重试');
                        $(".loading").addClass('loadingExceptionMsg');
                    }
                    return false;
                }
		    	var allordernum = data.result.allOrderstotal;
		    	var lontActcurrentnum = data.result.lontActcurrent;
		    	var normalordernum = data.result.normalOrderstotal;
		    	var doneordernum = data.result.doneOrderstotal;
		    	var deviantordernum = data.result.deviantOrderstotal;
		    	//$(".todayOrder .weekStat li").eq(1).find(".num").html(normalordernum);
		    	//$(".todayOrder .weekStat li").eq(2).find(".num").html(doneordernum);
		    	//$(".todayOrder .weekStat li").eq(3).find(".num").html(deviantordernum);

		    	$(".todayOrder .weekStat li").eq(0).find(".num").html(allordernum);

		    	if(doneordernum == 0 || allordernum == 0){
		    		$(".todayOrder .weekStat li").eq(1).find(".num").html(doneordernum + "&nbsp&nbsp&nbsp" + "0%");

		    	}else{
		    		$(".todayOrder .weekStat li").eq(1).find(".num").html(doneordernum + "&nbsp&nbsp&nbsp" + (doneordernum/allordernum * 100).toFixed(2) + "%");
		    	}

		    	if(lontActcurrentnum == 0 || allordernum == 0){
		    		$(".todayOrder .weekStat li").eq(2).find(".num").html(lontActcurrentnum + "&nbsp&nbsp&nbsp" + "0%");

		    	}else{
		    		$(".todayOrder .weekStat li").eq(2).find(".num").html(lontActcurrentnum + "&nbsp&nbsp&nbsp" + ((parseInt(lontActcurrentnum))/allordernum * 100).toFixed(2) + "%");

		    	}

		    	if(deviantordernum == 0 || allordernum == 0){
		    		$(".todayOrder .weekStat li").eq(3).find(".num").html(deviantordernum + "&nbsp&nbsp&nbsp" + "0%");

		    	}else{
		    		$(".todayOrder .weekStat li").eq(3).find(".num").html(deviantordernum + "&nbsp&nbsp&nbsp" + ((parseInt(deviantordernum))/allordernum * 100).toFixed(2) + "%");

		    	}

		    	$(".todayOrder .weekStat li").eq(0).find(".line i").css({
		    		"width":allordernum/allordernum * 100 + "%"
		    	});

		    	$(".todayOrder .weekStat li").eq(1).find(".line i").css({
		    		"width":doneordernum/allordernum * 100 + "%"
		    	});

		    	$(".todayOrder .weekStat li").eq(2).find(".line i").css({
		    		"width":lontActcurrentnum/allordernum * 100 + "%"
		    	});

		    	$(".todayOrder .weekStat li").eq(3).find(".line i").css({
		    		"width":deviantordernum/allordernum * 100 + "%"
		    	});

		    	if(allordernum == 0 || doneordernum == 0){
			    	$(".todayOrder .weekStat li").eq(1).find(".line i").css({
			    		"width":"1%"
			    	});

		    	}

		    	if(allordernum == 0 || deviantordernum == 0){
			    	$(".todayOrder .weekStat li").eq(3).find(".line i").css({
		    			"width":"1%"
		    		});
		    	}

		    	if(allordernum == 0 || lontActcurrentnum == 0){
			    	$(".todayOrder .weekStat li").eq(2).find(".line i").css({
		    			"width":"1%"
		    		});
		    	}

		    	if(allordernum == 0){
			    	$(".todayOrder .weekStat li").eq(0).find(".line i").css({
		    			"width":"1%"
		    		});
		    	}
		    }
		})

	}

	function getOrderTotalNum(){
		var merchantInf = {
			tenantId: logininf.umTenantId,
            orderType: orderType,
			startTime:todayTime+" 00:00:00",
			endTime:todayTime+" 23:59:59"
		}
		$.ajax({
			url: chartUrl + '/tenant/getOrderTotalNum?token='+logininf.token+'&timeStamp='+logininf.timeStamp,
		    type:"post",
            beforeSend:function(){
                loadData('show');
            },
		    contentType : 'application/json',
		    data: JSON.stringify(merchantInf),
		    success: function(data) {
                if(data != null){
                    if(data.msg != 'success' && data.msg != 'SUCCESS'){
                        if ($('.loadingExceptionMsg').length < 1) {
                            loadData('show', '查询出错，请刷新重试');
                            $(".loading").addClass('loadingExceptionMsg');
                        }
                        return false;
                    }else{
                        if ($('.loadingExceptionMsg').length < 1) {
                            loadData('hide');
                        }
					}
                }else{
                    if ($('.loadingExceptionMsg').length < 1) {
                        loadData('show', '查询出错，请刷新重试');
                        $(".loading").addClass('loadingExceptionMsg');
                    }
                    return false;
                }
		    	var allordernum = data.result.allOrderstotal;
		    	var lontActcurrentnum = data.result.lontActcurrent;
		    	var normalordernum = data.result.normalOrderstotal;
		    	var doneordernum = data.result.doneOrderstotal;
		    	var deviantordernum = data.result.deviantOrderstotal;
		    	$(".todayOrder .todayStat li").eq(0).find(".num").html(allordernum);

		    	if(doneordernum == 0 || allordernum == 0){
		    		$(".todayOrder .todayStat li").eq(1).find(".num").html(doneordernum + "&nbsp&nbsp&nbsp" + "0%");
		    	}else{
		    		$(".todayOrder .todayStat li").eq(1).find(".num").html(doneordernum + "&nbsp&nbsp&nbsp" + (doneordernum/allordernum * 100).toFixed(2) + "%");
		    	}

		    	if(lontActcurrentnum == 0 || allordernum == 0){
		    		$(".todayOrder .todayStat li").eq(2).find(".num").html(lontActcurrentnum + "&nbsp&nbsp&nbsp" +  "0%");
		    	}else{
		    		$(".todayOrder .todayStat li").eq(2).find(".num").html(lontActcurrentnum + "&nbsp&nbsp&nbsp" + (lontActcurrentnum/allordernum * 100).toFixed(2) + "%");

		    	}

		    	if(deviantordernum == 0 || allordernum == 0){
		    		$(".todayOrder .todayStat li").eq(3).find(".num").html(deviantordernum + "&nbsp&nbsp&nbsp" + "0%");

		    	}else{
		    		$(".todayOrder .todayStat li").eq(3).find(".num").html(deviantordernum + "&nbsp&nbsp&nbsp" + (deviantordernum/allordernum * 100).toFixed(2) + "%");

		    	}


		    	$(".todayOrder .todayStat li").eq(0).find(".line i").css({
		    		"width":allordernum/allordernum * 100 + "%"
		    	});
		    	$(".todayOrder .todayStat li").eq(1).find(".line i").css({
		    		"width":doneordernum/allordernum * 100 + "%"
		    	});
		    	$(".todayOrder .todayStat li").eq(2).find(".line i").css({
		    		"width":lontActcurrentnum/allordernum * 100 + "%"
		    	});
		    	$(".todayOrder .todayStat li").eq(3).find(".line i").css({
		    		"width":deviantordernum/allordernum * 100 + "%"
		    	});



		    	if(allordernum == 0 || doneordernum == 0){
		    		$(".todayOrder .todayStat li").eq(1).find(".line i").css({
			    		"width":"1%"
			    	});
		    	}

		    	if(allordernum == 0 || lontActcurrentnum == 0){
		    		$(".todayOrder .todayStat li").eq(2).find(".line i").css({
			    		"width":"1%"
			    	});
		    	}

		    	if(allordernum == 0 || deviantordernum == 0){
		    		$(".todayOrder .todayStat li").eq(3).find(".line i").css({
			    		"width":"1%"
			    	});
		    	}

		    	if(allordernum == 0){
		    		$(".todayOrder .todayStat li").eq(0).find(".line i").css({
			    		"width":"1%"
			    	});
		    	}
		    }
		})
	}

})





