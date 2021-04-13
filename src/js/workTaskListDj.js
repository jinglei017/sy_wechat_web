$(function(){
    // 获取当前位置
    getLocationFun();
    var logininf = JSON.parse(localStorage.getItem("logininf"));
    var partname = window.location.pathname;
    var ua = window.navigator.userAgent.toLowerCase();
    $(".header .right").click(function(){
        $(".searchLayer").toggle();
        $(".searchCon ul li .orderNo").val("")
        $(".searchCon ul li .trackingNo").val("")
        $(".searchCon ul li .statusSelect").val("")
        $("#startTime").val("");
        $("#endTime").val("");
    })

    $(".header .returnBtn").click(function(){
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            location.href = wechatUrl + "/syOauth2Login.html?r=/index.html";
        }else{
            location.href = "index.html";
        }
    })

    /*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        $(".header").show();
    }*/
    var roleId = localStorage.getItem("roleId");
    var orderType = "";
    if(roleId == '0'){
        orderType = "TO"
    } else{
        orderType = "DO"
    }
    var pageNumVal = 1;
    var totalNum = 1;
    var pageInf = {
        customerOriginalNo:"",
        exceptionStatus:"",
        completeStatus:"",
        umTenantId: logininf.umTenantId,
        "startCreateTime":getCurrentTime("0"),
        "endCreateTime":getCurrentTime("0"),
        "pageInfo": {
            pageNum: pageNumVal,
            pageSize: 30
        },
        isNoException:true,
        orderType:orderType,
        isOrderInd:"TRUE",
    }
    $("#startTime").attr("placeholder",getCurrentTime("+3"));
    $("#endTime").attr("placeholder",getCurrentTime("0"));
    if(partname == "//workTaskListDj0.html" || partname == "/workTaskListDj0.html"){
        pageInf.carImgContactTel = logininf.mobilePhone;
        orderListFun(pageInf,"承运商");
    }
    if(partname == "//workTaskListDj1.html" || partname == "/workTaskListDj1.html"){
        // pageInf.sfrImgContactTel = logininf.mobilePhone;
        orderListFun(pageInf,"发货商");
    }
    /*if(partname == "//myReceiving.html" || partname == "/myReceiving.html"){
        pageInf.stoImgContactTel = logininf.mobilePhone;
        orderListFun(pageInf,"收货商");
    }*/

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
        pageNumVal = 1;
        totalNum = 1;
        var orderNoInp = $(".searchCon ul li .orderNo").val().trim();
        var actCodeSelect = $(".searchCon ul li .statusSelect").val().trim();
        var exceptionStatus = $(".searchCon ul li .abnormalStatus").val();
        var startCreateTime = $("#startTime").val().trim();
        var endCreateTime = $("#endTime").val().trim();
        if(isGetTime == 1){
            if(startCreateTime == "" || startCreateTime == "null" || startCreateTime == null){

            }else{
                pageInf.startCreateTime = startCreateTime
            }

            if(endCreateTime == "" || endCreateTime == "null" || endCreateTime == null){

            }else{
                pageInf.endCreateTime = endCreateTime
            }
        }else{
            pageInf.endCreateTime = getCurrentTime(endmouthnum*30);
            pageInf.startCreateTime = getCurrentTime(startmouthnum*30);
        }
        pageInf.customerOriginalNo = orderNoInp;
        pageInf.completeStatus = actCodeSelect;
        pageInf.exceptionStatus = exceptionStatus;
        pageInf.pageInfo.pageNum = "1";
        if(partname == "//workTaskListDj0.html" || partname == "/workTaskListDj0.html"){
            orderListFun(pageInf,"承运商");
        }
        if(partname == "//workTaskListDj1.html" || partname == "/workTaskListDj1.html"){
            orderListFun(pageInf,"发货商");
        }
        /*if(partname == "//myReceiving.html" || partname == "/myReceiving.html"){
            orderListFun(pageInf,"收货商");
        }*/
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
                if(partname == "//workTaskListDj0.html" || partname == "/workTaskListDj0.html"){
                    orderListFun(pageInf,"承运商");
                }
                if(partname == "//workTaskListDj1.html" || partname == "/workTaskListDj1.html"){
                    orderListFun(pageInf,"发货商");
                }
                /*if(partname == "//myReceiving.html" || partname == "/myReceiving.html"){
                    orderListFun(pageInf,"收货商");
                }*/
            }
        }
    })


    //点击签收
    $(".main .orderCon .orderList").on("click", "li .orderHandle .singFor", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var orderid = $(this).parents("li").attr("orderid");
        var ordernum = $(this).parents("li").attr("ordernum");
        imgUrl = [];
        $(".uploadSealBtn").html('<li class="lastLi"><img src="images/cameraIcon.png" alt="" /></li>');
        $(".main .orderCon .orderList li").removeClass("checkedli");
        $(".main .orderCon .orderList li .round").removeClass("rounded");
        $(this).parents("li").addClass("checkedli");
        $(this).parents(".orderHandle").siblings(".round").addClass("rounded");
        var totalweight = "0";
        var totalvolume = "0";
        var totalAmount = "0"
        var totalQty = "0"
        //获取选中订单的个数
        var checkednum = $(".main .orderCon .orderList .checkedli").length;
        //获取选中li的元素
        var checkedli = $(".main .orderCon .orderList .checkedli")
        //获取接单合计
        $(".maskLayer .popup2 .orderCon .ordernum").html("接受总数: "+checkednum+"个");
        $(".maskLayer .popup7 .orderCon .ordernum").html("接受总数: "+checkednum+"个");
        //获取重量和体积
        for(var i = 0; i < checkedli.length;i++){
            totalweight = 　(parseFloat(totalweight) + parseFloat(checkedli.eq(i).children(".weightnum").val())).toFixed(2);
            totalvolume = (parseFloat(totalvolume) + parseFloat(checkedli.eq(i).children(".volumenum").val())).toFixed(2);
            totalQty = parseInt(totalQty) + parseInt(checkedli.eq(i).children(".qtyNum").val())
            totalAmount = (parseFloat(totalAmount) + parseFloat(checkedli.eq(i).children(".amountnum").val())).toFixed(2);
        }
        $(".maskLayer .popup7 .orderCon .orderSize").html('数量:'+totalQty+' 重量：'+totalweight+'kg 体积：'+totalvolume+'m³ 价值：'+totalAmount+'元');
        $(".maskLayer .popup2 .orderCon .orderSize").html('数量:'+totalQty+' 重量：'+totalweight+'kg 体积：'+totalvolume+'m³ 价值：'+totalAmount+'元');

        //清除文本框内容
        $(".abnormalDesc").val("");
        $(".disposition").val("");
        $(".customerTel").val("");
        $(".customerName").val("");
        $('.qsTextarea').val("");
        $('.score_div img').attr('src', 'images/star_before.png');
        $('.score_div img').removeAttr('class');
        $(".normalorderbtn").removeClass("pointAndClick");
        $(".abnormalorderbtn").removeClass("pointAndClick1");
        $(".maskLayer").show();
        $(".maskLayer .popup7").show();
    })


    var uploadImgOrderId = "";
    var uploadImgOrderNum = "";
    var orderReceiptImgList = "";
    //点击上传图片
    $(".main .orderCon .orderList").on("click", "li .orderHandle .uploadPic", function(e) {
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

    // 确认上传图片的时候  将imgUrl提交即可
    $(".maskLayer .popup5 .popupBot2 .abnormalorderbtn").click(function(){
        if(imgUrl.length > 19){
            loadData('show','每次最多上传20张图片!',true)
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
                });
                $.ajax({
                    url: tmsUrl + '/driver/save/submitOrderActInfo',
                    type: "post",
                    beforeSend:function(){
                        loadData('show');
                    },
                    data: JSON.stringify(list),
                    contentType: 'application/json',
                    success: function(data) {
                        //改变状态成功   隐藏弹窗
                        $(".maskLayer").hide();
                        $(".maskLayer .popup5").hide();
                        loadData('hide');
                    },
                    error: function(){
                        $(".abnormalorderbtn").removeClass("pointAndClick");
                        loadData("show","上传图片失败，请稍后再试！",true)
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


    //订单正常处理
    $(".maskLayer .popup7 .popupBot2 .normalorderbtn").click(function(){
        if($(this).hasClass("pointAndClick")){

        }else{
            var checkedli = $(".main .orderCon .orderList .checkedli");
            var abnormalDesc = $(".abnormalDesc").val();
            var disposition = $(".disposition").val();
            var customerTel = $(".customerTel").val();
            var customerName = $(".customerName").val();
            //获取文本框的内容 拼接
            var abnormalManageInf = abnormalDesc+","+disposition+","+customerTel+","+customerName;
            /*console.log(checkedli);
            console.log(abnormalManageInf);*/

            if($('.stars_img').length == 0){
                loadData('show','请对满意度评星级',true)
                return false;
            }
            if(imgUrl.length > 19){
                loadData('show','每次最多上传20张图片!',true)
                return false;
            }
            if(imgStatus == 0){
                loadData('show','请先上传签收图',true)
            }else if(imgStatus == 1){
                $(this).addClass("pointAndClick");
                changeActCodeFun(checkedli,"ACPT",abnormalManageInf);
            }

        }
    })

    /*验收中的评分，五角星点亮  */
    $(".score_div").on("click","img",function(){
        var index = $(this).parent('.star_img').index()-1;
        //   console.log(index);
        if (!$(this).hasClass('stars_img')) {    // 该img无class stars_img（之前未被点亮）
            for (var n = 0; n <= index; n++) {     // 该img及之前的img都点亮（after）
                $('.score_div img').eq(n).attr('src', 'images/star_after.png');
                $('.score_div img').eq(n).attr('class', 'stars_img');
            }
        } else {   // 该img有class stars_img（之前被点亮）
            var img2;
            if (!$('#img2').hasClass('stars_img')) {
                img2 = 1;
            } else {
                img2 = 0;
            }
            if (index == 0) {
                if (img2) {
                    // alert("img2是灭的，点击之后是0星");
                    $('.score_div img').attr('src', 'images/star_before.png');
                    $('.score_div img').removeAttr('class');
                } else {
                    // alert("img2是亮的，点击之后是一星");
                    for (var ii = 4; ii > index; ii--) {      // 该img之后的img都灭（before）
                        $('.score_div img').eq(ii).attr('src', 'images/star_before.png');
                        $('.score_div img').eq(ii).removeAttr('class');
                    }
                }
            } else {
                for (var i = 0; i <= index; i++) {    // 该img及之前的img都点亮
                    $('.score_div img').eq(i).attr('src', 'images/star_after.png');
                    $('.score_div img').eq(i).attr('class', 'stars_img');
                }
                for (var ii = 4; ii > index; ii--) {      // 该img之后的img都灭（before）
                    $('.score_div img').eq(ii).attr('src', 'images/star_before.png');
                    $('.score_div img').eq(ii).removeAttr('class');
                }
            }
        }

    });



    //正常接单、装车  改变code
    function changeActCodeFun(checkedli,actcode,actRemark){
        if(imgUrl.length > 19){
            loadData("show","每次最多上传20张图片!",true)
            return false;
        }
        var getLocationCodeVal = localStorage.getItem("locationCodeVal");
        var list = [];
        for(var i = 0; i < checkedli.length; i++) {
            var orderid = checkedli.eq(i).attr("orderid");
            var ordernum = checkedli.eq(i).attr("ordernum");
            var actRemark1 = checkedli.eq(i).children(".actRemark").html();
            if(actRemark1 == ",,,"){
                var actRemarkTxt = actRemark
            }else{
                var actRemarkTxt = actRemark1
            }

            var par;
            if(actcode == 'ACPT'){
                par = {
                    orderId: orderid,
                    actCode: actcode,
                    exceptionRemark: actRemarkTxt,
                    orderNo: ordernum,
                    imgBase64:imgUrl,
                    operator:logininf.mobilePhone,
                    latLng:getLocationCodeVal,
                    satisfaction:$('.stars_img').length,
                    evaluate:$('.qsTextarea').val()
                };
            }else{
                par = {
                    orderId: orderid,
                    actCode: actcode,
                    exceptionRemark: actRemarkTxt,
                    orderNo: ordernum,
                    imgBase64:imgUrl,
                    operator:logininf.mobilePhone,
                    latLng:getLocationCodeVal
                };
            }
            list.push(par);

        }
        $.ajax({
            url: tmsUrl + '/driver/save/submitOrderActInfo',
            type: "post",
            beforeSend:function(){
                loadData('show');
            },
            data: JSON.stringify(list),
            contentType: 'application/json',
            success: function(data) {
                //改变状态成功   隐藏弹窗
                $(".maskLayer").hide();
                $(".maskLayer .popup2").hide();
                loadData('hide');
                //$(".maskLayer .popup2 .orderDesc .orderTextBox").hide();
                location.reload(true);

            }
        })
    }
    //end


    //异常接单、装车  改变code
    function abnormalActCodeFun(checkedli,actcode,actRemark,exceptionStatusNum){
        if(imgUrl.length > 19){
            loadData("show","每次最多上传20张图片!",true)
            return false;
        }
        var getLocationCodeVal = localStorage.getItem("locationCodeVal");
        var list = [];
        for(var i = 0; i < checkedli.length; i++) {
            var orderid = checkedli.eq(i).attr("orderid");
            var ordernum = checkedli.eq(i).attr("ordernum");
            list.push({
                orderId: orderid,
                actCode: actcode,
                exceptionStatus:exceptionStatusNum,
                orderNo: ordernum,
                exceptionRemark: actRemark,
                imgBase64:imgUrl,
                operator:logininf.mobilePhone,
                latLng:getLocationCodeVal
            })
            checkedli.eq(i).fadeOut();
        }
        $.ajax({
            url: tmsUrl + '/driver/save/submitOrderActInfo',
            type: "post",
            beforeSend:function(){
                loadData('show');
            },
            data: JSON.stringify(list),
            contentType: 'application/json',
            success: function(data) {
                //改变状态成功   隐藏弹窗
                $(".maskLayer").hide();
                $(".maskLayer .popup2").hide();
                loadData('hide');
                //$(".maskLayer .popup2 .orderDesc .orderTextBox").hide();
                location.reload(true);

            }
        })
    }
    //end

    var imgUrl = [];
    var imgStatus = 0;
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
                $(".uploadSealBtn").prepend(imgli);
            }
        });
    })

    $(".maskLayer .popup2 .uploadSeal").on("click",".lastLi",function(){
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


    $(".maskLayer .popup7 .popupBot2 .abnormalorderbtn").click(function(){
        $(".maskLayer .popup7").hide();
        $(".maskLayer .popup2").show();
    })

    //订单异常执行
    $(".maskLayer .popup2 .popupBot2 .normalorderbtn").click(function(){
        var checkedli = $(".main .orderCon .orderList .checkedli");
        var abnormalDesc = $(".abnormalDesc").val();
        var disposition = $(".disposition").val();
        var customerTel = $(".customerTel").val();
        var customerName = $(".customerName").val();

        var choiceVal = $(".choiceVal").val();

        var abnormalManageInf = abnormalDesc+","+disposition+","+customerTel+","+customerName;
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if(abnormalDesc.trim() == ""){
            loadData("show","异常描述不能为空",true)
            return false;
        }
        if(disposition.trim() == ""){
            loadData("show","处理意见不能为空",true)
            return false;
        }
        if(customerName.trim() == ""){
            loadData("show","客户电话不能为空",true)
            return false;
        }
        if(!reg.test(customerName)){
            loadData("show","请输入正确的手机号码",true)
            return false;
        }
        if(choiceVal == 0){
            loadData("show","请选择异常是否执行",true)
            return false;
        }

        if(imgUrl.length > 19){
            loadData("show","每次最多上传20张图片!",true)
            return false;
        }
        if(imgStatus == 0){
            loadData("show","请先上传签收图",true)
        }else if(imgStatus == 1){
            $(this).addClass("pointAndClick1");
            abnormalActCodeFun(checkedli,"ACPT",abnormalManageInf,choiceVal);
        }

    })

    //订单异常不执行
    $(".maskLayer .popup2 .popupBot2 .abnormalorderbtn").click(function(){
        var checkedli = $(".main .orderCon .orderList .checkedli");
        var abnormalDesc = $(".abnormalDesc").val();
        var disposition = $(".disposition").val();
        var customerTel = $(".customerTel").val();
        var customerName = $(".customerName").val();

        var choiceVal = $(".choiceVal").val();

        var abnormalManageInf = abnormalDesc+","+disposition+","+customerTel+","+customerName;
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if(abnormalDesc.trim() == ""){
            loadData("show","异常描述不能为空",true)
            return false;
        }
        if(disposition.trim() == ""){
            loadData("show","处理意见不能为空",true)
            return false;
        }
        if(customerName.trim() == ""){
            loadData("show","客户电话不能为空",true)
            return false;
        }
        if(choiceVal == 0){
            loadData("show","请选择异常是否执行",true)
            return false;
        }
        if(!reg.test(customerName)){
            loadData("show","请输入正确的手机号码",true)
            return false;
        }

        if(imgUrl.length > 19){
            loadData("show","每次最多上传20张图片",true)
            return false;
        }
        if(imgStatus == 0){
            loadData("show","请先上传图片",true)
        }else if(imgStatus == 1){
            $(this).addClass("pointAndClick1");
            abnormalActCodeFun(checkedli,"ACPT",abnormalManageInf,choiceVal);
        }

    })


    function orderListFun(pageInf,currentRole) {
        $.ajax({
            url: omsUrl + '/provider/query/selectOrderInfoPage?token='+logininf.token+'&timeStamp='+logininf.timeStamp,
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
                var orderHandleBtnHtml = '';

                if(data.result.length == 0){
                    var timer1 = setTimeout(function(){
                        $(".orderCon").append('<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;">'+
                            '<img src="images/noContent.png" alt=""  style="width: 3rem; height: auto; display: block;"/>'+
                            '</p>');
                    },600)
                }else{
                    for(var i = 0; i < data.result.length; i++) {
                        if(currentRole == "承运商"){
                            if(data.result[i].actCode == 'ACPT'){
                                orderHandleBtnHtml = '<div class="orderHandle">'+
                                    '<a href="javascript:;" class="qsedBtn">已签收</a>'+
                                    '<a href="javascript:;" class="truck uploadPic">上传图片</a>'+
                                    '</div>'
                            }else{
                                orderHandleBtnHtml = '<div class="orderHandle">'+
                                    '<a href="javascript:;" class="truck singFor">签收</a>'+
                                    '<a href="javascript:;" class="truck uploadPic">上传图片</a>'+
                                    '</div>'
                            }
                        }else if(currentRole == "发货商"){
                            orderHandleBtnHtml = '<div class="orderHandle">'+
                                '<a href="javascript:;" class="truck uploadPic">上传图片</a>'+
                                '</div>'
                        }else if(currentRole == "收货商"){
                            if(data.result[i].actCode == 'ACPT'){
                                orderHandleBtnHtml = '<div class="orderHandle">'+
                                    '<a href="javascript:;" class="qsedBtn">已签收</a>'+
                                    '<a href="javascript:;" class="truck uploadPic">上传图片</a>'+
                                    '</div>'
                            }else{
                                orderHandleBtnHtml = '<div class="orderHandle">'+
                                    '<a href="javascript:;" class="truck singFor">签收</a>'+
                                    '<a href="javascript:;" class="truck uploadPic">上传图片</a>'+
                                    '</div>'
                            }
                        }
                        // 付款方式
                        if(orderData[i].extPaymentWay == "spot"){
                            paymentItem = '<p class="receiverAddress">收款方式：<span style="padding: 1px 3px;color:#ee9200;border:1px solid #ee9200;">现付</span></p>'
                        }else if(orderData[i].extPaymentWay == "collect"){
                            paymentItem = '<p class="receiverAddress">收款方式：<span style="padding: 1px 3px;color:#ee9200;border:1px solid #ee9200;">到付</span></p>'
                        }else if(orderData[i].extPaymentWay == "voucher"){
                            paymentItem = '<p class="receiverAddress">收款方式：<span style="padding: 1px 3px;color:#ee9200;border:1px solid #ee9200;">凭单回复</span></p>'
                        }else{
                            paymentItem = '<p></p>'
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
                            '<p class="receiverAddress">客户：'+orderData[i].stoPartyName+' &nbsp;&nbsp;配送日期：'+timestampToTime1(orderData[i].shpDtmTime)+'</p>'+
                            '<p class="receiverAddress">收货地址：'+orderData[i].stoAddress+'</p>'+paymentItem+
                            '</div>'+orderHandleBtnHtml+'</li>';

                    }
                    $(".main .orderCon .orderList").append(orderlist);
                }
            },
            error: function(xhr) {
                // markmsg("不存在此账户");
            }
        })
    }

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
                //获取商品信息
                getGoodsList(data.result.orderItemList);
                //获取图片信息
                getOrderReceiptImg(data.result.imgList);
                //获取订单基本信息
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

        var manyiHtml = '';
        switch (tasklistData.satisfaction)
        {
            case '1':
                manyiHtml = '<table class="score_div2"><td class="star_img"><img src="images/star_after.png"/></td>' +
                    '<td class="star_img"><img src="images/star_before.png" id="img2" /></td>' +
                    '<td class="star_img"><img src="images/star_before.png" /></td>' +
                    '<td class="star_img"><img src="images/star_before.png" /></td>' +
                    '<td class="star_img"><img src="images/star_before.png" /></td></tr></table>';
                break;
            case '2':
                manyiHtml = '<table class="score_div2"><td class="star_img"><img src="images/star_after.png" /></td>' +
                    '<td class="star_img"><img src="images/star_after.png" id="img2"/></td>' +
                    '<td class="star_img"><img src="images/star_before.png" /></td>' +
                    '<td class="star_img"><img src="images/star_before.png" /></td>' +
                    '<td class="star_img"><img src="images/star_before.png" /></td></tr></table>';
                break;
            case '3':
                manyiHtml = '<table class="score_div2"><td class="star_img"><img src="images/star_after.png" /></td>' +
                    '<td class="star_img"><img src="images/star_after.png" id="img2" /></td>' +
                    '<td class="star_img"><img src="images/star_after.png" /></td>' +
                    '<td class="star_img"><img src="images/star_before.png" /></td>' +
                    '<td class="star_img"><img src="images/star_before.png" /></td></tr></table>';
                break;
            case '4':
                manyiHtml = '<table class="score_div2"><td class="star_img"><img src="images/star_after.png"/></td>' +
                    '<td class="star_img"><img src="images/star_after.png" id="img2" /></td>' +
                    '<td class="star_img"><img src="images/star_after.png" /></td>' +
                    '<td class="star_img"><img src="images/star_after.png" /></td>' +
                    '<td class="star_img"><img src="images/star_before.png" /></td></tr></table>';
                break;
            case '5':
                manyiHtml = '<table class="score_div2"><td class="star_img"><img src="images/star_after.png" /></td>' +
                    '<td class="star_img"><img src="images/star_after.png" id="img2" /></td>' +
                    '<td class="star_img"><img src="images/star_after.png" /></td>' +
                    '<td class="star_img"><img src="images/star_after.png" /></td>' +
                    '<td class="star_img"><img src="images/star_after.png" /></td></tr></table>';
                break;
        }

        var pjHtml = '';
        if(tasklistData.evaluate == null){
            pjHtml = '--';
        }else{
            pjHtml = tasklistData.evaluate;
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
                '</li>'+

                '<li>'+
                '<span class="txt" style="display:block;float:none;">满意度</span>'+
                '<p class="inf">'+manyiHtml+'</p>'+
                '</li>'+
                '<li>'+
                '<span class="txt">评价</span>'+
                '<p class="inf">'+ pjHtml +'</p>'+
                '</li>'

        }else{
            console.log("imgLiEle" + imgLiEle);
            tasklistData.exceptionStatus = "正常";
            var txtBanCi = '';
            if(tasklistData.tfoOrderNo == null || tasklistData.tfoOrderNo == 'null' || tasklistData.tfoOrderNo == undefined){

            }else{
                txtBanCi = '<li><span class="txt">班次号</span><p class="inf">'+tasklistData.tfoOrderNo+'</p></li>';
            }
            var orderdetail = '<li>'+
                '<span class="txt">订单号</span>'+
                '<p class="inf">'+tasklistData.orderNo+'</p>'+
                '</li>'+
                '<li>'+
                '<span class="txt">原单号</span>'+
                '<p class="inf">'+tasklistData.customerOriginalNo+'</p>'+
                '</li>'+
                txtBanCi+
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
                '</li>'+

                '<li>'+
                '<span class="txt" style="display:block;float:none;">满意度</span>'+
                '<p class="inf">'+manyiHtml+'</p>'+
                '</li>'+
                '<li>'+
                '<span class="txt">评价</span>'+
                '<p class="inf">'+ pjHtml +'</p>'+
                '</li>'
        }
        $(".popuptitle ul").html(orderdetail);
    }

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
    })
    $(".maskLayer .popup5 .popupTitle").click(function(){
        $(".maskLayer").hide();
        $(".maskLayer .popup5").hide();
    })

})
