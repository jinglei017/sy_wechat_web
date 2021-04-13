$(function(){
    // 获取位置信息上传
    getLocationFun();
    var logininf = JSON.parse(localStorage.getItem("logininf"));

	var partname = window.location.pathname;
	$(".header .right").click(function(){
    	$(".searchLayer").show();
    	$(".searchCon ul li .orderNo").val("")
		$(".searchCon ul li .trackingNo").val("")
		$(".searchCon ul li .statusSelect").val("")
		$("#startTime").val("");
		$("#endTime").val("");
    })
	/* 微信中不隐去.header */
	var ua = window.navigator.userAgent.toLowerCase();
	/*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		$(".header").show();
	}*/
	function GetQueryString(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
	var searchOrderNum = GetQueryString("searchordernum");

	var pageNumVal = 1;

	var totalNum = 0;

	var pageInf = "";

	$(".maskLayer .popupTitle a").click(function(){
		$(".maskLayer .popup5").hide();
		$(".maskLayer").hide();
	})

	if(partname == "//allOrder5.html" || partname == "/allOrder5.html"){
		if(searchOrderNum == "" || searchOrderNum == null || searchOrderNum == "null"){
			pageInf = {
				"carDrvContactTel":logininf.mobilePhone,
			//	"startCompleteTime":getCurrentTime("+3"),
                "startCompleteTime":getQueryTime(14),
				"endCompleteTime":getCurrentTime("0"),
				"pageInfo": {
					pageNum: pageNumVal,
					pageSize: 20
				}
			};
		}else{
			pageInf = {
				"carDrvContactTel":logininf.mobilePhone,
				"orderNo":searchOrderNum,
			//	"startCompleteTime":getCurrentTime("+3"),
                "startCompleteTime":getQueryTime(14),
				"endCompleteTime":getCurrentTime("0"),
				"pageInfo": {
					pageNum: pageNumVal,
					pageSize: 20
				}
			};
		}
		orderListFun();
		clickbtnTxt = "上传图片"
	}

	var uploadImgOrderId = "";
	var uploadImgOrderNum = "";
	var orderReceiptImgList = "";
	// 全部订单 —— 上传图片 按钮
	$(".main .orderCon .orderList").on("click", "li .orderHandle .truck1", function(e) {
		$(".abnormalorderbtn").removeClass("pointAndClick");
		e.preventDefault();
		e.stopPropagation();
		var orderid = $(this).parents("li").attr("orderid");
		var ordernum = $(this).parents("li").attr("ordernum");
		imgUrl = [];
		uploadImgOrderId = $(this).parents("li").attr("orderid");
		uploadImgOrderNum =  $(this).parents("li").attr("ordernum");
		$(".maskLayer .popup2").hide();
		$(".maskLayer .popup7").hide();
		$(".maskLayer .popup5").show();
		$(".popup5 .imgList").html('<li class="lastLi"><img src="images/cameraIcon.png" alt="" /></li>');
		$(".maskLayer").show();
		//icdp-oms-app-1.0.0/select/OrderReceiptImgBase64.json
		$.ajax({
			url: omsUrl + '/driver/query/OrderInfoDetail?orderId='+orderid+'&orderNo='+ordernum,
			type: "get",
            beforeSend:function(){
                loadData('show');
            },
			success: function(data) {
				//改变状态成功   隐藏弹窗
			//	console.log(data);
				var imgLiEle1 = "";
				if(data.result.extList.length == 0){
					imgLiEle1 = "<p style='text-align:left;'>上传图片</p>";
				}else{
					for(var i = 0; i < data.result.extList.length;i++){
						imgLiEle1 += '<li><img src="'+ ImgWebsite + data.result.extList[i].extValue +'" alt="" /></li>'
					}
				}
				$(".popup5 .imgList").prepend(imgLiEle1);
                loadData('hide');
			}
		})
	})


	var imgUrl = [];
	var imgStatus = 0;
	$(".maskLayer .popup5 .uploadSeal").on("click",".lastLi",function(){
		wx.chooseImage({
	        count: 9, // 默认9
	        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
	        success: function (res) {
	            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
	 			var imgli = "";
	            var realLocalIds = localIds.toString().split(',');
	            var mediaIdArray = '';
	            for(var i=0;i< realLocalIds.length;i++){
	            	imgli += '<li><img src="'+realLocalIds[i]+'" alt="" /></li>'
	    	        wx.getLocalImgData({
						localId: realLocalIds[i], // 图片的localID
						success: function (res) {
							imgStatus = 1;
							var localData = res.localData; //localData是图片的base64数据，可以用img标签显示
							var u = navigator.userAgent;
					        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
					        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
					        if(isAndroid){
					        	var resultStr = localData.replace(/[\r\n]/g, ""); //去掉回车换行
					        	imgUrl.push(resultStr);
					        }else{
					            imgUrl.push(localData.split(',')[1])
					        }
						}
					});
	            }
	            $(".uploadSealBtn").append(imgli);
	        }
	    });
	})

	// 确认上传图片的时候  将imgUrl提交即可
	$(".maskLayer .popup5 .popupBot2 .abnormalorderbtn").click(function(){
		if(imgUrl.length > 19){
			loadData("show","每次最多上传20张图片",true)
			return false;
		}
		if($(this).hasClass("pointAndClick")){
			console.log(1);
		}else{
			if(imgStatus == 1){
				$(this).addClass("pointAndClick");
				var list = [];
				list.push({
					orderId:uploadImgOrderId,
					orderNo:uploadImgOrderNum,
					imgBase64: imgUrl
				})
				console.log(list);
				$.ajax({
					url: omsUrl + '/driver/save/submitOrderActInfo',
					type: "post",
                    beforeSend:function(){
                        loadData('show');
                    },
					data: JSON.stringify(list),
					contentType: 'application/json',
					success: function(data) {
						console.log(data);
						//改变状态成功   隐藏弹窗
						$(".maskLayer").hide();
						$(".maskLayer .popup5").hide();
                        loadData('hide');
					}
				})
			}else{
				loadData("show","请先上传图片",true)
			}
		}
	})


	$(".maskLayer .popup5 .popupBot2 .normalorderbtn").click(function(){
		$(".maskLayer").hide();
		$(".maskLayer .popup5").hide();
		$(".abnormalorderbtn").removeClass("pointAndClick");
	})

	var tasklistData = [];
	function orderListFun() {
		$.ajax({
			url: tmsUrl + '/driver/query/DriverHeadOrderTaskInfoPage',
			type: "post",
			contentType: 'application/json',
			beforeSend:function(){
	           $(".main").append('<div class="ajax-loder-wrap"><img src="../images/ajax-loader.gif" class="ajax-loader-gif"/><p class="loading-text">加载中...</p></div>');
			},
			data: JSON.stringify(pageInf),
			success: function(data) {
				totalNum = data.pageInfo.pages
				$(".ajax-loder-wrap").remove();
				var orderData = data.result;
				var orderlist = "";
				var paymentItem = "";
				var classname = "";
				tasklistData = data.result;
				if(data.result.length == 0){
					var timer1 = setTimeout(function(){
						$(".orderCon").append('<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;">'+
											'<img src="images/noContent.png" alt=""  style="width: 3rem; height: auto; display: block;"/>'+
									'</p>');
					},600)
				}else{
					for(var i = 0; i < data.result.length; i++) {
						if(data.result[i].exceptionStatus == "1" || data.result[i].exceptionStatus == "2" ){
							classname = "excpli"
						}else{
							classname = "";
						}
						if(data.result[i].actCode == "DIST"){
							data.result[i].actCode = "接单"
						}
						if(data.result[i].actCode == "COFM"){
							data.result[i].actCode = "装车"
						}
						if(data.result[i].actCode == "LONT"){
							data.result[i].actCode = "配送"
						}
						if(data.result[i].actCode == "ACPT"){
							data.result[i].actCode = "签收"
						}

						if(data.result[i].actCode == "EXCP"){
							data.result[i].actCode = "异常"
						}
						//单位换算
						//体积
						if(data.result[i].volumeUnit == "CM3"){
							//console.log("1");
							data.result[i].totalVolume = (data.result[i].totalVolume/parseInt(1000000)).toFixed(2);
						}

						//重量
						if(data.result[i].weightUnit == "TN"){
							//console.log("2");
							data.result[i].totalWeight = (data.result[i].totalWeight*parseFloat(0.4535924)).toFixed(2);
						}else if(data.result[i].weightUnit == "LB"){
							//console.log("3");
							data.result[i].totalWeight = (data.result[i].totalWeight*parseFloat(1000)).toFixed(2);
						}

						//价值
						if(data.result[i].currency == "USD"){
							data.result[i].totalAmount = (data.result[i].totalAmount*parseFloat(6.5191)).toFixed(2);
						}

						// 付款方式
						if(orderData[i].payment == "spot"){
							paymentItem += '<p class="receiverAddress">收款方式：现付</p>'
						}else if(orderData[i].payment == "collect"){
							paymentItem += '<p class="receiverAddress">收款方式：到付</p>'
						}else if(orderData[i].payment == "voucher"){
							paymentItem += '<p class="receiverAddress">收款方式：凭单回复</p>'
						}
						orderlist += '<li class="'+classname+'" ordernum=' + orderData[i].orderNo + ' orderid=' + orderData[i].omOrderId + ' actCode=' + orderData[i].actCode + ' >'+
										'<input type="hidden" class="weightnum" value="'+orderData[i].totalWeight+'" />'+
										'<input type="hidden" class="weightunit" value="'+orderData[i].weightUnit+'" />'+
										'<input type="hidden" class="volumenum" value="'+orderData[i].totalVolume+'" />'+
										'<input type="hidden" class="volumeunit" value="'+orderData[i].volumeUnit+'" />'+
										'<input type="hidden" class="amountnum" value="'+orderData[i].totalAmount+'" />'+
										'<div class="right">'+
											'<p class="ordernum">订单号：'+orderData[i].orderNo+'</p>'+
											'<p class="ordernum"style="line-height:0.36rem;height:0.4rem;">原单号：'+orderData[i].customerOriginalNo+'</p>'+
											'<p class="ordernum"style="line-height:0.36rem;height:0.4rem;">班次号：'+orderData[i].tfoOrderNo+'</p>'+
											'<p class="receiverAddress">客户：'+orderData[i].stoPartyName+' &nbsp;&nbsp;配送日期：'+timestampToTime1(orderData[i].shpDtmTime)+' &nbsp;&nbsp;</p>'+
											'<p class="receiverAddress">当前状态：'+orderData[i].actCode+'</p>'+
											'<p class="receiverAddress">收货地址：'+orderData[i].stoAddress+'</p>'+paymentItem+
										'</div>'+
										'<div class="orderHandle">'+
											'<a href="javascript:;" class="truck1">'+clickbtnTxt+'</a>'+
											'<p class="photo">'+
												'<img src="images/top_pic.png" alt="" />'+
												'<span class="txt">上传附件图片</span>'+
											'</p>'+
										'</div>'+
										'<p class="round"></p>'+
									'</li>'

					}

					$(".main .orderCon .orderList").append(orderlist);

				}
			},
			error: function(xhr) {
				// markmsg("不存在此账户");
			}
		})
	}
	//获取任务数据 结束


	//关闭订单详细弹窗
	$(".maskLayer .popup3 .popupCon .infHint .closeorderinf").click(function(){
		$(".maskLayer").hide();
		$(".maskLayer .popup3").hide();
	})

	//关闭订单提交弹窗
	$(".maskLayer .popup2 .orderCon .closebtn").click(function(){
		$(".maskLayer").hide();
		$(".maskLayer .popup2").hide();
	})

	$(".maskLayer .popup7 .orderCon .closebtn").click(function(){
		$(".maskLayer").hide();
		$(".maskLayer .popup7").hide();
		$(".maskLayer .popup7 .orderDesc .orderTextBox").hide();
	})

	$(".popup3 .popupCon .popuptitle ul").on("click","li .seeAnnex span",function(){
		$(".popup3").hide();
		$(".popup6").show();
	})


	$(".maskLayer .popup6 .popupTitle a").click(function(){
		$(".popup6").hide()
		$(".maskLayer").hide();
	})


	//输入搜索条件查询
	$(".searchCon .searchbtn").click(function(){
		getSearchInf("1");
	})

	$(".mouthSearch p").click(function(){
		$(this).addClass("active");
		$(this).siblings().removeClass("active");
		if($(this).index() == 0){
			getSearchInf("0","+3","0");
		}else if($(this).index() == 1){
			getSearchInf("0","+6","+3");
		}
	})

	//搜索
	function getSearchInf(isGetTime,startmouthnum,endmouthnum){
		$(".main .orderCon .orderList").html("");
		$(".noContent").remove();
		$(".searchLayer").hide();
		console.log($("#startTime").val());
		pageNumVal = 1;
		totalNum = 1;
		var orderNoInp = $(".searchCon ul li .orderNo").val().trim();
		var trackingNoInp = $(".searchCon ul li .trackingNo").val().trim();
		var actCodeSelect = $(".searchCon ul li .statusSelect").val().trim();
		var exceptionStatus = $(".searchCon ul li .abnormalStatus").val();
		if(exceptionStatus == ""){
			pageInf.isException = "";
			pageInf.isNoException = "";
		}else if(exceptionStatus == 1){
			pageInf.isException = true;
			pageInf.isNoException = false;
		}else if(exceptionStatus == 0){
			pageInf.isNoException = true;
			pageInf.isException = false;
		}
		var startCreateTime = $("#startTime").val().trim();
		var endCreateTime = $("#endTime").val().trim();
		console.log(trackingNoInp);
		if(isGetTime == 1){
			if(startCreateTime == "" || startCreateTime == "null" || startCreateTime == null){

			}else{
				pageInf.startCompleteTime = startCreateTime
			}

			if(endCreateTime == "" || endCreateTime == "null" || endCreateTime == null){

			}else{
				pageInf.endCompleteTime = endCreateTime
			}
		}else{
			pageInf.endCompleteTime = getCurrentTime(endmouthnum);
			pageInf.startCompleteTime = getCurrentTime(startmouthnum);
		}
		console.log(123);
		pageInf.carDrvContactTel = logininf.mobilePhone
		pageInf.orderNo = orderNoInp
		pageInf.trackingNo = trackingNoInp
		pageInf.actCode = actCodeSelect
		pageInf.pageInfo.pageNum = "1";
		orderListFun();
		clickbtnTxt = "上传图片"
	}



	$(".main").scroll(function(){
		var scrollNum = document.documentElement.clientWidth / 7.5;
        if($(".main .orderList").outerHeight() - $(".main").scrollTop() - $(".main").height() < 10){
            if($(".ajax-loder-wrap").length > 0){
                return false;
            }
			if(pageNumVal < totalNum){
				pageNumVal = parseInt(pageNumVal) + parseInt(1)
				pageInf.pageInfo.pageNum = pageNumVal;
				orderListFun()
			}
		}
	})


	var seeOrderDetailId = "";

	//点击获取详情
	$(".main .orderCon").on("click",".orderList li",function(e){
		var orderid = $(this).attr("orderid");
		var ordernum = $(this).attr("ordernum");
		$(".maskLayer").show();
		$(".maskLayer .popup3").show();
		$.ajax({
			url: omsUrl + '/driver/query/OrderInfoDetail?orderId='+orderid+'&orderNo='+ordernum,
			type: "get",
            beforeSend:function(){
                loadData('show');
            },
			success: function(data) {
				getGoodsList(data.result.orderItemList);
				getOrderReceiptImg(data.result.imgList);
				getOrderBaseInf(data.result);
				orderReceiptImgList = data.result.imgList;
                loadData('hide');
			}
		})
	})

	function getGoodsList(goodslistData){
		var sortList = "";
		for(var i = 0; i < goodslistData.length;i++){
			sortList += '<ul>'+
							'<li>'+goodslistData[i].itemName+'</li>'+
							'<li>x'+goodslistData[i].qty+'</li>'+
							'<li>'+goodslistData[i].weight+'</li>'+
						'</ul>'
		}
		$(".ordersortList").html(sortList);
	}


	var imgLiEle = "";
	function getOrderReceiptImg(receiptImgList){
		imgLiEle = "";
    	var imgListPic = "";
    	if(receiptImgList == "" ||receiptImgList == null || receiptImgList == "null"){
			imgLiEle = "暂无附件图片";
		}else{
			for(var i = 0; i < receiptImgList.length;i++){
				imgLiEle += '<span><img src="'+ ImgWebsite + receiptImgList[i].extValue+'" alt="" /></span>'
				imgListPic += ' <li class="swiper-slide"><img src="'+ ImgWebsite + receiptImgList[i].extValue+'" alt="" /></li>'
			}
		}

		$(".maskLayer .popup5 .imgList").html(imgListPic);
		$(".swiper-container .imgList").html(imgListPic);
		var swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
			slidesPerView: 1,
			paginationClickable: true,
			spaceBetween: 30,
			loop: true,
			observer:true,
			observeParents:true
		});
	}

	function getOrderBaseInf(tasklistData){
		if(tasklistData.exceRemarkList == "null" || tasklistData.exceRemarkList == null || tasklistData.exceRemarkList == ""){
			var actRemark = ["-","-","-","-"];
		}else{
			var actRemarkLen = tasklistData.exceRemarkList.length - 1;
			console.log(actRemarkLen);
			console.log(tasklistData.exceRemarkList[actRemarkLen]);
			//var actRemark = tasklistData[i].actRemark
			var actRemark = tasklistData.exceRemarkList[actRemarkLen].note.split(",");
		}

		if(tasklistData.exceptionStatus == "0"){
			tasklistData.exceptionStatus = "正常";
		}
		if(tasklistData.stoAddress == "null" || tasklistData.stoAddress == null){
			tasklistData.stoAddress = "-"
		}

		if(tasklistData.sfrAddress == "null" || tasklistData.sfrAddress == null){
			tasklistData.sfrAddress = "-"
		}

		if(tasklistData.actCode == "DIST"){
			tasklistData.actCode = "接单"
		}else if(tasklistData.actCode == "COFM"){
			tasklistData.actCode = "装车"
		}else if(tasklistData.actCode == "LONT"){
			tasklistData.actCode = "配送"
		}else if(tasklistData.actCode == "ACPT"){
			tasklistData.actCode = "签收"
		}else if(tasklistData.actCode == "EXCP"){
            tasklistData.actCode = "异常"
        }

		if(tasklistData.payStatus == "0"){
			tasklistData.payStatus = "未支付"
		}else if(tasklistData.payStatus == "1"){
			tasklistData.payStatus = "已支付"
		}else if(tasklistData.payStatus == "2"){
			tasklistData.payStatus = "部分支付"
		}

		//异常订单详细页面展示
		if(tasklistData.exceptionStatus == "1" || tasklistData.exceptionStatus == "2" || tasklistData.exceptionStatus == "异常"){
			tasklistData.exceptionStatus = "异常"
			var orderdetail = '<li>'+
							'<span class="txt">订单号</span>'+
							'<p class="inf">'+tasklistData.orderNo+'</p>'+
						'</li>'+
						'<li>'+
							'<span class="txt">原单号</span>'+
							'<p class="inf">'+tasklistData.customerOriginalNo+'</p>'+
						'</li>'+
						'<li>'+
							'<span class="txt">班次号</span>'+
							'<p class="inf">'+tasklistData.tfoOrderNo+'</p>'+
						'</li>'+
						'<li>'+
							'<span class="txt">收货地址</span>'+
							'<p class="inf">'+tasklistData.stoAddress+'</p>'+
						'</li>'+

						'<li>'+
							'<span class="txt">订单当前状态</span>'+
							'<p class="inf">'+tasklistData.actCode+'</p>'+
						'</li>'+

						'<li>'+
							'<span class="txt">订单是否异常</span>'+
							'<p class="inf">'+tasklistData.exceptionStatus+'</p>'+
						'</li>'+

						'<li>'+
							'<span class="txt">异常描述</span>'+
							'<p class="inf">'+actRemark[0]+'</p>'+
						'</li>'+

						'<li>'+
							'<span class="txt">处理意见</span>'+
							'<p class="inf">'+actRemark[1]+'</p>'+
						'</li>'+

						'<li>'+
							'<span class="txt">客户姓名</span>'+
							'<p class="inf">'+actRemark[2]+'</p>'+
						'</li>'+

						'<li>'+
							'<span class="txt">客户电话</span>'+
							'<p class="inf">'+actRemark[3]+'</p>'+
						'</li>'+

						'<li>'+
							'<span class="txt" style="display:block;float:none;">附件图片</span>'+
							'<p class="inf seeAnnex">'+ imgLiEle +'</p>'+
						'</li>'

		}else{
			console.log("imgLiEle" + imgLiEle);
			tasklistData.exceptionStatus = "正常";
			var orderdetail = '<li>'+
								'<span class="txt">订单号</span>'+
								'<p class="inf">'+tasklistData.orderNo+'</p>'+
							'</li>'+
							'<li>'+
								'<span class="txt">原单号</span>'+
								'<p class="inf">'+tasklistData.customerOriginalNo+'</p>'+
							'</li>'+
							'<li>'+
								'<span class="txt">班次号</span>'+
								'<p class="inf">'+tasklistData.tfoOrderNo+'</p>'+
							'</li>'+
							'<li>'+
								'<span class="txt">收货地址</span>'+
								'<p class="inf">'+tasklistData.stoAddress+'</p>'+
							'</li>'+

							'<li>'+
								'<span class="txt">订单当前状态</span>'+
								'<p class="inf">'+tasklistData.actCode+'</p>'+
							'</li>'+

							'<li>'+
								'<span class="txt">订单是否异常</span>'+
								'<p class="inf">'+tasklistData.exceptionStatus+'</p>'+
							'</li>'+

							'<li>'+
								'<span class="txt">支付状态</span>'+
								'<p class="inf">'+tasklistData.payStatus+'</p>'+
							'</li>'+
							'<li>'+
								'<span class="txt" style="display:block;float:none;">附件图片</span>'+
								'<p class="inf seeAnnex">'+ imgLiEle +'</p>'+
							'</li>'

		}
		$(".popuptitle ul").html(orderdetail);
	}


	function getCurrentTime(mouthParmes){
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
