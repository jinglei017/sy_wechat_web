$(function () {
    // 获取位置信息上传
    getLocationFun();

    var ua = window.navigator.userAgent.toLowerCase();
    var logininf = JSON.parse(localStorage.getItem("logininf"));

    /* 微信中不隐去.header */
    /*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        $(".header").show();
        $(".content.newOrderMain").css({
            "marginTop":"0.88rem"


        })
    }*/

    $("#startTime").attr("placeholder",'例：'+getCurrentTime("+3"));
    $("#endTime").attr("placeholder",'例：'+getCurrentTime("-1"));
    // 获取初始列表
    var searchFormArr = {
        carDrvContactTel: logininf.mobilePhone,
        startCompleteTime: $("#startTime").val(),
        endCompleteTime: $("#endTime").val()
    };
    getClassesList(searchFormArr);
    function getClassesList(infos){
        postRequest(omsUrl + '/query/tfoListInfo?token='+logininf.token+'&timeStamp='+logininf.timeStamp,infos,function(data){
            if(data.result){
                var classesList = data.result;
                var itemDiv = "";
                for(var i=0; i<classesList.length;i++){
                    var tfoCompleteTime = classesList[i].tfoCompleteTime.split('.')[0];
                    itemDiv += '<div class="itemDiv"> '+
                                    '<div class="itemCon"> '+
                                        '<div class="itemTxt"> '+
                                            '<p>班次号：<span>'+classesList[i].tfoCustomerRefNo+'</span></p> '+
                                        '</div> '+
                                        '<div class="itemLis"> '+
                                            '<p class="itemLi1">司机信息：<span>'+classesList[i].drvContactName+'（'+classesList[i].drvEqpNo+'）</span></p> '+
                                            '<p class="itemLi2">发货时间：<span>'+tfoCompleteTime+'</span></p> '+
                                            '<p class="itemLi1">排单数：<span>6</span></p> '+
                                            '<p class="itemLi2">件毛体：<span>'+classesList[i].tfoTotalQty+'件 * '+classesList[i].tfoTotalWeight+'kg * '+classesList[i].tfoTotalVolume+'m³</span></p> '+
                                        '</div> '+
                                    '</div> '+
                                '</div>'
                }
                $("#tableBodyClasses").html(itemDiv);
            }
        });
    }

    // 弹出搜索表单
    $(".header .right").click(function(){
        $(".searchLayer").toggle();
        $("#startTime").val("");
        $("#endTime").val("");
    })

    // 查询列表
    $(".searchCon .searchbtn").click(function(){
        var startCreateTime = $("#startTime").val().trim();
        var endCreateTime = $("#endTime").val().trim();
        var searchFormArr1 = {
            carDrvContactTel: logininf.mobilePhone,
            startCompleteTime: startCreateTime,
            endCompleteTime: endCreateTime
        };
        getClassesList(searchFormArr1);
        $(".searchLayer").hide();
    })
});