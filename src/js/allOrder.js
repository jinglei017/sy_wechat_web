var clickbtnTxt = "";
var myTaskStep = "0";
var goBackTxt = "";

$(function(){
	var logininf = JSON.parse(localStorage.getItem("logininf"));
	var ua = window.navigator.userAgent.toLowerCase();

	$(".header .returnBtn").click(function(){
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            location.href = wechatUrl + "/syOauth2Login.html?r=/index.html";
        }else{
            location.href = "index.html";
        }
	})

    $(".headerConClasses .searchClass").click(function(){
        $(".searchLayer").slideToggle(100);
        $(".searchCon ul li .classNo").val("");
        $(".searchCon ul li .abnormalStatus").val("");
        $(".searchCon ul li .statusSelect").val("");
        $("#startTime").val("");
        $("#endTime").val("");
    })

    $("#startTime").attr("placeholder",getCurrentTime("1"));
    $("#endTime").attr("placeholder",getCurrentTime("-1"));
    // 初始班次列表查询
    getClassesList('0');

    // 输入条件查询班次列表
    $(".searchCon .searchbtn").click(function(){
        getClassesList('1');
        $(".searchLayer").slideToggle(100);
    })

    // 最近一周or三个月查询
    $(".mouthSearch p").click(function(){
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        if($(this).index() == 0){
            getClassesList("2");
        }else if($(this).index() == 1){
            getClassesList("3");
        }
        $(".searchLayer").slideToggle(100);
    })


    // 切换班次
    $(".header .txt img").click(function(){
        $(".divBodyClasses").show();
    });
    // 关闭班次
    $(".headerConClasses .closeClass").click(function(){
        $(".divBodyClasses").hide();
    });
    // 获取班次列表
    var tfoCustomerRefNoList = [],tfoOrderNoList = [];
    function getClassesList(typeNum){
        var searchFormArr = {};
        if(typeNum == '0'){
            searchFormArr = {
                carDrvContactTel: logininf.mobilePhone,
                startCompleteTime: getCurrentTime("1"),
                endCompleteTime: getCurrentTime("-1")
            };
        } else if(typeNum == '1'){
            var startCreateTime = $("#startTime").val().trim();
            var endCreateTime = $("#endTime").val().trim();
            var classNoInp = $(".searchCon ul li .classNo").val().trim();
            var exceptionStatus = $(".searchCon ul li .abnormalStatus").val().trim();
            var actCodeSelect = $(".searchCon ul li .statusSelect").val().trim();
            if(startCreateTime == ""){
                startCreateTime = getCurrentTime("1")
            }
            if(endCreateTime == ""){
                endCreateTime = getCurrentTime("-1")
            }
            searchFormArr = {
                carDrvContactTel: logininf.mobilePhone,
                tfoCustomerRefNo: classNoInp,
                startCompleteTime: startCreateTime,
                endCompleteTime: endCreateTime,
                isException: exceptionStatus,
                completeStatus: actCodeSelect
            }
        } else if(typeNum == '2'){
            searchFormArr = {
                carDrvContactTel: logininf.mobilePhone,
                startCompleteTime: getCurrentTime("0"),
                endCompleteTime: getCurrentTime("-7")
            };
        } else if(typeNum == '3'){
            searchFormArr = {
                carDrvContactTel: logininf.mobilePhone,
                startCompleteTime: getCurrentTime("0"),
                endCompleteTime: getCurrentTime("-90")
            };
        }
        $(".middleConClasses").empty();
        tfoCustomerRefNoList = [];
        postRequest(omsUrl + '/query/tfoListInfo?token='+logininf.token+'&timeStamp='+logininf.timeStamp,searchFormArr,function(data){
            if(data.result != null && data.result.length > 0){
                var classesList = data.result;
                var itemDiv = "";
                for(var i=0; i<classesList.length;i++){
                    var tfoCompleteTime = classesList[i].tfoCompleteTime.split('.')[0];
                    itemDiv += '<div class="itemDiv" tfoOrderId='+classesList[i].tfoOrderId+'> '+
                        '<div class="itemCon"> '+
                        '<div class="itemTxt"> '+
                        '<p>班次号：<span>'+classesList[i].tfoCustomerRefNo+'</span></p> '+
                        '</div> '+
                        '<div class="itemLis"> '+
                        '<p class="itemLi1">司机：<span>'+classesList[i].drvContactName+'</span></p> '+
                        '<p class="itemLi2">件毛体：<span>'+classesList[i].tfoTotalQty+'件 * '+classesList[i].tfoTotalWeight+'kg * '+classesList[i].tfoTotalVolume+'m³</span></p> '+
                        '<p class="itemLi1">车牌号：<span>'+classesList[i].drvEqpNo+'</span></p> '+
                        '<p class="itemLi2">发货时间：<span>'+tfoCompleteTime+'</span></p> '+
                        '</div> '+
                        '</div> '+
                        '</div>';
                    if(classesList[i].tfoCustomerRefNo){
                        tfoCustomerRefNoList.push(classesList[i].tfoCustomerRefNo);
                    }else{
                        tfoCustomerRefNoList.push("暂无当前班次号");
                    }
                    tfoOrderNoList.push(classesList[i].tfoOrderNo)
                }
                $(".middleConClasses").html(itemDiv);
            }else{
                $(".middleConClasses").html('<p class="noClassesP">---未查询到班次---</p>');
            }
        });
    }

    // 定义订单类型列表（接单、装车、配送、签收、异常）
    var currentTypeOrderList = [];
    var tfoOrderId = "";
    // 选中班次
    $(".divConClasses .middleConClasses").on("click",".itemDiv",function(e){
        $(".header .txt span").html(tfoCustomerRefNoList[$(this).index()]);
        localStorage.setItem("tfoOrderNo", tfoOrderNoList[$(this).index()]);
        tfoOrderId = $(this).attr("tfoOrderId");
        getTjoOrderInfo(tfoOrderId);
        $(".main .orderCon .allAcceptBtn").show();
    });
    // 获取班次对应订单
    function getTjoOrderInfo(tfoOrderId){
        getRequest(omsUrl + '/query/tjoOrderInfoByTfo?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&tfoOrderId='+tfoOrderId,function(data){
            if(data.msg == "success" || data.msg == "SUCCESS"){
                $(".divBodyClasses").hide();
                if(data.result){
                    if(myTaskStep == '0'){
                        currentTypeOrderList = data.result.receiptList;
                    } else if(myTaskStep == '1'){
                        currentTypeOrderList = data.result.loadingList;
                    }else if(myTaskStep == '2'){
                        currentTypeOrderList = data.result.deliveryList;
                    }else if(myTaskStep == '3'){
                        currentTypeOrderList = data.result.signForList;
                    }else if(myTaskStep == '4'){
                        currentTypeOrderList = data.result.abnormalList;
                    }
                    renderPageCont(currentTypeOrderList);
                    $(".footer ul li").eq(0).children("a").html('接单<span>('+data.result.receiptList.length+')</span>');
                    $(".footer ul li").eq(1).children("a").html('装车<span>('+data.result.loadingList.length+')</span>');
                    $(".footer ul li").eq(2).children("a").html('配送<span>('+data.result.deliveryList.length+')</span>');
                    $(".footer ul li").eq(3).children("a").html('签收<span>('+data.result.signForList.length+')</span>');
                    $(".footer ul li").eq(4).children("a").html('异常<span>('+data.result.abnormalList.length+')</span>');
                }
            }else{
                loadData('show', data.msg, true);
            }
        })
    }

    //底部点击事件
    $(".footer ul li").click(function(){
        myTaskStep = $(this).index();
        $(".footer ul li").removeClass("active");
        $(".footer ul li").eq(myTaskStep).addClass("active");
        $(".main .orderCon .noContent").remove();
        $(".main .orderCon .orderList").empty();
        $(".header .right2").hide();
        $(".main .orderCon .orderSureBtn").hide();
        $(".main .orderCon .orderList li").removeClass("checkedli");
        $(".main .orderCon .orderList li .round").removeClass("rounded");
        getTjoOrderInfo(tfoOrderId);
    });

    // 局部内容切换
    function partlyChange(myTaskStep){
        if (myTaskStep == '0') {
            clickbtnTxt = "接单";
            goBackTxt = '';
            $(".scanCodeBtn").show();
            $(".scanCodeBtn").html("扫码接单");
            $(".popup7 .normalorderbtn").html("接单");
            $(".popup2 .normalorderbtn").html("接单");
            $(".orderContentUls").css("transform",'translateX(0)');
        } else if (myTaskStep == '1') {
            clickbtnTxt = "装车";
            goBackTxt = '';
            $(".scanCodeBtn").show();
            $(".scanCodeBtn").html("扫码装车");
            $(".popup7 .normalorderbtn").html("装车");
            $(".popup2 .normalorderbtn").html("装车");
            $(".orderContentUls").css("transform",'translateX(-20%)');
        } else if (myTaskStep == '2') {
            clickbtnTxt = "签收";
            goBackTxt = '<a href="javascript:;" class="locLable">地址标签</a>';
            $(".scanCodeBtn").show();
            $(".scanCodeBtn").html("扫码签收");
            $(".popup7 .normalorderbtn").html("签收");
            $(".popup2 .normalorderbtn").html("签收");
            $(".orderContentUls").css("transform",'translateX(-40%)');
        } else if (myTaskStep == '3') {
            clickbtnTxt = "查看签收单";
            goBackTxt = '<a href="javascript:;" class="locLable">地址标签</a>';
            $(".scanCodeBtn").hide();
            $(".orderContentUls").css("transform",'translateX(-60%)');
        } else if (myTaskStep == '4') {
            clickbtnTxt = "异常";
            goBackTxt = "";
            $(".scanCodeBtn").hide();
            $(".popup2 .normalorderbtn").html("确认");
            $(".orderContentUls").css("transform",'translateX(-80%)');
        }

        if (myTaskStep == '1'){
            $(".equipmentBtn").show();
        }else{
            $(".equipmentBtn").hide();
        }
    }

    var materialList = [];
    var isEditE = false;

    $(".allAcceptBtn").on("click",".equipmentBtn",function () {
        $(".header .txt img").hide();
        $(".equipModule1").show();
        $(".tableInfoEquip .lookJumpEquipHead").hide();
        addEquipList(tfoOrderId);
    });

    $(".retListModule1").click(function () {
        $(".equipModule1").hide();
        $(".header .txt img").show();
    });
    $(".retListModule2").click(function () {
        $(".popupM").hide();
        $(".popupE").show();
    });

    // 保存 物料信息
    $(".saveInfoMa").click(function () {
        var ItemName = $(".materialName").val();
        var ItemRemark = $(".currentRemark").val().trim();
        var ItemQty = $(".currentQty").val().trim();
        var itemNature = $(".currentType").val();
        if(ItemQty == "" || ItemQty == undefined){
            loadData('show', "物料数量不能为空！", true);
            return false;
        }

        var searchFormArr = {
            itemNature: itemNature,
            omOrderId: tfoOrderId,
            itemName: ItemName,
            itemCode: ItemName,
            remark: ItemRemark,
            qty: ItemQty,
            qtyUnit: '件'
        };
        if($(this).hasClass("active")){
            searchFormArr.omOrderItemId = $(this).attr("omOrderItemId");
        }
        postRequest(tmsUrl + '/driver/save/saveCarFollowEqpItemDetail?token='+logininf.token+'&timeStamp='+logininf.timeStamp,searchFormArr,function(data){
            addEquipList(tfoOrderId);
            isEditE = false;
        });
    });

    // 物料列表渲染
    function addEquipList(orderId){
        $(".tableInfoEquip>div").empty();
        materialList = [];
        getRequest(tmsUrl+'/wx/query/queryCarFollowEqpItemList.json?token='+logininf.token+'&timeStamp='+logininf.timeStamp+"&orderId="+orderId,function(data){
            if(data.result == null || data.result.length == 0){

            }else{
                materialList = data.result;
                $(".tableInfoEquip .lookJumpEquipHead").show();

                var equipList = "";
                for(var i=0;i<data.result.length;i++){
                    var item = data.result[i];
                    var itemNature = "",remark = "--";
                    if(item.itemNature == "DAM"){
                        itemNature = "破损";
                    }else{
                        itemNature = "正常";
                    }
                    if(!item.remark){
                        remark = "--";
                    }else{
                        remark = "item.remark";
                    }

                    equipList += "<ul class='lookJumpEquip'>" +
                        "<li>" +
                        "<span>"+item.itemName+"</span>" +
                        "</li>" +
                        "<li>" +
                        "<span>"+itemNature+"</span>" +
                        "</li>" +
                        "<li>" +
                        "<span>"+item.qty+"</span>" +
                        "</li>" +
                        "<li>" +
                        "<span>"+remark+"</span>" +
                        "</li>" +
                        "<li omOrderItemId="+item.omOrderItemId+">" +
                        "<span class='operate upload'>图片</span>" +
                        "<span class='operate edit'>修改</span>" +
                        "<span class='operate delete'>删除</span>" +
                        "</li>" +
                        "</ul>";
                }
                $(".tableInfoEquip>div").append(equipList);
            }

            $(".materialName").val("托盘");
            $(".currentType").val("GEN");
            $(".currentRemark").val("");
            $(".currentQty").val("");
        })
    }


    // 上传图标不同
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        $(".lastInput").hide();
    }else{
        $(".uploadImgList2 .lastLi").hide();
    }

    var currOmOrderItemId = "";
    // 查看图片
    $(".tableInfoEquip").on("click",".lookJumpEquip .upload",function(){
        if(isEditE == true){
            loadData('show', "请先保存修改信息！", true);
            return false;
        }

        imgUrlEqp = [];
        imgStatusEqp = 0;
        $(".popupM").show();
        $(".popupE").hide();
        $(".contentM .uploadImgList>div").empty();

        currOmOrderItemId = $(this).parents("li").attr("omOrderItemId");

        getRequest(tmsUrl + '/wx/get/orderItemImage?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&orderItemId='+currOmOrderItemId,function(data){
            if(data.result != null && data.result.length > 0){
                var imgli = "";
                for(var i=0;i<data.result.length;i++){
                    var item = data.result[i];
                    imgli += '<li><img src="'+ImgWebsite+item.extValue+'" extId="'+item.omExtId+'" /></li>';
                }
                $(".contentM .uploadImgList1>div").append(imgli)
            }
        })
    });

    var imgUrlEqp = [];
    var imgStatusEqp = 0;
    var currentImgState = 0;
    // 手机端上传图片
    $(".maskLayer1 .popupM .uploadImgList2").on("click",".lastLi",function(){
        wx.chooseImage({
            count: 4, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                var imgli = "";
                var realLocalIds = localIds.toString().split(',');
                for(var i=0;i< realLocalIds.length;i++){
                    imgli += '<li><img src="'+realLocalIds[i]+'" alt="" /></li>';
                    wx.getLocalImgData({
                        localId: realLocalIds[i], // 图片的localID
                        success: function (res) {
                            imgStatusEqp = 1;
                            var localData = res.localData; //localData是图片的base64数据，可以用img标签显示
                            var u = navigator.userAgent;
                            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                            if(isAndroid){
                                var resultStr = localData.replace(/[\r\n]/g, ""); //去掉回车换行
                                imgUrlEqp.push(resultStr);
                            }else{
                                imgUrlEqp.push(localData.split(',')[1])
                            }
                            if(imgUrlEqp.length == 4){
                                $(".uploadImgList2 .lastLi").hide();
                            }
                        }
                    });
                }
                $(".contentM .uploadImgList2>div").prepend(imgli);
            }
        });
    });
    // PC端上传图片
    $("#uploadIMG").change(function (e){
        var files = e.target.files; //获取图片
        var file = files[0];
        if (!/\/(?:jpeg|jpg|png)/i.test(file.type)) { // 接受 jpeg, jpg, png 类型的图片
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var resultBe = e.target.result;  //图片base64字符串、去掉回车换行
            var imgli = '<li><img src="'+resultBe+'" alt="" /></li>';
            $(".contentM .uploadImgList2>div").append(imgli);  //展示图片

            var result = resultBe.split(",")[1];
            imgUrlEqp.push(result);

            if(imgUrlEqp.length == 4){
                $(".lastInput").hide();
            }
        };
        reader.readAsDataURL(file);    //Base64
        imgStatusEqp = 1;
    });

    // 确认上传
    $(".maskLayer1 .popupM").on("click",".sureMBot span",function(){

        if(imgUrlEqp.length > 4){
            loadData("show","最多上传4张图片!",true);
            return false;
        }
        if(imgStatusEqp == 0){
            loadData("show","请先上传图片！",true)
        }else if(imgStatusEqp == 1){
            $.ajax({
                url: tmsUrl + "/wx/save/orderItemImage?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&orderItemId="+currOmOrderItemId,
                type: "post",
                beforeSend:function(){
                    loadData('show');
                },
                data: JSON.stringify(imgUrlEqp),
                contentType: 'application/json',
                success: function(data) {
                    loadData("show","保存成功！",true);
                    var imgli = "";
                    for(var i=0;i<data.result.length;i++){
                        var item = data.result[i];
                        imgli += '<li><img src="'+ImgWebsite+item.extValue+'" extId="'+item.omExtId+'" /></li>';
                    }
                    $(".contentM .uploadImgList>div").empty();
                    $(".contentM .uploadImgList1>div").append(imgli);

                    imgUrlEqp = [];
                    imgStatusEqp = 0;
                    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                        $(".uploadImgList2 .lastLi").show();
                    }else{
                        $(".lastInput").show();
                    }
                },
                error: function(){
                    loadData("show","上传图片失败，请稍后再试！",true)
                }
            })
        }
    });

    // 查看大图（已上传）
    $(".maskLayer1 .popupM").on("click",".uploadImgList1 img",function(){
        currentImgState = 1;
        var index = $(this).parents(".uploadImgList1 li").index();
        $(".maskLayer1 .popupM").hide();
        $(".maskLayer1 .popupI").show();
        $(".maskLayer1 .popupI img").attr({"src":$(this).attr("src"),"extId":$(this).attr("extId")});
    });

    // 查看大图（未上传）
    $(".maskLayer1 .popupM").on("click",".uploadImgList2 div img",function(){
        currentImgState = 2;
        var index = $(this).parents(".uploadImgList2 div li").index();
        $(".maskLayer1 .popupM").hide();
        $(".maskLayer1 .popupI").show();
        $(".maskLayer1 .popupI img").attr({"src":$(this).attr("src"),"index":index});
    });

    // 删除图片
    $(".maskLayer1 .popupI").on("click",".deleteThisImg",function(){
        if(currentImgState == 1){
            var extId = $(this).siblings("img").attr("extid");
            getRequest(tmsUrl + '/wx/del/orderItemImage?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&extId='+extId,function(data){
                $(".maskLayer1 .popupI").hide();
                $(".maskLayer1 .popupM").show();
                getRequest(tmsUrl + '/wx/get/orderItemImage?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&orderItemId='+currOmOrderItemId,function(data){
                    $(".contentM .uploadImgList>div").empty();
                    if(data.result != null && data.result.length > 0){
                        var imgli = "";
                        for(var i=0;i<data.result.length;i++){
                            var item = data.result[i];
                            imgli += '<li><img src="'+ImgWebsite+item.extValue+'" extId="'+item.omExtId+'" /></li>';
                        }
                        $(".contentM .uploadImgList1>div").append(imgli)
                    }
                });
            })
        }else if(currentImgState == 2){
            var index = $(this).siblings("img").attr("index");
            $(".maskLayer1 .popupI").hide();
            $(".maskLayer1 .popupM").show();
            imgUrlEqp.splice(index,1);
            $(".contentM .uploadImgList2>div li").eq(index).remove();

            if(imgUrlEqp.length < 4){
                if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                    $(".uploadImgList2 .lastLi").show();
                }else{
                    $(".lastInput").show();
                }
            }
        }
    });

    // 关闭图片
    $(".maskLayer1 .popupI").on("click",".closeThisImg",function(){
        $(".maskLayer1 .popupI").hide();
        $(".maskLayer1 .popupM").show();
    });

    // 修改
    $(".tableInfoEquip").on("click",".lookJumpEquip .edit",function(){
        if(isEditE == true){
            loadData('show', "请先保存修改信息！", true);
            return false;
        }
        var index = $(this).parents(".lookJumpEquip").index();
        var item = materialList[index];

        $(".materialName").val(item.itemName);
        $(".currentType").val(item.itemNature);
        $(".currentRemark").val(item.remark);
        $(".currentQty").val(item.qty);

        $(".saveInfoMa.active").attr("omOrderItemId",item.omOrderItemId);
        $(".saveInfoMa").eq(0).hide();
        $(".saveInfoMa.active").show();

        $(this).parent("li").html("<span class='operate cancel' style='color:#ed7d31;'>取消修改</span>");

        isEditE = true;
    });

    // 取消修改
    $(".tableInfoEquip").on("click",".lookJumpEquip .cancel",function(){
        var htmlTxt = "<span class='operate upload'>图片</span>" +
            "<span class='operate edit'>修改</span>" +
            "<span class='operate delete'>删除</span>";
        $(this).parents("li").html(htmlTxt);

        $(".materialName").val("托盘");
        $(".currentType").val("GEN");
        $(".currentRemark").val("");
        $(".currentQty").val("");

        $(".saveInfoMa").eq(0).show();
        $(".saveInfoMa.active").hide();

        isEditE = false;
    });

    // 删除
    $(".tableInfoEquip").on("click",".lookJumpEquip .delete",function(){
        if(isEditE == true){
            loadData('show', "请先保存修改信息！", true);
            return false;
        }
        var omOrderItemId = $(this).parents("li").attr("omOrderItemId");
        getRequest(tmsUrl + '/wx/del/delCarFollowEqpItemDetail?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&orderItemId='+omOrderItemId,function(data){
            addEquipList(tfoOrderId);
        });
    });



    // 页面渲染
    function renderPageCont(typeOrderList){
        partlyChange(myTaskStep);
        var myTaskDiv = $(".main .orderCon .orderContentUls .orderList").eq(myTaskStep);
        myTaskDiv.empty();
        if(typeOrderList.length == 0){
            myTaskDiv.append('<p class="noContent"><img src="images/noContent.png"/></p>');
        } else{
            var orderlist = "";
            for(var i = 0; i < typeOrderList.length; i++) {
                if(typeOrderList[i].tjoExceptionStatus == "1" || typeOrderList[i].tjoExceptionStatus ==  "2"){
                    classname = "excpli"
                }else{
                    classname = "";
                }
                if(typeOrderList[i].tjoActCode == "DIST"){
                    typeOrderList[i].tjoActCode = "接单"
                }
                if(typeOrderList[i].tjoActCode == "COFM"){
                    typeOrderList[i].tjoActCode = "装车"
                }
                if(typeOrderList[i].tjoActCode == "LONT"){
                    typeOrderList[i].tjoActCode = "配送"
                }
                if(typeOrderList[i].tjoActCode == "ACPT"){
                    typeOrderList[i].tjoActCode = "签收"
                }
                if(typeOrderList[i].tjoActCode == "EXCP"){
                    typeOrderList[i].tjoActCode = "异常"
                }
                //单位换算
                //体积
                if(typeOrderList[i].tjoVolumeUnit == "CM3"){
                    typeOrderList[i].tjoTotalVolume = (typeOrderList[i].tjoTotalVolume/parseInt(1000000)).toFixed(2);
                }

                //重量
                if(typeOrderList[i].tjoWeightUnit == "TN"){
                    typeOrderList[i].tjoTotalWeight = (typeOrderList[i].tjoTotalWeight*parseFloat(0.4535924)).toFixed(2);
                }else if(typeOrderList[i].tjoWeightUnit == "LB"){
                    typeOrderList[i].tjoTotalWeight = (typeOrderList[i].tjoTotalWeight*parseFloat(1000)).toFixed(2);
                }

                //价值
                if(typeOrderList[i].tjoCurrency == "USD"){
                    typeOrderList[i].tjoTotalAmount = (data.result[i].tjoTotalAmount*parseFloat(6.5191)).toFixed(2);
                }

                // 付款方式
                if(typeOrderList[i].payment == "spot"){
                    paymentItem = '<p class="receiverAddress">收款方式：现付</p>'
                }else if(typeOrderList[i].payment == "collect"){
                    paymentItem = '<p class="receiverAddress">收款方式：到付</p>'
                }else if(typeOrderList[i].payment == "voucher"){
                    paymentItem = '<p class="receiverAddress">收款方式：凭单回复</p>'
                }else{
                    paymentItem = "";
                }
                if(typeOrderList[i].actRemark == "null" || typeOrderList[i].actRemark == "" || typeOrderList[i].actRemark == null){
                    typeOrderList[i].actRemark = "","","","";
                }
                var tjoCompleteTime = typeOrderList[i].tjoCompleteTime.split('.')[0];
                var sfrAddressLable = "";
                if(myTaskStep == 2 || myTaskStep == 3){
                    sfrAddressLable = '<p class="receiverAddress">地址标签：'+typeOrderList[i].sfrAddressLable+'</p>';
                    if(typeOrderList[i].sfrAddressLable == null || typeOrderList[i].sfrAddressLable == undefined){
                        sfrAddressLable = '<p class="receiverAddress">地址标签：--</p>';
                    }
                }

                orderlist += '<li class="'+classname+'" ordernum=' + typeOrderList[i].tjoOrderNo + ' orderid=' + typeOrderList[i].tjoOmOrderId + ' actCode=' + typeOrderList[i].tjoActCode + '>'+
                    '<span class="actRemark" style="display:none;">'+typeOrderList[i].actRemark+'</span>'+
                    '<input type="hidden" class="weightnum" value="'+typeOrderList[i].tjoTotalWeight+'" />'+
                    '<input type="hidden" class="weightunit" value="'+typeOrderList[i].tjoWeightUnit+'" />'+
                    '<input type="hidden" class="volumenum" value="'+typeOrderList[i].tjoTotalVolume+'" />'+
                    '<input type="hidden" class="volumeunit" value="'+typeOrderList[i].tjoVolumeUnit+'" />'+
                    '<input type="hidden" class="amountnum" value="'+typeOrderList[i].tjoTotalAmount+'" />'+
                    '<input type="hidden" class="qtyNum" value="'+typeOrderList[i].tjoTotalQty+'" />'+
                    '<div class="right">'+
                    '<p class="ordernum">订单号：'+typeOrderList[i].tjoOrderNo+'</p>'+
                    '<p class="ordernum" style="line-height:0.36rem;min-height:0.4rem;">原单号：'+typeOrderList[i].tjoCustomerOriginalNo+'</p>'+
                    '<p class="ordernum" style="line-height:0.36rem;min-height:0.4rem;">班次号：'+typeOrderList[i].tfoCustomerRefNo+'</p>'+
                    '<p class="shipAddress">数量：'+typeOrderList[i].tjoTotalQty+' 重量：'+typeOrderList[i].tjoTotalWeight+'kg 体积：'+typeOrderList[i].tjoTotalVolume+'m³ ' +
                        '<br/>价值/币种：'+typeOrderList[i].tjoTotalAmount+'/'+changeItemType(typeOrderList[i].tjoCurrency,"currencyList")+'</p>'+
                    '<p class="receiverAddress">订单性质：'+changeItemType(typeOrderList[i].orderNature,"orderNatureList")+'</p>'+
                    '<p class="receiverAddress">客户：'+typeOrderList[i].stoPartyName+'</p>' +
                    '<p class="receiverAddress">配送日期：'+tjoCompleteTime+' </p>'+
                    '<p class="receiverAddress">收货地址：'+typeOrderList[i].stoAddress+'</p>'+paymentItem+sfrAddressLable+
                    '</div>'+
                    '<div class="orderHandle">'+
                        '<div class="btnOrderHandle">'+
                            goBackTxt+'<a href="javascript:;" class="truck">'+clickbtnTxt+'</a>'+
                        '</div>'+
                        '<p class="photo">'+
                            '<img src="images/top_pic.png" alt="" />'+
                            '<span class="txt">上传附件图片</span>'+
                        '</p>'+
                    '</div>'+
                    '<p class="round"></p>'+
                    '</li>'
            }
            myTaskDiv.html(orderlist);

            $(".header .right2").hide();
            if(myTaskStep == '2'){
                $(".header .right2").show();
                myTaskDiv.addClass("orderList2");
            } else if(myTaskStep == '3'){
                myTaskDiv.addClass("orderList3");
            }
        }
    }



    var dictListDatas = [],basicDataObj = {};
    getBasicData();
    function getBasicData() {
        var logininf = JSON.parse(localStorage.getItem("logininf"));
        if (localStorage.getItem("basicData") == null) { //获取下拉数据
            getRequest(cmdUrl + "/dictionary/all/all.json?token=" + logininf.token + "&timeStamp=" + logininf.timeStamp,function (res) {
                dictListDatas = res.result.dictList;
                basicDataObj.qtyUnitList = getDictDataLists('om_order', 'qty_unit');  //数量单位
                basicDataObj.volumeUnitList = getDictDataLists('om_order', 'volume_unit');  //体积单位
                basicDataObj.currencyList = getDictDataLists('om_order', 'currency');  //金额单位
                basicDataObj.weightUnitList = getDictDataLists('om_order', 'weight_unit');  //重量单位
                basicDataObj.orderTypeList = getDictDataLists('om_order', 'order_type');	//订单类型
                basicDataObj.orderToList = getDictDataLists('om_order', 'order_to');	//发单方
                basicDataObj.orderFromList = getDictDataLists('om_order', 'order_from');	//接单方
                basicDataObj.contactLists = getDictDataLists('cd_contact', 'contact_type');  // 联系人类型
                basicDataObj.eqpTypeList = getDictDataLists('cd_eqp', 'eqp_type');  //设备类型
                basicDataObj.countryList = res.result.countryList;  // 国家
                basicDataObj.provinceList = res.result.provinceList;  // 省
                basicDataObj.cityList = res.result.cityList;  // 市
                basicDataObj.districtList = res.result.districtList;  // 区
                basicDataObj.partyTypeList = getDictDataLists('cd_party', 'party_type'); 	//合作商类型
                basicDataObj.locationTypeList = getDictDataLists('cd_location', 'location_type');  // cd 地址类型
                basicDataObj.locationLableList = getDictDataLists('cd_location', 'location_lable');  // cd 地址标签

                localStorage.setItem("basicData", JSON.stringify(basicDataObj));
            });
            return basicDataObj;
        }else{
            basicDataObj = JSON.parse(localStorage.getItem("basicData"));
            return basicDataObj;
        }
    }
    function getDictDataLists(tableName,columnName){
        var listData = [];
        for(var i = 0;i < dictListDatas.length;i++){
            if(dictListDatas[i].tableName == tableName && dictListDatas[i].columnName == columnName){
                listData.push(dictListDatas[i]);
            }
        }
        return listData;
    }

    function changeItemType(code,type){
        var selectListData = basicDataObj;
        var returnText = "--";
        switch (type) {
            case 'currencyList':
                if (code && selectListData.currencyList) {
                    for (var i = 0; i < selectListData.currencyList.length; i++) {
                        if (selectListData.currencyList[i].code == code) {
                            returnText = selectListData.currencyList[i].text;
                        }
                    }
                }
                return returnText;
                break;
            case 'orderNatureList':
                if (code && selectListData.orderNatureList) {
                    for (var i = 0; i < selectListData.orderNatureList.length; i++) {
                        if (selectListData.orderNatureList[i].code == code) {
                            returnText = selectListData.orderNatureList[i].text;
                        }
                    }
                }
                return returnText;
                break;
        }
    }

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

	//点击装车
    ///////////////////////////  装车页面 — 装车 （弹出异常填写页面 popup7 ）
    ///////////////////////////  配送页面 — 签收 （弹出异常填写页面 popup7 ）
    ///////////////////////////  签收页面 — 查看签收单
    ///////////////////////////  全部任务
	$(".main .orderCon .orderList").on("click", "li .orderHandle .truck", function(e) {
		e.preventDefault();
		e.stopPropagation();
		var orderid = $(this).parents("li").attr("orderid");
		var ordernum = $(this).parents("li").attr("ordernum");
		imgUrl = [];
		$(".uploadSealBtn").html('<li class="lastLi"><img src="images/cameraIcon.png" alt="" /></li>');
		if(myTaskStep == '3'){   ////////// 签收页面
			$(".maskLayer .popup2").hide();
			$(".maskLayer .popup7").hide();
			$(".maskLayer .popup5").show();
			$(".maskLayer").show();
			//icdp-oms-app-1.0.0/select/OrderReceiptImgBase64.json
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

		}else{   ////  装车页面
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
		}
	})
	//end

	//http://wechat.suyechina.com/index.html



    //点击退回
    ///////////////////////////  接单页面 — 接单
    ///////////////////////////  装车页面 — 装车
    $(".main .orderCon .orderList").on("click", "li .orderHandle .goBack", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var orderid = $(this).parents("li").attr("orderid");
        var ordernum = $(this).parents("li").attr("ordernum");

        var searchFormArr = [
            {
                orderId: orderid,
                orderNo: ordernum,
                actCode: "GOBACK",
                operator: logininf.mobilePhone,
                exceptionRemark: "",
                imgBase64: [],
                latLng: null
            }
        ];

        mui.confirm('确定退回？','提示',['取消', '确认'],function(e) {
            if(e.index == 1) {
                postRequest(tmsUrl + '/driver/save/submitOrderActInfo?token='+logininf.token+'&timeStamp='+logininf.timeStamp,searchFormArr,function(data){
                    getTjoOrderInfo(tfoOrderId);
                })
            }
        })
    })
    //end

    //点击地址标签
    ///////////////////////////  接单页面 — 签收
    var orderNo1 = "";
    $(".main .orderCon .orderList").on("click", "li .orderHandle .locLable", function(e) {
        e.preventDefault();
        e.stopPropagation();
        orderNo1 = $(this).parents("li").attr("ordernum");
        $(".maskLayer .popup8 .locCon .a_selectOption").empty();
        $(".maskLayer .popup8 .locCon .sameInput").html("");
        var sameOption = "";
        $.each(basicDataObj.locationLableList,function(index,item){
            sameOption += '<p text='+item.text+'>'+item.text+'</p>';
        });
        $(".maskLayer .popup8 .locCon .a_selectOption").append(sameOption);
        $(".maskLayer .popup8").show();
        $(".maskLayer").show();
    });
    //end

    $(".maskLayer .popup8 .locCon .sameInput").click(function(){
        $(".maskLayer .popup8 .a_selectOption").toggle();
    });
    $(".maskLayer .popup8 .locCon .a_selectOption").on("click","p",function(){
        $(this).toggleClass("active");
        var naSelectText = [];
        $.each($(".popup8 .a_selectOption p.active"),function(index,item){
            naSelectText.push(item.getAttribute("text"));
        });
        $(".maskLayer .popup8 .locCon .sameInput").html(naSelectText.toString());
    });
    $(".maskLayer .popup8 .locConP span").click(function(){
        var locationLableStr = $(".maskLayer .popup8 .locCon .sameInput").html();
        if(locationLableStr == "" || locationLableStr == undefined){
            loadData('show', '请选择地址标签！', true);
            return false;
        }
        postRequest(tmsUrl + '/save/orderStoParty/LocationLable?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&orderNo='+orderNo1+'&locationLableStr='+locationLableStr,"",function(data){
            $(".maskLayer").hide();
            $(".maskLayer .popup8").hide();
        })
    });



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
	$(".main .orderCon .allAcceptBtn .scanCodeBtn").click(function(e) {
		if(myTaskStep == "0"){  // 接单页面 —— 扫码接单
            scanCodeTruck();
		}

		if(myTaskStep == "1"){  // 装车页面 —— 扫码装车
			scanCodeTruck();
		}

		if(myTaskStep == "2"){  // 配送页面 —— 扫码签收
			scanCodeTruck();
		}
	})
	//end


	//确认
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
	//////////////////  接单页面 — 接单 —— “接单”按钮
    //////////////////  装车页面 — 装车 —— “装车”按钮
    //////////////////  配送页面 — 签收 —— “签收”按钮（上传签收图）
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
			if(myTaskStep == '0'){  /// 接单页面
				if(imgUrl.length > 19){
					loadData("show","每次最多上传20张图片!",true)
					return false;
				}
				$(this).addClass("pointAndClick");
				changeActCodeFun(checkedli,"COFM",abnormalManageInf);
			}
			if(myTaskStep == '1'){   /// 装车页面
				if(imgUrl.length > 19){
					loadData("show","每次最多上传20张图片",true)
					return false;
				}
				$(this).addClass("pointAndClick");
				changeActCodeFun(checkedli,"LONT",abnormalManageInf);
			}
			if(myTaskStep == '2'){  /// 配送页面
				if(imgUrl.length > 19){
					loadData("show","每次最多上传20张图片!",true)
					return false;
				}
				if(imgStatus == 0){
					loadData("show","请先上传签收图",true)
				}else if(imgStatus == 1){
					$(this).addClass("pointAndClick");
					changeActCodeFun(checkedli,"ACPT",abnormalManageInf);
				}
			}
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
    /////////  装车页面 — 装车（单选） ————————— “异常”按钮 （ popup7 ） （弹出异常填写页面 popup2 ）
    /////////  配送页面 — 签收（单选） ————————— “异常”按钮 （ popup7 ） （弹出异常填写页面 popup2 ）
	$(".maskLayer .popup7 .popupBot2 .abnormalorderbtn").click(function(){
		$(".maskLayer .popup7").hide();
		$(".maskLayer .popup2").show();
	})

	//订单异常执行
	///////////////////////////   接单页面— 接单 —— “接单”按钮 （ popup2 ）
    ///////////////////////////   装车页面 — 装车 — 异常 —— “装车”按钮 （ popup2 ）
    ///////////////////////////   配送页面 — 签收 — 异常 —— “签收”按钮 （ popup2 ）
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
		if(myTaskStep == '0'){  ////////////// 接单页面
			if(imgUrl.length > 19){
				loadData("show","每次最多上传20张图片!",true)
				return false;
			}
			$(this).addClass("pointAndClick1");
			abnormalActCodeFun(checkedli,"COFM",abnormalManageInf,choiceVal);
		}
		if(myTaskStep == '1'){ ////////////// 装车页面
			if(imgUrl.length > 19){
				loadData("show","每次最多上传20张图片!",true)
				return false;
			}
			$(this).addClass("pointAndClick1");
			abnormalActCodeFun(checkedli,"LONT",abnormalManageInf,choiceVal);
		}
		if(myTaskStep == '2'){ ////////////// 配送页面
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
		}
	})

	//订单异常不执行
	///////////////////////////  接单页面 — 接单 —— “异常”按钮 （ popup2 ）
    ///////////////////////////  装车页面 — 装车 — 异常 —— “异常”按钮 （ popup2 ）
    ///////////////////////////  配送页面 — 签收 — 异常 —— “异常”按钮 （ popup2 ）
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
		if(myTaskStep == '0'){ ////////////// 接单页面
			if(imgUrl.length > 19){
				loadData("show","每次最多上传20张图片!",true)
				return false;
			}
			if(imgStatus == 0){
				loadData("show","请先上传图片",true)
			}else if(imgStatus == 1){
				$(this).addClass("pointAndClick1");
				abnormalActCodeFun(checkedli,"COFM",abnormalManageInf,choiceVal);
			}
		}
		if(myTaskStep == '1'){ ////////////// 装车页面
			if(imgUrl.length > 19){
				loadData("show","每次最多上传20张图片!",true)
				return false;
			}
			if(imgStatus == 0){
				loadData("show","请先上传图片",true)
			}else if(imgStatus == 1){
				$(this).addClass("pointAndClick1");
				abnormalActCodeFun(checkedli,"LONT",abnormalManageInf,choiceVal);
			}

		}
		if(myTaskStep == '2'){ ////////////// 配送页面
			if(imgUrl.length > 19){
				loadData("show","每次最多上传20张图片!",true)
				return false;
			}
			if(imgStatus == 0){
				loadData("show","请先上传图片",true)
			}else if(imgStatus == 1){
				$(this).addClass("pointAndClick1");
				abnormalActCodeFun(checkedli,"ACPT",abnormalManageInf,choiceVal);
			}
		}
	})

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
		$.ajax({
			url: tmsUrl + '/driver/save/submitOrderActInfo',
			type: "post",
            contentType: 'application/json',
			data: JSON.stringify(list),
			success: function(data) {
				//改变状态成功   隐藏弹窗
				$(".maskLayer").hide();
				$(".maskLayer .popup2").hide();
                $(".ajax-loder-wrap").remove();
                loadData('hide');
                getTjoOrderInfo(tfoOrderId);
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
                getTjoOrderInfo(tfoOrderId);

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


    // 获取当前位置
	getLocationFun();


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

    $(".maskLayer .popup8 .closebtn").click(function(){
        $(".maskLayer").hide();
        $(".maskLayer .popup8").hide();
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
