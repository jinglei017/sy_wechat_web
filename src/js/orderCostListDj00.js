$(function(){
    // 获取当前位置
    getLocationFun();
    /* 微信中不隐去.header */
    var ua = window.navigator.userAgent.toLowerCase();
    /*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        $(".header").show();
    }*/

    $(".header .returnBtn").click(function(){
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            location.href = wechatUrl + "/syOauth2Login.html?r=/index.html";
        }else{
            location.href = "index.html";
        }
    })

    var logininf = JSON.parse(localStorage.getItem("logininf"));

    var myDate = new Date();
    var year= myDate.getFullYear();
    var month= myDate.getMonth()+1 < 10 ? '0'+(myDate.getMonth()+1) : (myDate.getMonth()+1);
    var date = myDate.getDate() < 10 ? '0'+ myDate.getDate() : myDate.getDate();
    var nowDate = year +'-'+ month +"-"+date;
    $("#startTime").val(nowDate);
    var pageNumVal = 1;
    $(".main").scroll(function(){
        var scrollNum = document.documentElement.clientWidth / 7.5;
        if($(".main .carList").outerHeight() - $(".main").scrollTop() - $(".main").height() < 20){
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

    $(".header .txt").html("应收费用 &nbsp" + nowDate);
    var ua = window.navigator.userAgent.toLowerCase();
    /*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        $(".header").show();
    }*/
    //获取列表
    var pageInf = {
        endCompleteTime:nowDate,
        startCompleteTime:nowDate,
        pageInfo:{
            pageNum:pageNumVal,
            pageSize:25
        }
    }
    getVehicleList();
    function getVehicleList(){
        $.ajax({
            url: tmsUrl + '/wx/query/transportCostStatistics?token=' + logininf.token + '&timeStamp=' + logininf.timeStamp,
            type: "post",
            contentType: 'application/json',
            data: JSON.stringify(pageInf),
            beforeSend:function(){
                $(".main").append('<div class="ajax-loder-wrap"><img src="../images/ajax-loader.gif" class="ajax-loader-gif"/><p class="loading-text">加载中...</p></div>');
            },
            success:function(data){
                $(".ajax-loder-wrap").remove();
                totalNum = data.result.pageModel.pageInfo.pages;
                var datas = data.result.pageModel.data;
                if(datas.length == 0){
                    var timer1 = setTimeout(function(){
                        $(".listCon").append('<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;">'+
                            '<img src="images/noContent.png" alt=""  style="width: 3rem; height: auto; display: block;"/>'+
                            '</p>');
                    },600)
                    $(".carAmountInf").empty();
                }else{
                    // vehicleHtml(datas,data.result.spotPayAmountSum,data.result.collectPayAmountSum,data.result.monthlyPayAmountSum);
                    vehicleHtml(datas,data.result.spotPayAmountSum,data.result.collectPayAmountSum);
                }
            }
        })

        function vehicleHtml(vehicleData,spotPayAmountSum,collectPayAmountSum){
            // var vehicleItem = "",spotPayAmountAll = 0,collectPayAmountAll = 0,monthlyPayAmountAll = 0,carAmountInfHtml = '';
            var vehicleItem = "",spotPayAmountAll = 0,collectPayAmountAll = 0,carAmountInfHtml = '';
            if(spotPayAmountSum != undefined && spotPayAmountSum != null){
                spotPayAmountAll = spotPayAmountSum;
            }
            if(collectPayAmountSum != undefined && collectPayAmountSum != null){
                collectPayAmountAll = collectPayAmountSum;
            }
            /*if(monthlyPayAmountSum != undefined && monthlyPayAmountSum != null){
                monthlyPayAmountAll = monthlyPayAmountSum;
            }*/
            var time = $("#startTime").val();
            for(var i = 0; i < vehicleData.length; i ++ ){
                vehicleItem += '<ul class="listItem" spot="'+vehicleData[i].spotPayAmount+'" col="'+vehicleData[i].collectPayAmount+'" eqpNo="'+vehicleData[i].eqpNo+'"  time="'+time+'">'+
                    '<li>'+vehicleData[i].contactName+'-'+vehicleData[i].eqpNo+'</li>'+
                    '<li style="color: #00b050;">'+vehicleData[i].spotPayAmount+'</li>'+
                    '<li style="color: #007aff">'+vehicleData[i].collectPayAmount+' </li>'+
                    // '<li>'+vehicleData[i].monthlyPayAmount+'</li>'+
                    '</ul>'
            }
            // carAmountInfHtml = '<span>现付：'+spotPayAmountAll+'元；到付：'+collectPayAmountAll+'元；月结：'+monthlyPayAmountAll+'元</span>';
            carAmountInfHtml = '<span>现付：'+spotPayAmountAll+'元；到付：'+collectPayAmountAll+'元；</span>';
            $(".orderList .listCon").append(vehicleItem);
            $(".carAmountInf").html(carAmountInfHtml);
        }

    }

    $(".carList .listCon").on("click",".listItem",function(){
        var spot = $(this).attr("spot");
        var col = $(this).attr("col");
        var eqpNo = $(this).attr("eqpNo");
        var time = $(this).attr("time");
        // var mon = $(this).attr("mon");
        location.href = "orderCostListDj0.html?spot="+spot+"&col="+col+"&eqpNo="+eqpNo+"&time="+time;
    })

    $(".header .right").click(function(){
        $(".searchLayer").toggle();
    })

    $(".searchBox .searchbtn").click(function(){
        if($("#startTime").val().trim() == ""){
            $(".searchLayer").hide();
        }else{
            $(".main .orderList .listCon").html("");
            totalNum = 1;
            pageInf.pageInfo.pageNum = 1;
            pageInf.endCompleteTime = $("#startTime").val();
            pageInf.startCompleteTime = $("#startTime").val();
            getVehicleList();
            $(".searchLayer").hide();
            $(".header .txt").html("应收费用 &nbsp" + $("#startTime").val());
        }
    })

})
