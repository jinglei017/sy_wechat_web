$(function(){

    // 获取当前位置
    getLocationFun();
	var logininf = JSON.parse(localStorage.getItem("logininf"));
	var ua = window.navigator.userAgent.toLowerCase();
	/*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		$(".header").show();
		$(".main").css({
			"paddingTop":"0.88rem"
		})
	}*/
	var pageInf = {
		actCode:"LONT",
		carDrvContactTel:logininf.mobilePhone,
		startCreateTime:getCurrentTime("2"),
		endCreateTime:getCurrentTime("0"),
		isNoException:true,
		pageInfo: {
			pageNum: 1,
			pageSize: 150
		}
	};
	getOrderList();
	function getOrderList(){
		$.ajax({
			url: tmsUrl + '/driver/query/DriverHeadOrderTaskInfoPage',
			type: "post",
			contentType: 'application/json',
			beforeSend:function(){
	           $(".main").append('<div class="ajax-loder-wrap"><img src="../images/ajax-loader.gif" class="ajax-loader-gif"/><p class="loading-text">加载中...</p></div>');
			},
			data: JSON.stringify(pageInf),
			success: function(data) {
				$(".ajax-loder-wrap").remove();
				var orderListHtml = "";
				for(var i= 0 ; i < data.result.length;i++){
					orderListHtml += '<li orderid="'+data.result[i].omOrderId+'" orderno="'+data.result[i].orderNo+'" originalNo="'+data.result[i].customerOriginalNo+'" actRemark="'+data.result[i].actRemark+'">'+
										'<div class="orderInf">'+
											'<p class="ordernum">订单号：'+data.result[i].orderNo+'</p>'+
											'<p>原单号：'+data.result[i].customerOriginalNo+'</p>'+
										'</div>'+
									'</li>'
				}
				$(".main .orderList").html(orderListHtml);
			}
		})
	}
	var currentOrderId = "";
	var currentOrderNum = "";
	var currentOriginalNo = ""
	var currentOrderIndex = "";
	var actRemarkTxt = "";
	$(".main .orderList").on("click","li",function(){
		currentOrderId = $(this).attr("orderid");
		currentOrderNum = $(this).attr("orderno");
		currentOrderIndex = $(this).index();
		currentOriginalNo = $(this).attr("originalNo");
		if($(this).attr("actRemark") == ""){
			actRemarkTxt = "";
		}else{
			actRemarkTxt = $(this).attr("actRemark");
		}
		var orderInfo = '<input type="hidden" class="orderid" value="'+currentOrderId+'"/>'+
						'<p class="ordernum">订单号：'+currentOrderNum+'</p>'+
						'<p class="orderSize">原单号：'+currentOriginalNo+'</p>'
		$(".orderCon .orderItem").html(orderInfo);
		$(".maskLayer").show();
	})
	var imgUrl = [];
	$(".maskLayer .popup7 .uploadSeal").on("click",".lastLi",function(){
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
	            $(".uploadSealBtn").prepend(imgli);
	        }  
	    });
	})
	
	var pictureArr = [];
	$(".savePictureBtn").click(function(){
		if(imgUrl.length == 0){
			loadData("show","请至少上传一张图片",true)
			return false;
		}
		if(imgUrl.length > 19){
			loadData("show","每次最多上传20张图片!",true)
			return false;
		}
		pictureArr[currentOrderNum] = {
			imgBase64:imgUrl,
			orderId:currentOrderId,
			actRemarkTxt:actRemarkTxt
		};
		imgUrl = [];
		$(".uploadSealBtn").html('<li class="lastLi"><img src=" /cameraIcon.png" alt="" /></li>');
		$(".main .orderList li").eq(currentOrderIndex).addClass("pickOnLi");
		$(".maskLayer").hide();
	})
	
	$(".header .right").click(function(){
		console.log(pictureArr);
		if($(".pickOnLi").length == 0){
			loadData("show","请先选择订单上传图片",true)
			return false;
		}
		$(".upLoadLayer").show();
		var allOrderInfo = [];
		for(key in pictureArr){
			allOrderInfo.push({
				orderNo:key,
				imgBase64:pictureArr[key].imgBase64,
				orderId:pictureArr[key].orderId,
				exceptionRemark: pictureArr[key].actRemarkTxt,
				actCode:"ACPT",
				operator:logininf.mobilePhone
			});
		}
		$.ajax({
			url: tmsUrl + '/driver/save/submitOrderActInfo',
			type: "post",
			contentType: 'application/json',
			data: JSON.stringify(allOrderInfo),
			success: function(data) {
				if(data.msg == "success"){
					$(".upLoadLayer").hide();
					getOrderList()
					loadData("show","图片批量上传成功",true)
				}
			}
		})
	})
	$(".maskLayer .popup7 .orderCon .closebtn").click(function(){
		$(".maskLayer").hide();
	})
	$(".maskLayer .popup7 .cancelBtn").click(function(){
		$(".maskLayer").hide();
	})
	
	function getCurrentTime(dateParmes){
		var date = new Date() ;
		var year,month,day ;
		date.setDate(date.getDate()-dateParmes);
		year = date.getFullYear();
		month = date.getMonth()+1;
		day = date.getDate() ;
		s = year + '-' + ( month < 10 ? ( '0' + month ) : month ) + '-' + ( day < 10 ? ( '0' + day ) : day) ;
		return s ;
	}
})