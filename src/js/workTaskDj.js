
var partname = window.location.pathname;
var clickbtnTxt = "";

$(function(){
    var logininf = JSON.parse(localStorage.getItem("logininf"));

    var ua = window.navigator.userAgent.toLowerCase();
    /*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        $(".header").show();
        $(".main").css({
            "paddingTop":"0.88rem"
        })
    }*/
    $(".header .returnBtn").click(function(){
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            location.href = wechatUrl + "/syOauth2Login.html?r=/index.html";
        }else{
            location.href = "index.html";
        }
    })



    //勾选
    $(".main .orderCon .orderList").on("click", "li .round", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass("rounded");
        $(this).parents("li").toggleClass("checkedli");
        var totalNum = $(".main .orderCon .orderList li").length

        var roundennum = $(".main .orderCon .orderList li .rounded").length;
        if(roundennum == 0){
            $(".main .orderCon .orderSureBtn").hide();
            $(".main .orderCon .allAcceptBtn").show();
        }else{
            $(".main .orderCon .orderSureBtn").show();
            $(".main .orderCon .allAcceptBtn").hide();
        }
    })
    //end

    $(".maskLayer .popup5 .popupTitle a").click(function(){
        $(".maskLayer").hide();
        $(".maskLayer .popup5").hide();
    })

    ///////////////////////////  灯具 接单     页面 — 接单
    ///////////////////////////  灯具 揽货完成 页面 — 查看签收单
    $(".main .orderCon .orderList").on("click", "li .orderHandle .truck", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var orderid = $(this).parents("li").attr("orderid");
        var ordernum = $(this).parents("li").attr("ordernum");
        imgUrl = [];
        $(".uploadSealBtn").html('<li class="lastLi"><img src="images/cameraIcon.png" alt="" /></li>');
        if(partname == "/workTaskDj1.html" || partname == "//workTaskDj1.html"){   /////////   揽货完成页面
            $(".maskLayer .popup2").hide();
            $(".maskLayer .popup7").hide();
            $(".maskLayer .popup5").show();
            $(".maskLayer").show();
            $.ajax({
                url: omsUrl + '/driver/query/OrderInfoDetail?orderId='+orderid+'&orderNo='+ordernum,
                type: "post",
                beforeSend:function(){
                    loadData('show');
                },
                success: function(data) {
                    //改变状态成功   隐藏弹窗
                    var imgLiEle = "";
                    if(data.result.imgList == "" ||data.result.imgList == null || data.result.imgList == "null"){
                        imgLiEle = "暂无附件图片";
                    }else{
                        for(var i = 0; i < data.result.imgList.length;i++){
                            imgLiEle += '<li><img src="'+ ImgWebsite + data.result.imgList[i].extValue+'" alt="" /></li>'
                        }
                    }

                    $(".popup5 .imgList").html(imgLiEle);
                    loadData('hide');
                }
            })

        }else{     /////////  接单页面
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
            $(".normalorderbtn").removeClass("pointAndClick");
            $(".abnormalorderbtn").removeClass("pointAndClick1");
            $(".maskLayer").show();
            $(".maskLayer .popup7").show();

            $(".maskLayer .popup7 .orderDesc .orderTextBox").show();
        }

    })
    //end

    //http://wechat.suyechina.com/index.html


    var acptorderid = "';"
    //扫码获取订单号   显示弹窗信息
    function scanCodeTruck(){
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                //扫码 获取订单号
                acptorderid = res.resultStr;
                for(var i = 0;i < tasklistData.length;i++){
                    if(tasklistData[i].orderNo == acptorderid){
                        $(".main .orderCon .orderList li").removeClass("checkedli");
                        $(".main .orderCon .orderList li .round").removeClass("rounded");

                        $(".main .orderCon .orderList li").eq(i).addClass("checkedli");
                        $(".main .orderCon .orderList li").eq(i).find(".round").addClass("rounded");
                        //清除文本框内容
                        $(".abnormalDesc").val("");
                        $(".disposition").val("");
                        $(".customerTel").val("");
                        $(".customerName").val("");
                        $(".normalorderbtn").removeClass("pointAndClick");
                        $(".abnormalorderbtn").removeClass("pointAndClick1");

                        $(".maskLayer").show();
                        $(".maskLayer .popup7").show();
                        getCheckedInf();
                    }
                }
            }
        });
    }
    //end

    //全选
    ///////////////////////////  灯具 接单 页面 — 扫码接单
    $(".main .orderCon .allAcceptBtn .btn").click(function(e) {
        if(partname == "/workTaskDj0.html" || partname == "//workTaskDj0.html"){  // 接单页面 —— 扫码接单
            scanCodeTruck();
        }

        /*if(partname == "/allOrder.html" || partname == "//allOrder.html"){  // 接单页面 —— 扫码接单
            scanCodeTruck();
        }

        if(partname == "/allOrder1.html" || partname == "//allOrder1.html"){  // 装车页面 —— 扫码装车
            /!*console.log("扫码装车");
            console.log(tasklistData);*!/
            scanCodeTruck();
        }

        if(partname == "/allOrder2.html" || partname == "//allOrder2.html"){  // 配送页面 —— 扫码签收
            scanCodeTruck();
        }*/
    })
    //end


    //确认
    ///////////////////////////  灯具 接单 页面 — 多选  确认  接单
    $(".main .orderCon .orderSureBtn").click(function(){
        getCheckedInf();
    })
    //end

    //获取弹窗显示的数量和重量
    function getCheckedInf(){
        var totalweight = "0";
        var totalvolume = "0";
        var totalAmount = "0";
        var totalQty = "0";
        //获取选中订单的个数
        var checkednum = $(".main .orderCon .orderList .checkedli").length;
        //获取选中li的元素
        var checkedli = $(".main .orderCon .orderList .checkedli")
        if(checkednum == 0){
            loadData("show","当前未选中订单",true)
        }else{
            //清除文本框内容
            $(".abnormalDesc").val("");
            $(".disposition").val("");
            $(".customerTel").val("");
            $(".customerName").val("");
            $(".normalorderbtn").removeClass("pointAndClick");
            $(".abnormalorderbtn").removeClass("pointAndClick1");
            //弹窗显示
            $(".maskLayer").show();
            $(".maskLayer .popup7").show();
            $(".maskLayer .popup7 .orderDesc .orderTextBox").show();
            //获取接单合计
            $(".maskLayer .popup7 .orderCon .ordernum").html("接受总数: "+checkednum+"个");
            $(".maskLayer .popup2 .orderCon .ordernum").html("接受总数: "+checkednum+"个");

            //获取重量和体积
            for(var i = 0; i < checkedli.length;i++){
                totalweight = 　(parseFloat(totalweight) + parseFloat(checkedli.eq(i).children(".weightnum").val())).toFixed(2);
                totalvolume = (parseFloat(totalvolume) + parseFloat(checkedli.eq(i).children(".volumenum").val())).toFixed(2);
                totalQty = parseInt(totalQty) + parseInt(checkedli.eq(i).children(".qtyNum").val())
                totalAmount = (parseFloat(totalAmount) + parseFloat(checkedli.eq(i).children(".amountnum").val())).toFixed(2);
            }
            $(".maskLayer .popup7 .orderCon .orderSize").html('数量:'+totalQty+' 重量：'+totalweight+'kg 体积：'+totalvolume+'m³ 价值：'+totalAmount+'元');
            $(".maskLayer .popup2 .orderCon .orderSize").html('数量:'+totalQty+' 重量：'+totalweight+'kg 体积：'+totalvolume+'m³ 价值：'+totalAmount+'元');
        }
    }


    //订单正常处理   /////////
    //////////////////  灯具 接单页面 — 接单 —— “接单”按钮
    $(".maskLayer .popup7 .popupBot2 .normalorderbtn").click(function(){
        if($(this).hasClass("pointAndClick")){

        }else{
            var checkedli = $(".main .orderCon .orderList .checkedli");
            if(partname == "/workTaskDj0.html" || partname == "//workTaskDj0.html"){  /// 接单页面
                var totalAmountInput0 = $('.totalAmountInput0').val().trim();
                var customerRefNoInput0 = $('.customerRefNoInput0').val().trim();
                if(totalAmountInput0 != '' && customerRefNoInput0 != ''){
                    if(checkNumType(totalAmountInput0) == '正数'){
                        /*if(imgUrl.length > 19){
                            alert("每次最多上传20张图片!");
                            return false;
                        }*/
                        $(this).addClass("pointAndClick");
                        changeActCodeDjFun(checkedli,"ACPT",totalAmountInput0,customerRefNoInput0);
                    }else{
                        loadData("show","请输入有效的运费值",true)
                        return false;
                    }
                }else{
                    loadData("show","运费、流水代码为必填项",true)
                    return false;
                }
            }


            /*if(partname == "/allOrder.html" || partname == "//allOrder.html"){  /// 接单页面
                if(imgUrl.length > 19){
                    alert("每次最多上传20张图片!");
                    return false;
                }
                $(this).addClass("pointAndClick");
                changeActCodeFun(checkedli,"COFM",abnormalManageInf);
            }
            if(partname == "/allOrder1.html" || partname == "//allOrder1.html"){   /// 装车页面
                if(imgUrl.length > 19){
                    alert("每次最多上传20张图片!");
                    return false;
                }
                $(this).addClass("pointAndClick");
                changeActCodeFun(checkedli,"LONT",abnormalManageInf);
            }
            if(partname == "/allOrder2.html" || partname == "//allOrder2.html"){  /// 配送页面
                if(imgUrl.length > 19){
                    alert("每次最多上传20张图片!");
                    return false;
                }
                if(imgStatus == 0){
                    alert("请先上传签收图");
                }else if(imgStatus == 1){
                    $(this).addClass("pointAndClick");
                    changeActCodeFun(checkedli,"ACPT",abnormalManageInf);
                }
            }*/

        }
    })


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

    //////////////////
    /////////  接单页面 — 接单（单选）、确认（多选） —— “异常”按钮 （ popup7 ） （弹出异常填写页面 popup2 ）
    $(".maskLayer .popup7 .popupBot2 .abnormalorderbtn").click(function(){
        $(".maskLayer .popup7").hide();
        $(".maskLayer .popup2").show();
    })

    //订单异常执行
    ///////////////////////////   灯具 接单页面— 接单 ——异常—— “接单”按钮 （ popup2 ）
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

        if(partname == "/workTaskDj0.html" || partname == "//workTaskDj0.html"){

            var totalAmountInput1 = $('.totalAmountInput1').val().trim();
            var customerRefNoInput1 = $('.customerRefNoInput1').val().trim();
            if(totalAmountInput1 != '' && customerRefNoInput1 != ''){
                if(checkNumType(totalAmountInput1) != '正数'){
                    loadData("show","请输入有效的运费值",true)
                    return false;
                }
            }else{
                loadData("show","运费、流水代码为必填项",true)
                return false;
            }

            if(imgUrl.length > 19){
                loadData("show","每次最多上传20张图片!",true)
                return false;
            }
            $(this).addClass("pointAndClick1");
            abnormalActCodeDjFun(checkedli,"ACPT",abnormalManageInf,choiceVal,'yichangjiedan',totalAmountInput1,customerRefNoInput1);
        }


        /*if(partname == "/allOrder.html" || partname == "//allOrder.html"){  ////////////// 接单页面
            if(imgUrl.length > 19){
                alert("每次最多上传20张图片!");
                return false;
            }
            $(this).addClass("pointAndClick1");
            abnormalActCodeFun(checkedli,"COFM",abnormalManageInf,choiceVal);
        }
        if(partname == "/allOrder1.html" || partname == "//allOrder1.html"){ ////////////// 装车页面
            if(imgUrl.length > 19){
                alert("每次最多上传20张图片!");
                return false;
            }
            $(this).addClass("pointAndClick1");
            abnormalActCodeFun(checkedli,"LONT",abnormalManageInf,choiceVal);
        }
        if(partname == "/allOrder2.html" || partname == "//allOrder2.html"){ ////////////// 配送页面
            if(imgUrl.length > 19){
                alert("每次最多上传20张图片!");
                return false;
            }
            if(imgStatus == 0){
                alert("请先上传签收图");
            }else if(imgStatus == 1){
                $(this).addClass("pointAndClick1");
                abnormalActCodeFun(checkedli,"ACPT",abnormalManageInf,choiceVal);
            }
        }*/
    })

    //订单异常不执行
    ///////////////////////////  接单页面 — 接单 ——异常—— “异常”按钮 （ popup2 ）
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
        if(partname == "/workTaskDj0.html" || partname == "//workTaskDj0.html"){ ////////////// 接单页面
            if(imgUrl.length > 19){
                loadData("show","每次最多上传20张图片!",true)
                return false;
            }
            if(imgStatus == 0){
                loadData("show","请先上传图片",true)
            }else if(imgStatus == 1){
                $(this).addClass("pointAndClick1");
                abnormalActCodeDjFun(checkedli,"ACPT",abnormalManageInf,choiceVal,'yichangtijiao');
            }
        }


        /*if(partname == "/allOrder.html" || partname == "//allOrder.html"){ ////////////// 接单页面
            if(imgUrl.length > 19){
                alert("每次最多上传20张图片!");
                return false;
            }
            if(imgStatus == 0){
                alert("请先上传图片");
            }else if(imgStatus == 1){
                $(this).addClass("pointAndClick1");
                abnormalActCodeFun(checkedli,"COFM",abnormalManageInf,choiceVal);
            }
        }
        if(partname == "/allOrder1.html" || partname == "//allOrder1.html"){ ////////////// 装车页面
            if(imgUrl.length > 19){
                alert("每次最多上传20张图片!");
                return false;
            }
            if(imgStatus == 0){
                alert("请先上传图片");
            }else if(imgStatus == 1){
                $(this).addClass("pointAndClick1");
                abnormalActCodeFun(checkedli,"LONT",abnormalManageInf,choiceVal);
            }

        }
        if(partname == "/allOrder2.html" || partname == "//allOrder2.html"){ ////////////// 配送页面
            if(imgUrl.length > 19){
                alert("每次最多上传20张图片!");
                return false;
            }
            if(imgStatus == 0){
                alert("请先上传图片");
            }else if(imgStatus == 1){
                $(this).addClass("pointAndClick1");
                abnormalActCodeFun(checkedli,"ACPT",abnormalManageInf,choiceVal);
            }
        }*/
    })


    // 司机接单
    function changeActCodeDjFun(checkedli,actcode,totalAmountInput,customerRefNoInput){
        loadData('show');
        /*if(imgUrl.length > 19){
            alert("每次最多上传20张图片!");
            return false;
        }*/
        var getLocationCodeVal = localStorage.getItem("locationCodeVal");
        var list = [];
        for(var i = 0; i < checkedli.length; i++) {
            var orderid = checkedli.eq(i).attr("orderid");
            var ordernum = checkedli.eq(i).attr("ordernum");
            list.push({
                orderId: orderid,
                actCode: actcode,
                orderNo: ordernum,
                operator:logininf.mobilePhone,
                latLng:getLocationCodeVal,
                customerRefNo: customerRefNoInput,
                totalAmount:totalAmountInput
            })
        }
        $.ajax({
            url: tmsUrl + '/driver/save/submitOrderActInfo',
            type: "post",
            contentType: 'application/json',
            data: JSON.stringify(list),
            success: function(data) {
                //改变状态成功   隐藏弹窗
                $(".maskLayer").hide();
                $(".maskLayer .popup2").hide();
                $(".maskLayer .popup2 .orderDesc .orderTextBox").hide();
                $(".ajax-loder-wrap").remove();
                loadData('hide');
                location.reload(true);
            }
        })
    }

    function abnormalActCodeDjFun(checkedli,actcode,actRemark,exceptionStatusNum,btnType,totalAmountInput,customerRefNoInput){
        if(imgUrl.length > 19){
            loadData("show","每次最多上传20张图片!",true)
            return false;
        }
        var getLocationCodeVal = localStorage.getItem("locationCodeVal");
        var list = [];
        if(btnType == 'yichangtijiao'){
            list = [];
            for(var i = 0; i < checkedli.length; i++) {
                var orderid = checkedli.eq(i).attr("orderid");
                var ordernum = checkedli.eq(i).attr("ordernum");
                list.push({
                    orderId: orderid,
                    actCode: actcode,
                    orderNo: ordernum,
                    operator:logininf.mobilePhone,
                    latLng:getLocationCodeVal,

                    exceptionStatus:exceptionStatusNum,
                    exceptionRemark: actRemark,
                    imgBase64:imgUrl
                })
                checkedli.eq(i).fadeOut();
            }
        }else{
            if(btnType == 'yichangjiedan'){
                list = [];
                for(var i = 0; i < checkedli.length; i++) {
                    var orderid = checkedli.eq(i).attr("orderid");
                    var ordernum = checkedli.eq(i).attr("ordernum");
                    list.push({
                        orderId: orderid,
                        actCode: actcode,
                        orderNo: ordernum,
                        operator:logininf.mobilePhone,
                        latLng:getLocationCodeVal,
                        customerRefNo: customerRefNoInput,
                        totalAmount:totalAmountInput
                    })
                }
            }
        }

        /*for(var i = 0; i < checkedli.length; i++) {
            var orderid = checkedli.eq(i).attr("orderid");
            var ordernum = checkedli.eq(i).attr("ordernum");
            list.push({
                orderId: orderid,
                actCode: actcode,
                orderNo: ordernum,
                operator:logininf.mobilePhone,
                latLng:getLocationCodeVal,

                exceptionStatus:exceptionStatusNum,
                exceptionRemark: actRemark,
                imgBase64:imgUrl
            })
            checkedli.eq(i).fadeOut();
        }*/

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
                $(".maskLayer .popup2 .orderDesc .orderTextBox").hide();
                loadData('hide');
                location.reload(true);

            }
        })

    }

    //正常接单、装车  改变code
    function changeActCodeFun(checkedli,actcode,actRemark){
        loadData('show');
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
            //	console.log(actRemark1);
            if(actRemark1 == ",,,"){
                var actRemarkTxt = actRemark
            }else{
                var actRemarkTxt = actRemark1
            }

            //	console.log(actRemarkTxt);
            list.push({
                orderId: orderid,
                actCode: actcode,
                exceptionRemark: actRemarkTxt,
                orderNo: ordernum,
                imgBase64:imgUrl,
                operator:logininf.mobilePhone,
                latLng:getLocationCodeVal
            })
        }
        //	console.log(list);

        $.ajax({
            url: tmsUrl + '/driver/save/submitOrderActInfo',
            type: "post",
            contentType: 'application/json',
            data: JSON.stringify(list),
            success: function(data) {
                //改变状态成功   隐藏弹窗
                $(".maskLayer").hide();
                $(".maskLayer .popup2").hide();
                $(".maskLayer .popup2 .orderDesc .orderTextBox").hide();
                $(".ajax-loder-wrap").remove();
                loadData('hide');
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
                $(".maskLayer .popup2 .orderDesc .orderTextBox").hide();
                loadData('hide');
                location.reload(true);

            }
        })

    }
    //end



    function getPageInf(actCode){
        pageInf = {
            "actCode":actCode,
            "carDrvContactTel":logininf.mobilePhone,
            "startCompleteTime":getCurrentTime("2"),
            "endCompleteTime":getQueryTime(-1),
            "isNoException":true,
            "pageInfo": {
                pageNum: 1,
                pageSize: 150
            }
        };
    }

    //获取任务列表列表
    /*if(partname == "//allOrder.html" || partname == "/allOrder.html"){
        getPageInf("DIST")
        clickbtnTxt = "接单";
        orderListFun();
        var tasklistData = "";
    }
    if(partname == "//allOrder1.html" || partname == "/allOrder1.html"){
        getPageInf("COFM")
        clickbtnTxt = "装车"
        orderListFun();
    }
    if(partname == "//allOrder2.html" || partname == "/allOrder2.html"){
        getPageInf("LONT")
        clickbtnTxt = "签收"
        orderListFun();
    }
    if(partname == "//allOrder3.html" || partname == "/allOrder3.html"){
        getPageInf("ACPT")
        orderListFun();
        clickbtnTxt = "查看签收单"
    }
    if(partname == "//allOrder4.html" || partname == "/allOrder4.html"){
        pageInf = {
            "carDrvContactTel":logininf.mobilePhone,
            "startCompleteTime":getCurrentTime("2"),
            "endCompleteTime":getQueryTime(-1),
            "isException":true,
            "pageInfo": {
                pageNum: 1,
                pageSize: 150
            }
        };
        orderListFun();
    }*/

    if(partname == "//workTaskDj0.html" || partname == "/workTaskDj0.html"){
        getPageInf("DIST");
        clickbtnTxt = "接单";
        orderListDjFun();
        var tasklistData = "";
    }else if(partname == "//workTaskDj1.html" || partname == "/workTaskDj1.html"){
        getPageInf("ACPT");
        orderListDjFun();
        clickbtnTxt = "查看签收单"
    }

    function orderListFun() {
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
                var orderData = data.result;
                var orderlist = "";
                var paymentItem = "";
                var classname = "";
                tasklistData = data.result;
                if(data.result.length == 0){
                    if(partname == "//allOrder2.html" || partname == "/allOrder2.html"){
                        $('.header .right').css('display','none');
                    }
                    var timer1 = setTimeout(function(){
                        $(".orderCon").append('<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;">'+
                            '<img src="images/noContent.png" alt=""  style="width: 3rem; height: auto; display: block;"/>'+
                            '</p>');
                    },600)
                }else{
                    for(var i = 0; i < data.result.length; i++) {
                        if(data.result[i].exceptionStatus == "1" || data.result[i].exceptionStatus ==  "2"){
                            classname = "excpli"
                        }else{
                            classname = "";
                        }
                        if(data.result[i].actCode == "DIST"){
                            data.result[i].actCode = "接单"
                        }
                        if(data.result[i].actCode == "COFM"){
                            data.result[i].actCode = "装车"
                        }
                        if(data.result[i].actCode == "LONT"){
                            data.result[i].actCode = "配送"
                        }
                        if(data.result[i].actCode == "ACPT"){
                            data.result[i].actCode = "签收"
                        }

                        if(data.result[i].actCode == "EXCP"){
                            data.result[i].actCode = "异常"
                        }
                        //单位换算
                        //体积
                        if(data.result[i].volumeUnit == "CM3"){
                            //console.log("1");
                            data.result[i].totalVolume = (data.result[i].totalVolume/parseInt(1000000)).toFixed(2);
                        }

                        //重量
                        if(data.result[i].weightUnit == "TN"){
                            //console.log("2");
                            data.result[i].totalWeight = (data.result[i].totalWeight*parseFloat(0.4535924)).toFixed(2);
                        }else if(data.result[i].weightUnit == "LB"){
                            //console.log("3");
                            data.result[i].totalWeight = (data.result[i].totalWeight*parseFloat(1000)).toFixed(2);
                        }

                        //价值
                        if(data.result[i].currency == "USD"){
                            //console.log(data.result[i].totalAmount);
                            data.result[i].totalAmount = (data.result[i].totalAmount*parseFloat(6.5191)).toFixed(2);
                            //console.log(data.result[i].totalAmount);
                        }

                        // 付款方式
                        if(orderData[i].payment == "spot"){
                            paymentItem = '<p class="receiverAddress">收款方式：现付</p>'
                        }else if(orderData[i].payment == "collect"){
                            paymentItem = '<p class="receiverAddress">收款方式：到付</p>'
                        }else if(orderData[i].payment == "voucher"){
                            paymentItem = '<p class="receiverAddress">收款方式：凭单回复</p>'
                        }
                        if(partname == "//allOrder5.html" || partname == "/allOrder5.html"){
                            orderlist += '<li class="'+classname+'" ordernum=' + orderData[i].orderNo + ' orderid=' + orderData[i].omOrderId + ' actCode=' + orderData[i].actCode + ' >'+
                                '<input type="hidden" class="weightnum" value="'+orderData[i].totalWeight+'" />'+
                                '<input type="hidden" class="weightunit" value="'+orderData[i].weightUnit+'" />'+
                                '<input type="hidden" class="volumenum" value="'+orderData[i].totalVolume+'" />'+
                                '<input type="hidden" class="volumeunit" value="'+orderData[i].volumeUnit+'" />'+
                                '<input type="hidden" class="amountnum" value="'+orderData[i].totalAmount+'" />'+
                                '<input type="hidden" class="qtyNum" value="'+orderData[i].totalQty+'" />'+
                                '<div class="right">'+
                                '<p class="ordernum">订单号：'+orderData[i].orderNo+'</p>'+
                                '<p class="ordernum"style="line-height:0.36rem;height:0.4rem;">原单号：'+orderData[i].customerOriginalNo+'</p>'+
                                '<p class="ordernum"style="line-height:0.36rem;height:0.4rem;">班次号：'+orderData[i].tfoOrderNo+'</p>'+
                                '<p class="receiverAddress">客户：'+orderData[i].stoPartyName+' &nbsp;&nbsp;配送日期：'+timestampToTime1(orderData[i].shpDtmTime)+' &nbsp;&nbsp;</p>'+
                                '<p class="receiverAddress">当前状态：'+orderData[i].actCode+'</p>'+
                                '<p class="receiverAddress">收货地址：'+orderData[i].stoAddress+'</p>'+paymentItem+
                                '</div>'+
                                '<div class="orderHandle">'+
                                '<a href="javascript:;" class="truck">'+clickbtnTxt+'</a>'+
                                '<p class="photo">'+
                                '<img src="images/top_pic.png" alt="" />'+
                                '<span class="txt">上传附件图片</span>'+
                                '</p>'+
                                '</div>'+
                                '<p class="round"></p>'+
                                '</li>'
                        }else{
                            if(orderData[i].actRemark == "null" || orderData[i].actRemark == "" || orderData[i].actRemark == null){
                                orderData[i].actRemark = "","","","";
                            }
                            orderlist += '<li class="'+classname+'" ordernum=' + orderData[i].orderNo + ' orderid=' + orderData[i].omOrderId + ' actCode=' + orderData[i].actCode + ' >'+
                                '<span class="actRemark" style="display:none;">'+orderData[i].actRemark+'</span>'+
                                '<input type="hidden" class="weightnum" value="'+orderData[i].totalWeight+'" />'+
                                '<input type="hidden" class="weightunit" value="'+orderData[i].weightUnit+'" />'+
                                '<input type="hidden" class="volumenum" value="'+orderData[i].totalVolume+'" />'+
                                '<input type="hidden" class="volumeunit" value="'+orderData[i].volumeUnit+'" />'+
                                '<input type="hidden" class="amountnum" value="'+orderData[i].totalAmount+'" />'+
                                '<input type="hidden" class="qtyNum" value="'+orderData[i].totalQty+'" />'+
                                '<div class="right">'+
                                '<p class="ordernum">订单号：'+orderData[i].orderNo+'</p>'+
                                '<p class="ordernum" style="line-height:0.36rem;height:0.4rem;">原单号：'+orderData[i].customerOriginalNo+'</p>'+
                                '<p class="ordernum"style="line-height:0.36rem;height:0.4rem;">班次号：'+orderData[i].tfoOrderNo+'</p>'+
                                '<p class="shipAddress">数量：'+orderData[i].totalQty+' 重量：'+orderData[i].totalWeight+'kg 体积：'+orderData[i].totalVolume+'m³ <br/>价值：'+orderData[i].totalAmount+'元</p>'+
                                '<p class="receiverAddress">客户：'+orderData[i].stoPartyName+' &nbsp;&nbsp;配送日期：'+timestampToTime1(orderData[i].shpDtmTime)+' &nbsp;&nbsp;</p>'+
                                '<p class="receiverAddress">收货地址：'+orderData[i].stoAddress+'</p>'+paymentItem+
                                '</div>'+
                                '<div class="orderHandle">'+
                                '<a href="javascript:;" class="truck">'+clickbtnTxt+'</a>'+
                                '<p class="photo">'+
                                '<img src="images/top_pic.png" alt="" />'+
                                '<span class="txt">上传附件图片</span>'+
                                '</p>'+
                                '</div>'+
                                '<p class="round"></p>'+
                                '</li>'
                        }


                    }

                    $(".main .orderCon .orderList").html(orderlist);

                }
            },
            error: function(xhr) {

            }
        })
    }

    function orderListDjFun() {
        $.ajax({
            url: tmsUrl + '/driver/query/receivingOrderTaskInfoPage',
            type: "post",
            contentType: 'application/json',
            beforeSend:function(){
                $(".main").append('<div class="ajax-loder-wrap"><img src="../images/ajax-loader.gif" class="ajax-loader-gif"/><p class="loading-text">加载中...</p></div>');
            },
            data: JSON.stringify(pageInf),
            success: function(data) {
                $(".ajax-loder-wrap").remove();
                var orderData = data.result;
                var orderlist = "";
                var paymentItem = "";
                var classname = "";
                tasklistData = data.result;
                if(data.result.length == 0){
                    var timer1 = setTimeout(function(){
                        $(".orderCon").append('<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;">'+
                            '<img src="images/noContent.png" alt=""  style="width: 3rem; height: auto; display: block;"/>'+
                            '</p>');
                    },600)
                }else{
                    for(var i = 0; i < data.result.length; i++) {
                        if(data.result[i].exceptionStatus == "1" || data.result[i].exceptionStatus ==  "2"){
                            classname = "excpli"
                        }else{
                            classname = "";
                        }
                        if(data.result[i].actCode == "DIST"){
                            data.result[i].actCode = "接单"
                        }
                        if(data.result[i].actCode == "COFM"){
                            data.result[i].actCode = "装车"
                        }
                        if(data.result[i].actCode == "LONT"){
                            data.result[i].actCode = "配送"
                        }
                        if(data.result[i].actCode == "ACPT"){
                            data.result[i].actCode = "签收"
                        }
                        if(data.result[i].actCode == "EXCP"){
                            data.result[i].actCode = "异常"
                        }
                        //单位换算
                        //体积
                        if(data.result[i].volumeUnit == "CM3"){
                            //console.log("1");
                            data.result[i].totalVolume = (data.result[i].totalVolume/parseInt(1000000)).toFixed(2);
                        }

                        //重量
                        if(data.result[i].weightUnit == "TN"){
                            //console.log("2");
                            data.result[i].totalWeight = (data.result[i].totalWeight*parseFloat(0.4535924)).toFixed(2);
                        }else if(data.result[i].weightUnit == "LB"){
                            //console.log("3");
                            data.result[i].totalWeight = (data.result[i].totalWeight*parseFloat(1000)).toFixed(2);
                        }

                        //价值
                        if(data.result[i].currency == "USD"){
                            //console.log(data.result[i].totalAmount);
                            data.result[i].totalAmount = (data.result[i].totalAmount*parseFloat(6.5191)).toFixed(2);
                            //console.log(data.result[i].totalAmount);
                        }

                        // 付款方式
                        var paymentClass = '';
                        switch (data.result[i].payment)
                        {
                            case 'spot':
                                paymentClass = 'orderListLisIcon0';
                                break;
                            case 'collect':
                                paymentClass = 'orderListLisIcon1';
                                break;
                            case 'monthly':
                                paymentClass = 'orderListLisIcon2';
                                break;
                            default:
                                paymentClass = '';
                        }

                        if(orderData[i].actRemark == "null" || orderData[i].actRemark == "" || orderData[i].actRemark == null){
                            orderData[i].actRemark = "","","","";
                        }
                        // 付款方式
                        if(orderData[i].payment == "spot"){
                            paymentItem = '<p class="receiverAddress">收款方式：现付</p>'
                        }else if(orderData[i].payment == "collect"){
                            paymentItem = '<p class="receiverAddress">收款方式：到付</p>'
                        }else if(orderData[i].payment == "voucher"){
                            paymentItem = '<p class="receiverAddress">收款方式：凭单回复</p>'
                        }
                        orderlist += '<li class="orderListLis '+classname+'" ordernum=' + orderData[i].orderNo + ' orderid=' + orderData[i].omOrderId + ' actCode=' + orderData[i].actCode + ' >'+
                            '<span class="orderListLisIcon '+paymentClass+'"></span>'+
                            '<span class="actRemark" style="display:none;">'+orderData[i].actRemark+'</span>'+
                            '<input type="hidden" class="weightnum" value="'+orderData[i].totalWeight+'" />'+
                            '<input type="hidden" class="weightunit" value="'+orderData[i].weightUnit+'" />'+
                            '<input type="hidden" class="volumenum" value="'+orderData[i].totalVolume+'" />'+
                            '<input type="hidden" class="volumeunit" value="'+orderData[i].volumeUnit+'" />'+
                            '<input type="hidden" class="amountnum" value="'+orderData[i].totalAmount+'" />'+
                            '<input type="hidden" class="qtyNum" value="'+orderData[i].totalQty+'" />'+
                            '<div class="right">'+
                            '<p class="ordernum">订单号：'+orderData[i].orderNo+'</p>'+
                            '<p class="ordernum" style="line-height:0.36rem;height:0.4rem;">原单号：'+orderData[i].customerOriginalNo+'</p>'+
                            '<p class="ordernum"style="line-height:0.36rem;height:0.4rem;display: none;">班次号：'+orderData[i].tfoOrderNo+'</p>'+
                            '<p class="shipAddress">数量：'+orderData[i].totalQty+' 重量：'+orderData[i].totalWeight+'kg 体积：'+orderData[i].totalVolume+'m³ <br/>价值：'+orderData[i].totalAmount+'元</p>'+
                            '<p class="receiverAddress">客户：'+orderData[i].stoPartyName+' &nbsp;&nbsp;配送日期：'+timestampToTime1(orderData[i].shpDtmTime)+' &nbsp;&nbsp;</p>'+
                            '<p class="receiverAddress">收货地址：'+orderData[i].stoAddress+'</p>'+paymentItem+
                            '</div>'+
                            '<div class="orderHandle">'+
                            '<a href="javascript:;" class="truck">'+clickbtnTxt+'</a>'+
                            '<p class="photo">'+
                            '<img src="images/top_pic.png" alt="" />'+
                            '<span class="txt">上传附件图片</span>'+
                            '</p>'+
                            '</div>'+
                            '<p class="round"></p>'+
                            '</li>'

                    }

                    $(".main .orderCon .orderList").html(orderlist);

                }
            },
            error: function(xhr) {

            }
        })
    }
    //获取任务数据 结束


    getLocationFun();      // 获取司机位置信息上传

    //获取每个状态的数量
    getStateNumFun();
    getlistData = "";
    function getStateNumFun() {
        var pageInf = {
            "carDrvContactTel":logininf.mobilePhone,
            "startCompleteTime":getCurrentTime("2"),
            "endCompleteTime":getQueryTime(-1),
            "pageInfo": {
                pageNum: 1,
                pageSize: 150
            }
        };

        $.ajax({
            url: tmsUrl + '/driver/query/receivingOrderActCount',
            type: "post",
            contentType: 'application/json',
            data: JSON.stringify(pageInf),
            success: function(data) {
                if(data != undefined){
                    if(data.result != null){
                        if(data.result.distCount != null){
                            $(".footer ul li").eq(0).children("a").html('接单<span>('+data.result.distCount+')</span>');
                        }
                        if(data.result.acptCount != null){
                            $(".footer ul li").eq(1).children("a").html('揽货完成<span>('+data.result.acptCount+')</span>');
                        }
                    }
                }
            },
            error: function(xhr) {

            }
        })
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
        $(".maskLayer .popup7 .orderDesc .orderTextBox").hide();
    })

    $(".popup3 .popupCon .popuptitle ul").on("click","li .seeAnnex span",function(){
        $(".popup3").hide();
        $(".popup6").show();
    })


    $(".maskLayer .popup6 .popupTitle a").click(function(){
        $(".popup6").hide()
        $(".maskLayer").hide();
    })


    var seeOrderDetailId = "";
    //点击获取详情
    $(".main .orderCon").on("click",".orderList li",function(e){
        var orderid = $(this).attr("orderid");
        var ordernum = $(this).attr("ordernum");
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
                $(".maskLayer").show();
                $(".maskLayer .popup3").show();
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
            /*console.log(actRemarkLen);
            console.log(tasklistData.exceRemarkList[actRemarkLen]);*/
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
                '</li>'

        }else{
            //	console.log("imgLiEle" + imgLiEle);
            tasklistData.exceptionStatus = "正常";
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
                '<span class="txt">支付状态</span>'+
                '<p class="inf">'+tasklistData.payStatus+'</p>'+
                '</li>'+
                '<li>'+
                '<span class="txt" style="display:block;float:none;">附件图片</span>'+
                '<p class="inf seeAnnex">'+ imgLiEle +'</p>'+
                '</li>'

        }
        $(".popuptitle ul").html(orderdetail);
    }

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

    function getQueryTime(dateParmes){
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
