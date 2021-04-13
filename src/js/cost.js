$(function(){
    // 获取位置信息上传
    getLocationFun();

    var logininf = JSON.parse(localStorage.getItem("logininf"));
	
	$(".costList").on("click"," ul li .clTitle",function(){
		$(this).parents("li").toggleClass("active");
	})
	var tabNum = 0;
	$(".mTitle ul li").click(function(){
		$(".ajax-loder-wrap").remove();
		totalAmountnum = "0";
		tabNum = $(this).index();
		if($(this).index() == 0){
			$(".costList").removeClass("costList1");
		}else{
			$(".costList").addClass("costList1");
		}
		$(this).addClass("active").siblings().removeClass("active");
		orderListFun();
	})
	
	
	function p(s) {
	    return s < 10 ? '0' + s: s;
	}
	
	var myDate = new Date();
	//获取当前年
	var year=myDate.getFullYear();
	//获取当前月
	var month=myDate.getMonth()+1;
	var month1=myDate.getMonth();
	//获取当前日
	var date = myDate.getDate(); 
	var date1 = myDate.getDate() - 1; 
	var h=myDate.getHours();       //获取当前小时数(0-23)
	var m=myDate.getMinutes();     //获取当前分钟数(0-59)
	var s=myDate.getSeconds(); 
	var todayTime = year+'-'+p(month)+'-'+p(date);
	var yeTime =  year+'-'+p(month);
	
	
	var pagenum = 1;
	var pages = "";
	var totalNum = 0;
	var pageInf = {
		umTenantId: logininf.umTenantId,
		startCreateTime:yeTime+"-01 00:00:00",
		endCreateTime:todayTime+" 23:59:59",
		"pageInfo": {
			pageNum: pagenum,
			pageSize: 100
		}
	};
	var tabnum = 0;
	
	//页面滚动到底部
	orderListFun();
	var totalAmountnum = "0";
	function orderListFun() {
		$.ajax({
			url: omsUrl + '/provider/query/selectHaulOrderInfoPage?token=' + logininf.token + '&timeStamp=' + logininf.timeStamp,
			type: "post",
			contentType: 'application/json',
			data: JSON.stringify(pageInf),
			beforeSend:function(){
				$(".costList").hide();
	           $(".main").append('<div class="ajax-loder-wrap" style="padding-top:2rem;"><img src="../images/ajax-loader.gif" class="ajax-loader-gif"/><p class="loading-text">加载中...</p></div>');
			},
			success: function(data) {
				$(".ajax-loder-wrap").remove();
				$(".costList").show();
				pages = data.pageInfo.pages;
				var orderstatitem = "";
				var data = data.result;
				var orderstatli = "";
				var orderlititle = "";
				var ordercostul = "";
				var ordercostitem = "";
				
				if(tabNum == 0){
					for(var i = 0; i < data.length;i++){
						if(data[i].totalAmount == null || data[i].totalAmount == "null"){
							
						}else{
							if(data[i].currency == "USD"){
								data[i].totalAmount = (data[i].totalAmount*parseFloat(6.5191)).toFixed(2);
								totalAmountnum = parseInt(totalAmountnum) + parseInt(data[i].totalAmount)
							}else{
								totalAmountnum = parseInt(totalAmountnum) + parseInt(data[i].totalAmount)
							}
						}
						ordercostitem += '<li class="listItem" orderid ='+data[i].omOrderId+'>'+
											'<p>'+data[i].orderNo+'<input type="hidden" class="ordernum" value="'+data[i].orderNo+'" /><input type="hidden" class="sendaddress"  value="'+data[i].stoAddress+'" /><input type="hidden" class="drivertel" value="'+data[i].stoContactTel+'" /></p>'+
											'<p>'+data[i].totalAmount+'</p>'+
										'</li>'
					}
					ordercostul = '<ul class="title">'+
										'<li>'+
											'<p>订单号</p>'+
											'<p>费用（元）</p>'+
										'</li>'+
									'</ul>'+
									'<ul class="con">'+ordercostitem+'</ul>'
									
				}else if(tabNum == 1){
					ordercostul = '<ul class="con">'+
									'<li>'+
										'<p>仓储费用(元)： 123</p>'+
										'<p>仓储面积(㎡)：123</p>'+
										'<p>吨/天：50</p>'+
										'<p>托/天：50</p>'+
									'</li>'+
								'</ul>'
				}else if(tabNum == 2){
					ordercostul = '<ul class="con">'+
									'<li>'+
										'<p>其他费用(元)： 123</p>'+
										'<p>装卸费(元)：123</p>'+
										'<p>操作费(元)：50</p>'+
										'<p>贴码费(元)：50</p>'+
									'</li>'+
								'</ul>'
				}
				//console.log(ordercostul);
				for(var i = 5; i > 0; i--){
					orderstatli += '<li>'+
										'<div class="clTitle">'+
											'<p class="left">'+i+'月份</p>'+
											'<p class="right">'+totalAmountnum+'元</p>'+
										'</div>'+
										'<div class="costDetailList">'+ordercostul+'</div>'+
									'</li>'
				}
				//RECV 接收      COMFM 确认      SENT 已发出      RJCT 拒收      ACPT 验收   DCHT 卸车     LONT 装车    SEND 发送     DONE 完成   INIT 初始化  EXCP 异常
				$(".costList .costListUl").html(orderstatli);
				//$(".totalCost").html(month1+'月份费用合计： <span>'+totalAmountnum+'元</span>');
			},
			error: function(xhr) {
				// markmsg("不存在此账户");
			}
		})
		
		$(".closeorderinf").click(function(){
			$(".maskLayer").hide();
		})
		
		$(".main .costList").on("click"," .costDetailList ul li",function(){
			if(tabNum == 0){
				$(".maskLayer").show();
				var orderid = $(this).attr("orderid");
				var parmas = {
					"omOrderId": orderid
				}
				if($(this).find(".sendaddress").val() == "null" || $(this).find(".sendaddress").val() == undefined|| $(this).find(".sendaddress").val() == ""){
					console.log($(this).find(".sendaddress").val());
					$(this).find(".sendaddress").val("-");
				}
				$(".popupCon .popuptitle ul li").eq(0).children(".inf").html($(this).find(".ordernum").val());
				$(".popupCon .popuptitle ul li").eq(1).children(".inf").html($(this).find(".sendaddress").val());
				//$(this).find(".ordernum").val();
				$.ajax({
					url: omsUrl + '/query/OrderItemDetail?token=' + logininf.token + '&timeStamp=' + logininf.timeStamp,
					type: "get",
					data: parmas,
					success: function(data) {
						var sortList = "";
						for(var i = 0; i < data.result.length;i++){
							sortList += '<ul>'+
											'<li>'+data.result[i].itemName+'</li>'+
											'<li>x'+data.result[i].qty+'</li>'+
											'<li>'+data.result[i].weight+'</li>'+
										'</ul>'
						}
						$(".ordersortList").html(sortList);
					}
				})
			}
		})
		$(".orderList .listCon").on("click",".listItem .getLocationLi",function(e){
			e.stopPropagation();
			e.preventDefault();
			location.href = "map.html";
		})
	}
})
