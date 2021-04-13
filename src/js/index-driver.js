$(function(){
	$("#scanResult").val("");
	//点击扫一扫
	$(".searchOrder .headerIcon1").click(function(){
		wx.scanQRCode({
	        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
	        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
	        success: function (res) {
	        	if(res.errMsg == 'scanQRCode:ok'){
			        $('#scanResult').val(res.resultStr);
			    }else{
			        $('#scanResult').val('扫描不成功！');
			    }
	        }
	   });
	})
	
	//点击搜索
	$(".searchOrder .headerIcon2").click(function(){
		var ordernum = $(".searchOrder .searchInp input").val();
		if(ordernum.trim() == ""){
			location.href = "allOrder5.html";
		}else{
			location.href = "allOrder5.html?searchordernum=" + ordernum;
		}
		$("#scanResult").val("");
	})
})
