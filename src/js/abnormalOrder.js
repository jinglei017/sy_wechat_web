$(function(){
    getLocationFun();      // 获取位置信息上传
	/* 微信中不隐去.header */
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
	/* 分页信息 */
	var pagenum = 1,pages = "";
	/* 查询参数 —— 不传startCompleteTime，endCompleteTime，查询所有异常订单 */
	var logininf = JSON.parse(localStorage.getItem("logininf"));

	$(".orderList").scroll(function(){
		var scrollNum = document.documentElement.clientWidth / 7.5;
        if($(".orderList .listCon").outerHeight() - $(".orderList").scrollTop() - $(".orderList").height() < 10){
            if($(".ajax-loder-wrap").length > 0){
                return false;
            }
			if(pagenum < pages){
				pagenum = parseInt(pagenum) + parseInt(1)
				pageInf.pageInfo.pageNum = pagenum;
				orderListFun()
			}
		}
	})
	var pageInf = {
        startCompleteTime:getQueryTime(14),
        endCompleteTime:getCurrentTime2("0"),
	    umTenantId: logininf.umTenantId,
	    isException:true,
        isExceptionHandle:true,
	    "pageInfo": {
	        pageNum: pagenum,
	        pageSize: 30
	    }
	};
	orderListFun();
	var tasklistData = "";
	function orderListFun() {
	    $.ajax({
	        url: omsUrl + '/provider/query/exceptionOrderInfoPage?token=' + logininf.token + '&timeStamp=' + logininf.timeStamp,
	        type: "post",
	        contentType: 'application/json',
	        data: JSON.stringify(pageInf),
	        beforeSend:function(){
	            $(".orderList").append('<div class="ajax-loder-wrap"><img src="../images/ajax-loader.gif" class="ajax-loader-gif"/><p class="loading-text">加载中...</p></div>');
	        },
	        success: function(data) {
	            $(".ajax-loder-wrap").remove();
	            pages = data.pageInfo.pages;
	            var orderstatitem = "";
	            var data = data.result;
	            tasklistData = data;
	            if(data.length == 0){
					var timer1 = setTimeout(function(){
						$(".orderList").append('<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;">'+
											'<img src="images/noContent.png" alt=""  style="width: 3rem; height: auto; display: block;"/>'+
									'</p>');
					},600)
				}else{
		            for(var i = 0; i < data.length;i++){
		            	if(data[i].trackingNo == null || data[i].trackingNo == "null"){
							data[i].trackingNo = "-"
						}

		            	if(data[i].completeStatus == "1"){
							isComponent = 1;
						}else{
							isComponent = 0;
						}
		                 orderstatClass = "abnormaldoneli";
		                //RECV 接收      COFM 确认      SENT 已发出      RJCT 拒收      ACPT 验收   DCHT 卸车     LONT 装车    SEND 发送     DONE 完成   INIT 初始化  EXCP 异常
		                if(data[i].actCode == "INIT" || data[i].actCode == "RECV" || data[i].actCode == "SEND" || data[i].actCode == "DIST"){
							// RECV接收     初始化INIT
							orderstatitem += '<ul class="listItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
												'<li>'+data[i].orderNo+'<span class="associationNo">原单号：'+data[i].customerOriginalNo+'<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
												'<li class="notdone"></li>'+
												'<li class="notdone"></li>'+
												'<li class="notdone"></li>'+
												'<li class="disposeLi">处理</li>'+
											'</ul>'
						}else if(data[i].actCode == "SENT" || data[i].actCode == "DCHT"  || data[i].actCode == "COFM"){
							//装车LONT    卸车 DCHT   SENT发出
							orderstatitem += '<ul class="listItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
												'<li>'+data[i].orderNo+'<span class="associationNo">原单号：'+data[i].customerOriginalNo+'<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
												'<li class="'+orderstatClass+'"></li>'+
												'<li class="notdone"></li>'+
												'<li class="notdone"></li>'+
												'<li class="disposeLi">处理</li>'+
											'</ul>'
						}else if(data[i].actCode == "EXCP" || data[i].actCode == "RJCT" ||  data[i].actCode == "LONT" ){
							//  拒收 RJCT    异常 EXCP
							orderstatitem += '<ul class="listItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
												'<li>'+data[i].orderNo+'<span class="associationNo">原单号：'+data[i].customerOriginalNo+'<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
												'<li class="'+orderstatClass+'"></li>'+
												'<li class="'+orderstatClass+'"></li>'+
												'<li class="notdone"></li>'+
												'<li class="disposeLi">处理</li>'+
											'</ul>'
						}else if(data[i].actCode == "ACPT" || data[i].actCode == "DONE"){
							//签收ACPT   完成 DONE
							orderstatitem += '<ul class="listItem" orderstatus="'+isComponent+'" orderInd='+data[i].orderInd+' orderid ='+data[i].omOrderId+'>'+
												'<li>'+data[i].orderNo+'<span class="associationNo">原单号：'+data[i].customerOriginalNo+'<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></li>'+
												'<li class="'+orderstatClass+'"></li>'+
												'<li class="'+orderstatClass+'"></li>'+
												'<li class="'+orderstatClass+'"></li>'+
												'<li class="disposeLi">处理</li>'+
											'</ul>'
						}
		            }

		            $(".orderList .listCon").append(orderstatitem);
		        }

	        },
	        error: function(xhr) {
	            // markmsg("不存在此账户");
	        }
	    });
	}

	//输入搜索条件查询
	$(".searchCon .searchbtn").click(function(){
		$(".orderList .listCon").html("");
		$(".noContent").remove();
		$(".searchLayer").hide();

		pageNumVal = 1;
		pages = 1;
		var orderNoInp = $(".searchCon ul li .orderNo").val().trim();
		var trackingNoInp = $(".searchCon ul li .trackingNo").val().trim();
		var actCodeSelect = $(".searchCon ul li .statusSelect").val().trim();
		var startCompleteTime = $("#startTime").val().trim();
		var endCompleteTime = $("#endTime").val().trim();
		if(startCompleteTime == "" || startCompleteTime == "null" || startCompleteTime == null){

		}else{
			pageInf.startCompleteTime = startCompleteTime
		}

		if(endCompleteTime == "" || endCompleteTime == "null" || endCompleteTime == null){

		}else{
			pageInf.endCompleteTime = endCompleteTime
		}

		pageInf.carDrvContactTel = logininf.mobilePhone
		pageInf.orderNo = orderNoInp
		pageInf.trackingNo = trackingNoInp
		pageInf.actCode = actCodeSelect
		pageInf.pageInfo.pageNum = "1";
		orderListFun();
		clickbtnTxt = "附件图片"
	})

	$(".header .right").click(function(){
		$(".searchLayer").show();
	})

	$(".closeorderinf").click(function(){
	    $(".maskLayer").hide();
	    $(".maskLayer .popup").hide();
	    $(".maskLayer .popup5").hide();
	});


	$(".popup6 .popupTitle a").click(function(){
	    $(".maskLayer").hide();
	    $(".maskLayer .popup6").hide();
	});

	$(".popup .popupCon .popuptitle ul").on("click"," li .seeAnnex",function(){
	    $(".maskLayer .popup").hide();
	    $(".maskLayer .popup6").show();

	    $(".maskLayer").show();
	    var orderinf = {
	        refId: seeOrderDetailId
	    };
	    $.ajax({
	        url: omsUrl + '/select/orderReceiptImgBase64?token=' + logininf.token + '&timeStamp=' + logininf.timeStamp,
	        type: "post",
	        data: JSON.stringify(orderinf),
	        contentType: 'application/json',
	        success: function(data) {
	            //改变状态成功   隐藏弹窗
	           // console.log(data);
	            var imgLiEle = "";
	            if(data.result == "" ||data.result == null || data.result == "null"){
	                imgLiEle = "暂无附件图片";
	            }else{
	                for(var i = 0; i < data.result.length;i++){
	                    imgLiEle += '<li><img src="'+ ImgWebsite + data.result[i].extValue +'" alt="" /></li>'
	                }
	            }
	            $(".popup5 .imgList").html(imgLiEle);
	        }
	    });
	});

	var seeOrderDetailId = "";

	$(".orderList .listCon").on("click",".listItem",function(){
	    var orderid = $(this).attr("orderId");
		var orderStatus = $(this).attr("orderStatus");
        location.href = "strutsAction.html?orderid="+orderid+"&orderStatus="+orderStatus;
		// var objectId = "";
        // getRequest(umsUrl + '/query/objectByUser.json?token=' + logininf.token + "&userId=" + logininf.userId + "&objectType=menu&parentObjectCode=TENAPARTYMOBILE", function (data) {
        //     for (var i=0; i <data.result.length;i++) {
        //         if(data.result[i].objectCode == '/strutsAction.html'){
        //             objectId = data.result[i].umObjectId;
        //             location.href = "strutsAction.html?objectId="+objectId+"&orderid="+orderid+"&orderStatus="+orderStatus;
        //             break;
        //         }
        //     }
        // });

	});




//	$(".orderList .listCon").on("click",".listItem .getLocationLi",function(e){
//		e.stopPropagation();
//		e.preventDefault();
//		var itemOrderId = $(this).parents(".listItem").attr("orderid");
//		var sendaddress =  $(this).parents(".listItem").find(".sendaddress").val();
//		localStorage.setItem("itemOrderId",itemOrderId);
//		console.log(sendaddress);
//		location.href = "map.html"
//	})

	function p(s) {
	    return s < 10 ? '0' + s: s;
	}

    function getCurrentTime2(mouthParmes){
        var date1 = new Date();
        date1.setMonth(date1.getMonth() - mouthParmes);
        var year1 = date1.getFullYear();
        var month1 = date1.getMonth() + 1;
        var day = date1.getDate();
        var sDate;
        month1 = (month1 < 10 ? "0" + month1 : month1);
        day = (day < 10 ? ('0' + day) : day);
        var sDate = (year1.toString() + '-' + month1.toString() + '-' + day.toString());
        return sDate;
    }

})
