$(function(){
    // 获取位置信息上传
    getLocationFun();

    var logininf =  JSON.parse(localStorage.getItem("logininf"));
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
	var todayTime = year+'-'+p(month)+'-'+p(date);
	var yeTime =  year+'-'+p(month)+'-'+p(date1);
	var monthTime = year+'-'+p(month);
	var merchantInf = {
		umTenantId: logininf.umTenantId,
		startCompleteTime:todayTime+" 00:00:00",
		endCompleteTime:todayTime+" 23:59:59"
	}

	function GetQueryString(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
	var orderstate = GetQueryString("orderstate");


	if(orderstate == 0){
		pageInf = {
			umTenantId: logininf.umTenantId,
            startCompleteTime:todayTime+" 00:00:00",
            endCompleteTime:todayTime+" 23:59:59",
            isOrderInd:"TRUE",
            orderType:'DO',
		};
		$(".header .right").show();
		getClientList()
	}else if(orderstate == 1){
		pageInf = {
			umTenantId: logininf.umTenantId,
            startCompleteTime:todayTime+" 00:00:00",
            endCompleteTime:todayTime+" 23:59:59",
			completeStatus:"1",
			isNoException:true,
			isOrderInd:"TRUE",
			orderType:'DO',
		};
		getClientList()
	}else if(orderstate == 2){
		pageInf = {
			umTenantId: logininf.umTenantId,
            startCompleteTime:todayTime+" 00:00:00",
            endCompleteTime:todayTime+" 23:59:59",
			isTransit:true,
			isNoException:true,
			isOrderInd:"TRUE",
			orderType:'DO',
		};
		getClientList()
	}else if(orderstate == 3){
		pageInf = {
			umTenantId: logininf.umTenantId,
			startCompleteTime:todayTime+" 00:00:00",
			endCompleteTime:todayTime+" 23:59:59",
			isException:true,
			isOrderInd:"TRUE",
			orderType:'DO',
		};
		getClientList()
	}

	function getClientList(){
		$.ajax({
			url: omsUrl + '/provider/query/sfrOrderCount?token='+logininf.token+'&timeStamp='+logininf.timeStamp,
		    type:"post",
		    contentType : 'application/json',
		    data: JSON.stringify(pageInf),
            beforeSend:function(){
                loadData('show');
            },
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
		    	var clientItem = "";
		    	if(data.result.length == 0){
					var timer1 = setTimeout(function(){
						$(".clientBox").append('<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;">'+
											'<img src="images/noContent.png" alt=""  style="width: 3rem; height: auto; display: block;"/>'+
									'</p>');
					},600)
				}else{
			    	for(var i = 0 ; i < data.result.length; i++){
			    		clientItem += '<li stoPartyCode="'+data.result[i].partyCode+'">'+
										'<span class="txt">'+data.result[i].partyName+'</span>'+
										'<span class="right">'+data.result[i].completeCount+'/'+data.result[i].orderCount+'</span>'+
									 '</li>'
			    	}
			    	$(".clientList").html(clientItem);
			    }
		    }
		})
	}



	$(".clientList").on("click","li",function(){
		//alert($(this).attr("stoPartyCode"));
		var stoPartyCode = $(this).attr("stoPartyCode");
		location.href = "orderStatList.html?orderstate="+orderstate+"&partycode="+stoPartyCode;
	})

})
