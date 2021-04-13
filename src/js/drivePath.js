$(function(){
    // 获取位置信息上传
    getLocationFun();

    var logininf = JSON.parse(localStorage.getItem("logininf"));

    /* 微信中不隐去.header */
    var ua = window.navigator.userAgent.toLowerCase();
    /*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        $(".header").show();
    }*/
    //获取列表
    var pageNumVal = 1;
    var totalNum = 1;
    $(".main").scroll(function(){
        var scrollNum = document.documentElement.clientWidth / 7.5;
        if($(".main .orderList").outerHeight() - $(".main").scrollTop() - $(".main").height() < 10){
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
    if(vehicleDate == "" || vehicleDate == null || vehicleDate == undefined || vehicleDate == "null" || vehicleDate == "undefined"){
        var pageInf = {
            contactTel:logininf.mobilePhone,
            endCompleteTime:getTodayTime(),
            startCompleteTime:getTodayTime(),
            pageInfo: {
                pageNum: pageNumVal,
                pageSize: 30
            }
        };
    }else{
        var pageInf = {
            contactTel:logininf.mobilePhone,
            endCompleteTime:getTodayTime(),
            startCompleteTime:getTodayTime(),
            pageInfo: {
                pageNum: pageNumVal,
                pageSize: 30
            }
        };
    }

    getVehicleList();

    var totalQty = 0;
    var totalVolume = 0;
    var totalWeight = 0;
    function getVehicleList(){
        $.ajax({
            url: tmsUrl + '/driver/query/transportOrderInfoPage',
            type: "post",
            contentType: 'application/json',
            data: JSON.stringify(pageInf),
            beforeSend:function(){
                $(".main").append('<div class="ajax-loder-wrap"><img src="../images/ajax-loader.gif" class="ajax-loader-gif"/><p class="loading-text">加载中...</p></div>');
            },
            success:function(data){
                $(".ajax-loder-wrap").remove();

                if(data.result != null) {
                    if (data.result.pageModel != null) {
                        if (data.result.pageModel.data != null) {
                            if(data.result.pageModel.data.length != 0){
                                totalNum = data.result.pageModel.pageInfo.pages;
                                vehicleHtml(data.result.pageModel.data);
                            }else{
                                vehicleHtml0();
                            }
                        }else{
                            vehicleHtml0();
                        }
                    }else{
                        vehicleHtml0();
                    }
                }else{
                    vehicleHtml0();
                }
            }
        });

        function vehicleHtml0() {
            totalNum = 1;
            var timer1 = setTimeout(function(){
                $(".listCon").append('<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;">'+
                    '<img src="images/noContent.png" alt=""  style="width: 3rem; height: auto; display: block;"/>'+
                    '</p>');
            },600)
        }

        function vehicleHtml(vehicleData){
            var vehicleItem = "";
            var colorStatus = "notdone";
            for(var i = 0; i < vehicleData.length; i ++ ){
                if(vehicleData[i].completeStatus == "0"){
                    vehicleData[i].completeStatus = "未开始";
                    colorStatus = "notdone";
                }else if(vehicleData[i].completeStatus == "1"){
                    vehicleData[i].completeStatus = "已完成";
                    colorStatus = "done";
                }else if(vehicleData[i].completeStatus == "2"){
                    vehicleData[i].completeStatus = "处理中";
                    colorStatus = "notdone";
                }else if(vehicleData[i].completeStatus == "3"){
                    vehicleData[i].completeStatus = "配送中";
                    colorStatus = "notdone";
                }else if(vehicleData[i].completeStatus == "INIT"){
                    vehicleData[i].completeStatus = "初始化";
                    colorStatus = "notdone";
                }
                //接单：DIST；装车：COFM；配送：LONT；签收：ACPT；
                vehicleItem += '<ul class="listItem" orderNo="'+vehicleData[i].orderNo+'" contactTel="'+vehicleData[i].contactTel+'" eqpNo="'+vehicleData[i].eqpNo+'" contactName="'+vehicleData[i].contactName+'" bcTotalQWV="'+vehicleData[i].totalQty+' * ' + vehicleData[i].totalWeight + ' * ' + vehicleData[i].totalVolume+'">'+
                    '<li>'+vehicleData[i].str1+'</li><li>'+vehicleData[i].eqpNo+'</li><li class="notdone">'+vehicleData[i].completeCount+'/'+vehicleData[i].totalCount+'</li>'+
                    '<div class="txtBc">单号：'+vehicleData[i].orderNo+'</div><div class="txtBc">司机信息：'+vehicleData[i].contactName+'-'+vehicleData[i].contactTel+'</div></ul>';
            }
            $(".orderList .listCon").append(vehicleItem);

        }
    }

    $(".carDetails .listCon").on("click",".listItem",function(){
        var orderNo = $(this).attr("orderNo");
        var contactTel = $(this).attr("contactTel");
        var eqpNo = $(this).attr("eqpNo");
        var contactName = $(this).attr("contactName");
        var bcTotalQWV = $(this).attr("bcTotalQWV");
        localStorage.setItem("bcTotalQWV",bcTotalQWV);
        location.href = "drivePathOrder.html?orderNo="+orderNo+"&contactTel="+contactTel+"&eqpNo="+eqpNo+"&contactName="+contactName;

    })

})
