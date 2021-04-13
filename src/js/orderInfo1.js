$(function(){
    // 获取当前位置
    getLocationFun();
	//SLDO1806061018370300
	var currentOrderid = GetQueryString("orderid");
	var currentOrderStatus = GetQueryString("orderStatus");
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}
	if(currentOrderStatus == "0"){
		$(".container").show();
		$(".header .txt").html("司机正在送货");
		$("title").html("司机正在送货");
	}else if(currentOrderStatus == "1"){
		$(".container").hide();
		
		$(".header .txt").html("订单已完成");
		$("title").html("订单已完成");
	}

	/* 微信中不隐去.header */
	var ua = window.navigator.userAgent.toLowerCase();
	/*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		$(".header").show();
	}else{

	}*/
	var logininf =  JSON.parse(localStorage.getItem("logininf"));
	
	$(".orderInfList").on("click"," .itemCon .seeAnnex",function(){
		$(".maskLayer").show();
	})
	$(".popupTitle a").click(function(){
		$(".maskLayer").hide();
	})

    //初始化地图对象，加载地图
    var map = new AMap.Map("container", {
        resizeEnable: true,
        mapStyle: 'amap://styles/692385c0456b39aa7ddc41e56c88596f',
        zoom: 13 //地图显示的缩放级别
    });
    function getCurrentLocationCode(locationCode){
    	var carCurrentLocation = locationCode.split(",");
    	if(currentOrderStatus == "0"){
            map.setZoomAndCenter(13, [carCurrentLocation[0], carCurrentLocation[1]]); //同时设置地图层级与中心点
		    amapMarker(carCurrentLocation[0], carCurrentLocation[1]);
	    }
    }
    var sfrLocationCode1 = "";
    //获取订单信息
	$.ajax({
		url: omsUrl + '/wx/get/OrderInfoDetail?token='+logininf.token+'&timeStamp='+logininf.timeStamp+"&orderId="+currentOrderid,
		type:"get",
	    success: function(data) {
	    	var eOrderList = data.result.houseOrderList;
	    	if(eOrderList == "" || eOrderList == "null" || eOrderList == null){
	    		
	    	}else{
	    		getEOrderList(eOrderList)
	    	}
	    	//getCommodityList(data.result.orderItemList);
	    	getOrderInfo(data.result);
	    	sfrLocationCode1 = data.result.sfrLatLng;
	    	//getOrderReceiptImg(data.result.extList)
	    }
	})
	
	function getEOrderList(data){
		var eorderlistHtml = "";
		for(var i = 0;i < data.length;i++){
			var sonNumber = data[i].orderNo;
	    	eorderlistHtml += '<div class="listItem" sonOrderId ='+data[i].omOrderId+' sfrcode='+data[i].sfrLocationCode+'>'+
							'<p class="title">子单号： '+sonNumber+'</p>'+
							'<div class="inflistCon">'+
							'<div class="infoItem deliveryInfo">'+
								'<h3 class="itemTitle">配送信息</h3>'+
								'<div class="itemCon">'+
								'</div>'+
							'</div>'+
							'<div class="infoItem pictureInfo">'+
								'<h3 class="itemTitle">附件图片</h3>'+
								'<div class="itemCon">'+
									'<p class="inf seeAnnex">'+
									'</p>'+
								'</div>'+
							'</div>'+
							'<div class="infoItem commodityInfo">'+
								'<h3 class="itemTitle">商品信息</h3>'+
								'<div class="itemSortCon">'+
									'<ul class="sortTitle">'+
										'<li>品名</li>'+
										'<li>件.毛.体</li>'+
									'</ul>'+
									'<div class="sortList">'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="infoItem logisticsInfo">'+
								'<h3 class="itemTitle">物流信息</h3>'+
								'<div class="itemCon">'+
									'<ul>'+
									'</ul>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'
			
		}
		$(".orderInfList").html(eorderlistHtml);
	}
	
	$(".orderInfList").on("click",".listItem .title",function(){
		$(".inflistCon #container").remove();
		$(".inflistCon").hide();
		$(this).siblings(".inflistCon").show();
		var sonOrderId = $(this).parents(".listItem").attr("sonOrderId");
		$(this).siblings(".inflistCon").prepend('<div class="container" style="width: 100%; height: 30vh;" id="container"></div>');
		$.ajax({
			url: omsUrl + '/wx/get/houseOrderInfoDetail?token='+logininf.token+'&timeStamp='+logininf.timeStamp,
		    type:"post",
		    data:{
		    	orderId:sonOrderId
		    },
		    success: function(data) {
		    	//商品列表
		    	getCommodityList(data.result.orderItemList);
		    	//配送信息
		    	getDistributionInf(data.result.orderParty);
		    	//物流信息
		    	getLogisticsInfo(data.result.actInfoModel.actList);
		    	//图片信息
		    	getOrderReceiptImg(data.result.imgList)
		    	//获取地图
		    	if(data.result.actInfoModel.actCurrent.latLng == "" || data.result.actInfoModel.actCurrent.latLng == null ||data.result.actInfoModel.actCurrent.latLng == "null"){
                    if(sfrLocationCode1 != null){
                        getCurrentLocationCode(sfrLocationCode1);
                    }
		    	}else{
                    if(data.result.actInfoModel.actCurrent.latLng != null){
                        getCurrentLocationCode(data.result.actInfoModel.actCurrent.latLng);
                    }
		    	}
		    	
		    }
		})
	})
	
	//获取图片信息
	function getOrderReceiptImg(receiptImgList){
		var imgLiEle = "";
    	var imgListPic = "";
    	if(receiptImgList == "" ||receiptImgList == null || receiptImgList == "null"){
			imgLiEle = "暂无附件图片";
		}else{
			for(var i = 0; i < receiptImgList.length;i++){
				imgLiEle += '<span><img src="'+ ImgWebsite + receiptImgList[i].extValue+'" alt="" /></span>'
				imgListPic += ' <li class="swiper-slide"><img src="'+ ImgWebsite + receiptImgList[i].extValue+'" alt="" /></li>'
			}
		}
		
		$(".pictureInfo .itemCon .seeAnnex").html(imgLiEle);
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
	
	$(".orderInfo .infoItem .itemCon .seeAnnex").click(function(){
		$(".maskLayer").show();
	})
	$(".popupTitle a").click(function(){
		$(".maskLayer").hide();
	})
	//获取商品列表
	function getCommodityList(orderitemlist){
		var commodityItem = "";
		for(var i = 0; i < orderitemlist.length;i++){
			commodityItem += '<ul>'+
								'<li>'+orderitemlist[i].itemName+'</li>'+
								'<li>'+orderitemlist[i].qty +'*'+orderitemlist[i].weight +'*'+orderitemlist[i].volume+'</li>'+
							'</ul>'
		}
		$(".commodityInfo .sortList").html(commodityItem);
	}
	//获取物流信息
	function getLogisticsInfo(logisticslist){
		var logisticsLi = "";
		var statusArr = {"INIT":"初始化","DIST":"派发","RECV":"接收","COFM":"确认","DONE":"完成","LONT":"装车","DCHT":"卸车","ACPT":"验收 ","RJCT":"拒收","SPLIT":"拆单","FREEZE":"冻结","ACTIVE":"激活","EXCP_HANDLED":"异常处理","EXCE_GO_ON":"异常可执行","EXCE_STOP":"异常不执行"}
		for(var i = 0; i < logisticslist.length;i++){
			//RECV 接收      COFM 确认      SENT 已发出      RJCT 拒收      ACPT 验收   DCHT 卸车     LONT 装车    SEND 发送     DONE 完成   INIT 初始化  EXCP 异常
			for(var key in statusArr){
				if(logisticslist[i].actCode == key){
					logisticslist[i].actCode = statusArr[key];
				}
			}
			logisticsLi += '<li>'+
								'<span class="txt">'+logisticslist[i].actCode+'</span>'+
								'<p class="inf">'+timestampToTime(logisticslist[i].actTime)+'</p>'+
							'</li>'
		}
		$(".logisticsInfo .itemCon ul").html(logisticsLi);
	}
	
	//获取配送信息
	function getDistributionInf(orderinfo){
		$(".driver").remove();
		var deliveryinfo = '<li class="driver">'+
								'<span class="txt">配送司机</span>'+
								'<p class="inf"><a href="tel:'+orderinfo.carDrvContactTel+'">'+orderinfo.carDrvContactName+'</a> （'+orderinfo.carDrvEqpNo+'）</p>'+
							'</li>'
		$(".deliveryInfo .itemCon ul").append(deliveryinfo);
	}
	
	//获取订单信息
	function getOrderInfo(orderinfo){
		var deliveryinfo = '<ul>'+
								'<li>'+
									'<span class="txt">收货地址</span>'+
									'<p class="inf">'+orderinfo.stoAddress+'<br /> '+orderinfo.stoContactName+ ' ' + orderinfo.stoContactTel+'</p>'+
								'</li>'+
								'<li>'+
									'<span class="txt">配送方</span>'+
									'<p class="inf">'+orderinfo.carPartyName+'</p>'+
								'</li>'+
							'</ul>'
		
		if(orderinfo.payStatus == "0"){
			orderinfo.payStatus = "未支付"
		}else if(orderinfo.payStatus == "1"){
			orderinfo.payStatus = "已支付"
		}else if(orderinfo.payStatus == "2"){
			orderinfo.payStatus = "部分支付"
		}
		
		if(orderinfo.actCode == "DIST"){
			orderinfo.actCode = "接单"
		}else if(orderinfo.actCode == "COFM"){
			orderinfo.actCode = "装车"
		}else if(orderinfo.actCode == "LONT"){
			orderinfo.actCode = "配送"
		}else if(orderinfo.actCode == "ACPT"){
			orderinfo.actCode = "签收"
		}else if(orderinfo.actCode == "EXCP"){
            orderinfo.actCode = "异常"
        }
		
		if(orderinfo.exceptionStatus == "1" || orderinfo.exceptionStatus == "2"){
			orderinfo.exceptionStatus = "异常";
			if(orderinfo.exceRemarkList == "" || orderinfo.exceRemarkList == null || orderinfo.exceRemarkList == "null"){
				var actRemark = ["-","-","-","-"]
			}else{
				var actRemarkLen = orderinfo.exceRemarkList.length - 1;
				var actRemark = orderinfo.exceRemarkList[actRemarkLen].note.split(",");
			}
			var abnormalDes = '<li>'+
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
								'</li>'
								
		}else{
			orderinfo.exceptionStatus = "正常";
			var abnormalDes = "";
		}
		var paymentItem = "";
		if(orderinfo.payment == "spot"){
			paymentItem += '<li>'+
				'<span class="txt">付款方式</span>'+
				'<p class="inf">现付</p>'+
				'</li>'
		}else if(orderinfo.payment == "collect"){
			paymentItem += '<li>'+
				'<span class="txt">付款方式</span>'+
				'<p class="inf">到付</p>'+
				'</li>'
		}else if(orderinfo.payment == "voucher"){
			paymentItem += '<li>'+
				'<span class="txt">付款方式</span>'+
				'<p class="inf">凭单回复</p>'+
				'</li>'
		}
		var orderdetailinfo = '<ul>'+
								'<li>'+
									'<span class="txt">订单号</span>'+
									'<p class="inf">'+orderinfo.orderNo+'</p>'+
								'</li>'+
								'<li>'+
									'<span class="txt">原单号</span>'+
									'<p class="inf">'+orderinfo.customerOriginalNo+'</p>'+
								'</li>'+
								'<li>'+
									'<span class="txt">当前状态</span>'+
									'<p class="inf">'+orderinfo.actCode+'</p>'+
								'</li>'+
								'<li>'+
									'<span class="txt">下单时间</span>'+
									'<p class="inf">'+timestampToTime(orderinfo.createTime)+'</p>'+
								'</li>'+
								'<li>'+
									'<span class="txt">正常/异常</span>'+
									'<p class="inf">'+orderinfo.exceptionStatus+'</p>'+
								'</li>'+
								paymentItem+
								'<li>'+
									'<span class="txt">支付状态</span>'+
									'<p class="inf">'+orderinfo.payStatus+'</p>'+
								'</li>'+ abnormalDes +
							'</ul>'
		$(".deliveryInfo .itemCon").html(deliveryinfo);
		$(".orderDetailInfo .itemCon").html(orderdetailinfo);
	}
	
	//添加点标记，并使用自己的icon
 	function amapMarker(locationCode1,locationCode2){
 		new AMap.Marker({
	        map: map,
			position: [locationCode1,locationCode2],
	        icon: new AMap.Icon({            
	            size: new AMap.Size(40, 50),  //图标大小
		        image: "images/car_icon.png",  // 图片路径
		        imageOffset: new AMap.Pixel(0, -60)
	        })        
	    });
 	}
 	
 	function timestampToTime(timestamp) {
		var offsetMs = new Date().getTimezoneOffset() * 60 * 1000;
		var currentTime = timestamp - offsetMs;
		var date = new Date(currentTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	    Y = date.getFullYear() + '-';
	    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	    D = date.getDate() < 10 ? '0'+ date.getDate() + ' ' : date.getDate() + ' ';
	    h = date.getHours() < 10 ? '0'+ date.getHours() + ":" : date.getHours() + ':';
	    m = date.getMinutes() < 10 ? '0'+ date.getMinutes() + ":": date.getMinutes() + ':';
	    s = date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds();
	    return Y+M+D+h+m+s;
	}
    
})
