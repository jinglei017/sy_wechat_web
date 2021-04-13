$(function(){
	//SLDO1806061018370300
    // 获取当前位置
    getLocationFun();
	var currentOrderid = GetQueryString("orderid");
	var currentOrderStatus = GetQueryString("orderStatus");
	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}

    function publicChangeBtnStatus(){
        var permissionListObj  = [];
        var pageid = GetQueryString("objectId");
        var buttonObj = $(".butOperatePermission");
        getRequest(umsUrl+'/query/objectByUser.json?token='+logininf.token+'&timeStamp='+logininf.timeStamp+"&userId="+logininf.umUserId+"&parentUmObjectId="+pageid,function(res){
            permissionListObj  = res.result;
            for(var i = 0; i < permissionListObj.length; i++){
                for(var j = 0; j < buttonObj.length; j++){
                    if(permissionListObj[i].objectCode == buttonObj.eq(j).attr("buttonCode")){
                        $(".butOperatePermission").eq(j).show();
                    }
                }
            }
        })
    }

	if(currentOrderStatus == "0"){
		$(".container").show();
		$(".header .txt").html("司机正在送货");
		$("title").html("司机正在送货");
	}else if(currentOrderStatus == "1"){
		var ua = window.navigator.userAgent.toLowerCase();
		/*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			$(".header").show();
		}*/
		$(".container").hide();

		$(".header .txt").html("订单已完成");
		$("title").html("订单已完成");
	}

	var logininf =  JSON.parse(localStorage.getItem("logininf"));

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

    //获取订单信息
	$.ajax({
		url: omsUrl + '/wx/get/OrderInfoDetail?token='+logininf.token+'&timeStamp='+logininf.timeStamp+"&orderId="+currentOrderid,
		type:"get",
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
	    	getCommodityList(data.result.orderItemList);
	    	getOrderInfo(data.result);
	    	getExceptionInfo(data.result);
	    	getOrderReceiptImg(data.result.imgList)
	    	getLogisticsInfo(data.result.actInfoModel.actList);
	    	if(data.result.actInfoModel.actCurrent.latLng == "" || data.result.actInfoModel.actCurrent.latLng == null ||data.result.actInfoModel.actCurrent.latLng == "null"){
                if(data.result.sfrLatLng != null){
                    getCurrentLocationCode(data.result.sfrLatLng);
                }
	    	}else{
                if(data.result.actInfoModel.actCurrent.latLng != null){
                    getCurrentLocationCode(data.result.actInfoModel.actCurrent.latLng);
                }
	    	}

	    }
	})


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
    $(".maskLayer1 .title img").click(function(){
        $(".maskLayer1").hide();
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


	function getExceptionInfo(orderinfo){
		if(orderinfo.exceRemarkList == "" || orderinfo.exceRemarkList == null || orderinfo.exceRemarkList == "null"){
			var actRemark = ["-","-","-","-"]
		}else{
			var actRemarkLen = orderinfo.exceRemarkList.length - 1;
			var actRemark = orderinfo.exceRemarkList[actRemarkLen].note.split(",");
		}
		var exceptionDetailInfo = '<ul>'+
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
										'<span class="txt">异常描述</span>'+
										'<p class="inf">'+actRemark[0]+'</p>'+
									'</li>'+
									'<li>'+
										'<span class="txt">司机处理意见</span>'+
										'<p class="inf">'+actRemark[1]+'</p>'+
									'</li>'+
                                    '<li>'+
                                        '<span class="txt">运输组备注</span>'+
                                        '<div class="inf">' +
                                            '<div class="infDiv transport">' +
                                                '<input placeholder="请输入备注" disabled/>' +
                                                '<div class="button">' +
                                                    '<img src="../images/editImg.png" alt="">' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>'+
                                    '</li>'+
                                    '<li>'+
                                        '<span class="txt">白班备注</span>'+
                                        '<div class="inf">' +
                                            '<div class="infDiv day_shift">' +
                                                '<input placeholder="请输入备注" disabled/>' +
                                                '<div class="button">' +
                                                    '<img src="../images/editImg.png" alt="">' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>'+
                                    '</li>'+
                                    '<li>'+
                                        '<span class="txt">夜班备注</span>'+
                                        '<div class="inf">' +
                                            '<div class="infDiv night_shift">' +
                                            '<input placeholder="请输入备注" disabled/>' +
                                                '<div class="button">' +
                                                    '<img src="../images/editImg.png" alt="">' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>'+
                                    '</li>'+
                                    '<li>'+
                                        '<span class="txt">退货备注</span>'+
                                        '<div class="inf">' +
                                            '<div class="infDiv cancel">' +
                                                '<input placeholder="请输入备注" disabled/>' +
                                                '<div class="button">' +
                                                    '<img src="../images/editImg.png" alt="">' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>'+
                                    '</li>'+
                                    '<li>'+
                                        '<span class="txt">盘点备注</span>'+
                                        '<div class="inf">' +
                                            '<div class="infDiv check">' +
                                                '<input placeholder="请输入备注" disabled/>' +
                                                '<div class="button">' +
                                                    '<img src="../images/editImg.png" alt="">' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>'+
                                    '</li>'+
                                    '<li>'+
                                        '<span class="txt">数据备注</span>'+
                                        '<div class="inf">' +
                                            '<div class="infDiv data">' +
                                                '<input placeholder="请输入备注" disabled/>' +
                                                '<div class="button">' +
                                                    '<img src="../images/editImg.png" alt="">' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>'+
                                    '</li>'+
									'<li class="disposeInp">'+
										'<span class="txt">订单处理意见</span>'+
										'<p class="inf"><textarea placeholder="请输入处理意见"></textarea></p>'+
									'</li>'+
								'</ul>'+
								'<p class="disposeBtn" ordernum="'+orderinfo.orderNo+'">处理</p>'
                                // '<p class="disposeBtn butOperatePermission" buttonCode="DISPOSE" ordernum="'+orderinfo.orderNo+'">处理</p>'
		$(".exceptionInfo .itemCon").html(exceptionDetailInfo);

        if(orderinfo.nteList != null && orderinfo.nteList.length>0){
            for(var i=0;i<orderinfo.nteList.length;i++){
                var noteTypeName = orderinfo.nteList[i].noteType.split("_remark")[0];
                var thisDiv = $("."+noteTypeName);
                thisDiv.find("input").val(orderinfo.nteList[i].note);
            }
        }

        // publicChangeBtnStatus();
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
								'<li>'+
									'<span class="txt">配送司机</span>'+
									'<p class="inf"><a href="tel:'+orderinfo.carDrvContactTel+'">'+orderinfo.carDrvContactName+'</a> （'+orderinfo.carDrvEqpNo+'）</p>'+
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
									'<span class="txt">下单时间</span>'+
									'<p class="inf">'+timestampToTime(orderinfo.createTime)+'</p>'+
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

	$(".exceptionInfo").on("click",".disposeBtn",function(){
		var exceptionDesc = $(".exceptionInfo textarea").val();
		if(exceptionDesc.trim() == ""){

		}else{
			var ordernum = $(this).attr("ordernum");
			var list = [];
			list.push({
				orderId: currentOrderid,
				exceptionRemark: exceptionDesc,
				orderNo: ordernum,
				exceptionStatus:3
			})
			$.ajax({
				url: tmsUrl + '/driver/save/submitOrderActInfo',
				type: "post",
                beforeSend:function(){
                    loadData('show');
                },
				data: JSON.stringify(list),
				contentType: 'application/json',
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
					//改变状态成功   隐藏弹窗
					loadData("show","订单异常处理成功",true)
					//$(".disposeInp").hide();
					$(".disposeBtn").hide();
					$(".disposeInp .inf").html(exceptionDesc);
				}
			})
		}
	})

    var jointName = "";
    $(".exceptionInfo").on("click",".button img",function(){
        $(".maskLayer1").show();
        var enterText = $(this);
        jointName = enterText.parents(".infDiv").attr("class").slice(7);
        var text = enterText.parents(".infDiv").find("input").val();
        $(".remarkPopup textarea").val(text);
    });
    $(".maskLayer1 .saveRem").click(function(){
        var remarkVal = $(".remarkPopup textarea").val().trim();
        if(remarkVal == "" || remarkVal == undefined){
            loadData('show', '请输入备注信息',true);
            return false;
        }
        saveRemark('0',remarkVal);
    });
    $(".maskLayer1 .submitRem").click(function(){
        var remarkVal = $(".remarkPopup textarea").val().trim();
        if(remarkVal == "" || remarkVal == undefined){
            loadData('show', '请输入备注信息',true);
            return false;
        }
        saveRemark('1',remarkVal);
    });
    function saveRemark(isDefault,note){
        var noteType = jointName+"_remark";
        var list = [{
            refId: currentOrderid,
            refTo: "om_order",
            noteType: noteType,
            isDefault: isDefault,
            note: note
        }];

        $.ajax({
            url: tmsUrl + '/wx/save/orderNte?token='+logininf.token+'&timeStamp='+logininf.timeStamp,
            type: "post",
            beforeSend:function(){
                loadData('show');
            },
            data: JSON.stringify(list),
            contentType: 'application/json',
            success: function(data) {
                $("."+jointName).find("input").val(note);
                loadData('hide');
                $(".maskLayer1").hide();
            }
        });
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
var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
Y = date.getFullYear() + '-';
M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
D = date.getDate() < 10 ? '0'+ date.getDate() + ' ' : date.getDate() + ' ';
h = date.getHours() < 10 ? '0'+ date.getHours() + ":": date.getHours() + ':';
m = date.getMinutes() < 10 ? '0'+ date.getMinutes() + ":": date.getMinutes() + ':';
s = date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds();
return Y+M+D+h+m+s;

}

})
