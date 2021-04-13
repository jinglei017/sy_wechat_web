$(function(){
    // 获取当前位置
    getLocationFun();
    /* 微信中不隐去.header */
    var ua = window.navigator.userAgent.toLowerCase();
    /*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        $(".header").show();
    }*/

    var logininf =  JSON.parse(localStorage.getItem("logininf"));
    function p(s) {
        return s < 10 ? '0' + s: s;
    }

    var myDate = new Date();
    //获取当前年
    var year=myDate.getFullYear();
    //获取当前月
    var month=myDate.getMonth()+1;
    //获取当前日
    var date = myDate.getDate();
    var date1 = myDate.getDate() - 1;
    var h=myDate.getHours();       //获取当前小时数(0-23)
    var m=myDate.getMinutes();     //获取当前分钟数(0-59)
    var s=myDate.getSeconds();
    var todayTime = year+'-'+p(month)+'-'+p(date);
    var yeTime =  year+'-'+p(month);



    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    var orderstate = GetQueryString("orderstate");
    var partycode = GetQueryString("partycode");
    var timeType = GetQueryString("timeType");

    var stopartyCode = "";
    if(partycode == null || partycode == "" || partycode == "null"){
        //alert(1);
        stopartyCode = "";
    }else{
        stopartyCode = partycode;
    }

    if(timeType == 1){
        var startCompleteTime = getCurrentTime(7) +" 00:00:00"
        var endCompleteTime = getCurrentTime(1) + " 23:59:59"
    }else{
        var startCompleteTime = yeTime+"-01 00:00:00"
        var endCompleteTime = todayTime+" 23:59:59"
    }
    var merchantInf = {
        umTenantId: logininf.umTenantId,
        startCompleteTime:startCompleteTime,
        endCompleteTime:endCompleteTime,
    }
    if(orderstate == 0){
        pageInf = {
            umTenantId: logininf.umTenantId,
            isOrderInd:"TRUE",
            orderType:'TO',
            startCompleteTime:startCompleteTime,
            endCompleteTime:endCompleteTime,
            sfrPartyCode:stopartyCode,
        };
        $(".header .right").show();
        getClientList()
    }else if(orderstate == 1){
        pageInf = {
            umTenantId: logininf.umTenantId,
            startCompleteTime:startCompleteTime,
            endCompleteTime:endCompleteTime,
            sfrPartyCode:stopartyCode,
            completeStatus:"1",
            isNoException:true,
            orderType:'TO',
            isOrderInd:"TRUE",
        };
        getClientList()
    }else if(orderstate == 2){
        pageInf = {
            umTenantId: logininf.umTenantId,
            startCompleteTime:startCompleteTime,
            endCompleteTime:endCompleteTime,
            sfrPartyCode:stopartyCode,
            isTransit:true,
            isNoException:true,
            orderType:'TO',
            isOrderInd:"TRUE",
        };
        getClientList()
    }else if(orderstate == 3){
        pageInf = {
            umTenantId: logininf.umTenantId,
            startCompleteTime:startCompleteTime,
            endCompleteTime:endCompleteTime,
            sfrPartyCode:stopartyCode,
            //actCode:"EXCP",
            isException:true,
            orderType:'TO',
            isOrderInd:"TRUE",
        };
        getClientList()
    }

    function getClientList(){
        $.ajax({
            url: omsUrl + '/provider/get/weekOrderCount?token='+logininf.token+'&timeStamp='+logininf.timeStamp,
            type:"post",
            contentType : 'application/json',
            data: JSON.stringify(pageInf),
            beforeSend:function(){
                $(".orderList").append('<div class="ajax-loder-wrap"><img src="../images/ajax-loader.gif" class="ajax-loader-gif"/><p class="loading-text">加载中...</p></div>');
            },
            success: function(data) {
                console.log(data);
                var clientItem = "";
                if(data.result.length == 0){
                    var timer1 = setTimeout(function(){
                        $(".clientBox").append('<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;">'+
                            '<img src="images/noContent.png" alt=""  style="width: 3rem; height: auto; display: block;"/>'+
                            '</p>');
                    },600)
                }else{
                    for(var i = 0 ; i < data.result.length; i++){
                        clientItem += '<li activeData="'+timestampToTime2(data.result[i].shpDtmTime)+'">'+
                            '<span class="txt">'+timestampToTime2(data.result[i].shpDtmTime)+'</span>'+
                            '<span class="right">'+data.result[i].orderCount+'</span>'+
                            '</li>'
                    }
                    $(".clientList").html(clientItem);
                }
            }
        })
    }

    $(".clientList").on("click","li",function(){
        //alert($(this).attr("stoPartyCode"));
        var stoPartyCode = partycode;
        var activeData = $(this).attr("activeData");
        localStorage.setItem("activeData",activeData);
        location.href = "orderCostList-client.html?orderstate="+orderstate+"&partycode="+stoPartyCode+"&timeType="+timeType;
    })

})
