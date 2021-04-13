var app = new Vue({
    el: '#materialApp',
    data: {
        logininf: {},
        ua: "",
        classesList: [],
        classesItem: {},
        actCode: "OFICAR",
        pageNumVal: 1,
        tripsLot: "",
        recycleList: [],
        receivedQtyList: [],
        imgliList: [],
        imgliList2: [],
        imgUrlEqp: [],
        omOrderId: "",
        omOrderItemId: "",
        imgStatusEqp: 0,
        currentExtId: '',
        currentImgSrc: '',
        currentImgIndex: '',
        currentImgState: ''
    },
    methods:{
        getClassesList(page,duration){
            var that = this;
            if(duration){
                $("#startTime").attr("value",getCurrentTime(duration));
                $("#endTime").attr("value",getCurrentTime(0));
            }
            var startTime = $("#startTime").val().trim();
            var endTime = $("#endTime").val().trim();
            if(startTime == "" || startTime == undefined){
                loadData('show', '请输入您要查找的日期', true);
                return false;
            }
            that.pageNumVal = page;
            var searchFormArr = {
                startDepartureDate: startTime,
                endDepartureDate: endTime,
                actCode: that.actCode,
                tripsLot: that.tripsLot,
                pageInfo: {
                    pageNum:that.pageNumVal,
                    pageSize:30
                }
            };
            postRequest(tmsUrl + '/wx/query/queryCarFollowEqpPage?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,searchFormArr,function(data){
                that.classesList = data.result;
                $(".searchLayer").hide();
            })
        },
        // 获取物料列表
        getRecycleItem(Item){
            $(".maskLayer1").show();
            var that = this;
            that.classesItem = Item;
            that.recycleList = [];
            that.receivedQtyList = [];
            that.omOrderId = Item.omOrderItemId;
            getRequest(tmsUrl+'/wx/query/queryCarFollowEqpItemList.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+"&orderId="+Item.tripsOrderId,function(data){
                var infoEquipHtml = "";
                if(data.result != null || data.result.length>0){
                    that.recycleList = data.result;
                    for(var i=0;i<data.result.length;i++){
                        that.receivedQtyList.push(data.result[i].qty);
                    }
                }
            })
        },
        // 查看图片
        uploadOrderImg(itemId){
            var that = this;
            $(".popupM").show();
            $(".popupE").hide();
            that.imgliList = [];
            that.imgliList2 = [];
            that.imgUrlEqp = [];
            that.omOrderItemId = itemId;
            that.imgStatusEqp = 0;
            getRequest(tmsUrl + '/wx/get/orderItemImage?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+'&orderItemId='+that.omOrderItemId,function(data){
                if(data.result != null && data.result.length > 0){
                    for(var i=0;i<data.result.length;i++){
                        var item = data.result[i];
                        that.imgliList.push({
                            src: ImgWebsite+item.extValue,
                            extId: item.omExtId
                        })
                    }
                }
            })
        },
        // 微信上传图片
        uoloadImgEqp(){
            var that = this;
            wx.chooseImage({
                count: 4, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    var realLocalIds = localIds.toString().split(',');
                    for(var i=0;i< realLocalIds.length;i++){
                        that.imgliList2.push(realLocalIds[i]);
                        wx.getLocalImgData({
                            localId: realLocalIds[i], // 图片的localID
                            success: function (res) {
                                that.imgStatusEqp = 1;
                                var localData = res.localData; //localData是图片的base64数据，可以用img标签显示
                                var u = navigator.userAgent;
                                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                                if(isAndroid){
                                    var resultStr = localData.replace(/[\r\n]/g, ""); //去掉回车换行
                                    that.imgUrlEqp.push(resultStr);
                                }else{
                                    that.imgUrlEqp.push(localData.split(',')[1])
                                }
                            }
                        });
                    }
                }
            });
        },
        //  pc端上传图片
        uploadImgPc(e){
            var that = this;
            var files = e.target.files; //获取图片
            var file = files[0];
            if (!/\/(?:jpeg|jpg|png)/i.test(file.type)) { // 接受 jpeg, jpg, png 类型的图片
                return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var resultBe = e.target.result;  //图片base64字符串、去掉回车换行
                that.imgliList2.push(resultBe);
                var result = resultBe.split(",")[1];
                that.imgUrlEqp.push(result);
            };
            reader.readAsDataURL(file);    //Base64
            that.imgStatusEqp = 1;
        },
        // 确定上传
        sureUploadImg(){
            var that = this;
            if(that.imgUrlEqp.length > 4){
                loadData("show","最多上传4张图片!",true);
                return false;
            }
            if(that.imgStatusEqp == 0){
                loadData("show","请先上传图片！",true);
                return false;
            }else if(that.imgStatusEqp == 1){
                $.ajax({
                    url: tmsUrl + "/wx/save/orderItemImage?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderItemId="+that.omOrderItemId,
                    type: "post",
                    beforeSend:function(){
                        loadData('show');
                    },
                    data: JSON.stringify(that.imgUrlEqp),
                    contentType: 'application/json',
                    success: function(data) {
                        loadData("show","保存成功！",true);
                        that.imgliList = [];
                        that.imgliList2 = [];
                        that.imgUrlEqp = [];
                        that.imgStatusEqp = 0;

                        for(var i=0;i<data.result.length;i++){
                            var item = data.result[i];
                            that.imgliList.push({
                                src: ImgWebsite+item.extValue,
                                extId: item.omExtId
                            })
                        }
                    },
                    error: function(){
                        loadData("show","上传图片失败，请稍后再试！",true)
                    }
                })
            }
        },
        // 查看大图
        openThisImg(item,type,index){
            var that = this;
            $(".maskLayer1 .popupM").hide();
            $(".maskLayer1 .popupI").show();
            that.currentImgState = type;
            if(type == '1'){
                that.currentImgSrc = item.src;
                that.currentExtId = item.extId;
            }else if(type == '2'){
                that.currentImgSrc = item;
                that.currentImgIndex = index;
            }
        },
        // 删除图片
        deleteThisImg(){
            var that = this;
            if(that.currentImgState == '1'){
                getRequest(tmsUrl + '/wx/del/orderItemImage?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+'&extId='+that.currentExtId,function(data){
                    $(".maskLayer1 .popupI").hide();
                    $(".maskLayer1 .popupM").show();
                    that.uploadOrderImg(that.omOrderItemId);
                })
            }else if(that.currentImgState == '2'){
                $(".maskLayer1 .popupI").hide();
                $(".maskLayer1 .popupM").show();
                that.imgUrlEqp.splice(that.currentImgIndex,1);
                that.imgliList2.splice(that.currentImgIndex,1);
                if(that.imgUrlEqp.length == 0){
                    that.imgStatusEqp = 0;
                }
            }

        },
        // 关闭图片
        closeThisImg(){
            $(".maskLayer1 .popupI").hide();
            $(".maskLayer1 .popupM").show();
        },

        // 确认回收
        saveOrderItem(item,receivedQty){
            var that = this;
            if(receivedQty == null || receivedQty == undefined || receivedQty == ""){
                loadData("show","回收数量不能为空！",true);
                return false;
            }
            var searchFormArr = {
                itemNature: item.itemNature,
                omOrderItemId: item.omOrderItemId,
                omOrderId: item.omOrderId,
                itemName: item.itemName,
                itemCode: item.itemCode,
                qty: item.qty,
                receivedQty: receivedQty,
                qtyUnit: '件'
            };
            postRequest(tmsUrl + '/wx/save/saveCarFollowEqpItemDetail?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,searchFormArr,function(data){
                that.getRecycleItem(that.classesItem);
            })
        },

        // 完成回收
        overEquip(){
            var that = this;
            $(".maskLayer1").hide();
            that.getClassesList('1');
        },

        closeMasker2(){
            $(".popupM").hide();
            $(".popupE").show();
        },
        isSearchLayer(){
            $(".searchLayer").toggle();
        }
    },
    created:function(){
        var that = this;
        that.showTimeSpan = getQueryTime(1);
        $("#startTime").attr("value",getQueryTime(1));
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.getClassesList('1','3');
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            that.ua = true;
        }else{
            that.ua = false;
        }
    },
    filters:{
        changeItemNature(itemNature){
            if(itemNature == "DAM"){
                return "破损";
            }else{
                return "正常";
            }
        },
        changeActCode(code){
            if(code == "OFICAR"){
                return "未回收";
            }else{
                return "已回收";
            }
        }
    }
});


var ua = window.navigator.userAgent.toLowerCase();
$(function(){
    getLocationFun();   // 获取当前位置

    $(".header .returnBtn").click(function(){
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            location.href = wechatUrl + "/syOauth2Login.html?r=/index.html";
        }else{
            location.href = "index.html";
        }
    });
});
