var noCon = '<p class="noContent" style="width: 3rem; height: auto; margin: 0 auto; padding-top: 0.36rem;"><img src="images/noContent.png" alt="" style="width: 3rem; height: auto; display: block;"></p>';
var pagenNum = 1,pageSize = 100,pages = 0,allTotal = 0;  // 分页信息：第几页，一页的条数，总共几页

localStorage.removeItem("hasPartyBaseInfo");  // 清除合作商基本信息partyBaseInfo
localStorage.removeItem("hasCdPartyId");  // 清除合作商id  cdPartyId
localStorage.removeItem("disableSaveParty");  // 清除 能否保存 合作商基本信息
localStorage.removeItem("hasPartyCont");  // 清除合作商 联系人信息
localStorage.removeItem("hasPartyLoc");  // 清除合作商 地址信息
localStorage.removeItem("hasPartyEqp");  // 清除合作商 设备信息
localStorage.removeItem("hasPartyContDefault");  // 清除合作商 默认联系人
localStorage.removeItem("hasPartyLocDefault");  // 清除合作商 默认地址
localStorage.removeItem("hasPartyEqpDefault");  // 清除合作商 默认设备

$(function(){
    var logininf = JSON.parse(localStorage.getItem("logininf"));

    // 获取当前位置
    getLocationFun();
    /* 微信中不隐去.header */
    var ua = window.navigator.userAgent.toLowerCase();
    /*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        $(".header").show();
    }*/

    var searchFormArr = {
        pageInfo: {
            pageNum: pagenNum,
            pageSize: pageSize
        }
    };
    postRequest(cmdUrl + '/select/pagePartyLnkByPartyLnkVo?token='+logininf.token+'&timeStamp='+logininf.timeStamp,searchFormArr,function(data){
        getPartyHisLists(data);
    });

    /* scroll */
    $(".main").scroll(function(){
        if($(".main #tableBodyDetails").outerHeight() - $(".main").scrollTop() - $(".main").height() < 10){
            if($(".ajax-loder-wrap").length > 0){
                return false;
            }
            if(pagenNum < pages || pagenNum == pages){
                var searchName = $('#searchName').val(),scrollSearchFormArr;
                if(searchName == ''){
                    scrollSearchFormArr = {
                        pageInfo: {
                            pageNum: pagenNum,
                            pageSize: pageSize
                        }
                    };
                }else{
                    scrollSearchFormArr = {
                        partyName : searchName,
                        pageInfo: {
                            pageNum: pagenNum,
                            pageSize: pageSize
                        }
                    };
                }
                postRequest(cmdUrl + '/select/pagePartyLnkByPartyLnkVo?token='+logininf.token+'&timeStamp='+logininf.timeStamp,scrollSearchFormArr,function(data){
                    getPartyHisLists(data);
                });
            }
        }
    });

    /* 点击查询 */
    $(".header .right .searchBtn").click(function(){
        if(!$(this).hasClass('search')){
            $(this).addClass('search');
            $(".searchLayer").show();
        }else{
            $(this).removeClass('search');
            $(".searchLayer").hide();
        }
    });
    $("#inventorySearchBtn").click(function(){
        var searchName = $('#searchName').val();
        if(searchName == ''){
            loadData('show', '请先输入查询内容！', true);
        }else{
            $('#tableBodyDetails').html('');
            pagenNum = 1;
            var querSearchFormArr = {
                partyName : searchName,
                pageInfo: {
                    pageNum: pagenNum,
                    pageSize: pageSize
                }
            };
            postRequest(cmdUrl + '/select/pagePartyLnkByPartyLnkVo?token='+logininf.token+'&timeStamp='+logininf.timeStamp,querSearchFormArr,function(data){
                getPartyHisLists(data);
            });
        }
    });
    /* 重置 */
    $("#inventoryResetBtn").click(function(){
        $('#searchName').val('');
        $(".searchLayer").hide();
        $('#tableBodyDetails').html('');
        pagenNum = 1;
        var resetSearchFormArr = {
            pageInfo: {
                pageNum: pagenNum,
                pageSize: pageSize
            }
        };
        postRequest(cmdUrl + '/select/pagePartyLnkByPartyLnkVo?token='+logininf.token+'&timeStamp='+logininf.timeStamp,resetSearchFormArr,function(data){
            getPartyHisLists(data);
        });
    });

    // 成功查询
    function getPartyHisLists(response){
        var detailHtml = '';
        if((response.result.length > 0)&&((response.pageInfo.pageNum < response.pageInfo.pages)||(response.pageInfo.pageNum == response.pageInfo.pages))){
            pages = response.pageInfo.pages;
            $.each(response.result,function(index,value){
                var partyName = '',mrAddress='',mrdzContactName='',mrdzContactTel='',imgContactName='',imgContactTel='';
                if(value.partyName != null && value.partyName != undefined){
                    partyName = value.partyName;
                }
                if(value.mrAddress != null && value.mrAddress != undefined){
                    mrAddress = value.mrAddress;
                }
                if(value.mrdzContactName != null && value.mrdzContactName != undefined){
                    mrdzContactName = value.mrdzContactName;
                }
                if(value.mrdzContactTel != null && value.mrdzContactTel != undefined){
                    mrdzContactTel = value.mrdzContactTel;
                }
                if(value.imgContactName != null && value.imgContactName != undefined){
                    imgContactName = value.imgContactName;
                }
                if(value.imgContactTel != null && value.imgContactTel != undefined){
                    imgContactTel = value.imgContactTel;
                }
                detailHtml += '<div class="itemDiv" name="'+value.cdPartyId+'"><div class="float_l itemCon"><div class="itemLis">'+
                    '<strong>'+partyName+'</strong>&nbsp;&nbsp;&nbsp;<span>'+mrAddress+'</span></div>'+
                    '<div class="itemLis itemAddress">地址联系人:&nbsp;<span>'+mrdzContactName+'</span>&nbsp;&nbsp;<span>'+mrdzContactTel+'</span></div>'+
                    '<div class="itemLis itemAddress">紧急联系人:&nbsp;<span>'+imgContactName+'</span>&nbsp;&nbsp;<span>'+imgContactTel+'</span></div></div></div>';
            });
        }else{
            pages = 0;
            detailHtml = noCon;
        }
        allTotal = response.pageInfo.total;
        $('#tableBodyDetails').append(detailHtml);
        pagenNum += 1;

        $(".searchLayer").hide();
    }

    // 选择该合作商
    $("#tableBodyDetails").on("click",".itemDiv",function(){
        var partyCode = $(this).attr('name');
        if(partyCode != ''){
            getRequest(cmdUrl + "/cdParty/selectPartyOneModel.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&cdPartyId="+partyCode,function(res){
                switch (getUrlParam('partyHisType'))
                {
                    case 'orderFroms':
                        var shipperPartyInfoModel = {};
                        var shipperPartyLocationModel = {};
                        var shipperContactInfoModel = {};
                        var shipperPartyContact = {};
                        shipperPartyInfoModel.party = res.result.cdParty;  // 发货商
                        if(res.result.locationList != null){
                            if(res.result.locationList.length != 0){
                                shipperPartyLocationModel.location = res.result.locationList[0];
                                if(shipperPartyLocationModel.location.cdLocationId != '' && shipperPartyLocationModel.location.cdLocationId != null && shipperPartyLocationModel.location.cdLocationId != undefined){
                                    getRequest(cmdUrl + "/cdLocation/selectCdLocationById.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&cdLocationId="+shipperPartyLocationModel.location.cdLocationId,function(data){
                                        if (data.result != null) {
                                            //   console.log(data.result.cdContactId);  // 现在系统中没有cdContactId字段（undefined）
                                            if(data.result.cdContactId != null && data.result.cdContactId != '' && data.result.cdContactId != undefined){
                                                // 获取该服务点信息——有默认地址联系人，获取该默认地址联系人信息
                                                getRequest(cmdUrl + "/cdContact/selectCdContactById.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&cdContactId="+data.result.cdContactId,function(data){
                                                    if (data.result != null) {
                                                        shipperContactInfoModel.contact = data.result;
                                                    }else {
                                                        shipperContactInfoModel.contact = data.result;
                                                    }
                                                });
                                            }else{
                                                shipperContactInfoModel.contact = {};
                                            }
                                        }else {
                                            shipperContactInfoModel.contact = {};
                                        }

                                    });
                                }else{
                                    shipperContactInfoModel.contact = {};
                                }
                            }else{
                                shipperPartyLocationModel.location = {};
                                shipperContactInfoModel.contact = {};
                            }
                        }else{
                            shipperPartyLocationModel.location = {};
                            shipperContactInfoModel.contact = {};
                        }
                        shipperPartyLocationModel.contactInfo = shipperContactInfoModel;
                        shipperPartyInfoModel.locationInfo = shipperPartyLocationModel;  // 地址信息
                        if(res.result.imgContactList != null){
                            if(res.result.imgContactList.length != 0){
                                shipperPartyContact.contact = res.result.imgContactList[0];
                            }else{
                                shipperPartyContact.contact = {};
                            }
                        }else{
                            shipperPartyContact.contact = {};
                        }
                        shipperPartyInfoModel.imgContactInfo = shipperPartyContact;  // 紧急联系人
                        localStorage.setItem("newOrderFromInfo",JSON.stringify(shipperPartyInfoModel));
                        break;
                    case 'orderTos':
                        var receiptPartyInfoModel = {};
                        var receiptPartyLocationModel = {};
                        var receiptContactInfoModel = {};
                        var receiptPartyContact = {};
                        receiptPartyInfoModel.party = res.result.cdParty;  // 收货商
                        if(res.result.locationList != null){
                            if(res.result.locationList.length != 0){
                                receiptPartyLocationModel.location = res.result.locationList[0];
                                if(receiptPartyLocationModel.location.cdLocationId != '' && receiptPartyLocationModel.location.cdLocationId != null && receiptPartyLocationModel.location.cdLocationId != undefined){
                                    getRequest(cmdUrl + "/cdLocation/selectCdLocationById.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&cdLocationId="+receiptPartyLocationModel.location.cdLocationId,function(data){
                                        if (data.result != null) {
                                            //   console.log(data.result.cdContactId);  // 现在系统中没有cdContactId字段（undefined）
                                            if(data.result.cdContactId != null && data.result.cdContactId != '' && data.result.cdContactId != undefined){
                                                // 获取该服务点信息——有默认地址联系人，获取该默认地址联系人信息
                                                getRequest(cmdUrl + "/cdContact/selectCdContactById.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&cdContactId="+data.result.cdContactId,function(data){
                                                    if (data.result != null) {
                                                        receiptContactInfoModel.contact = data.result;
                                                    }else {
                                                        receiptContactInfoModel.contact = data.result;
                                                    }
                                                });
                                            }else{
                                                receiptContactInfoModel.contact = {};
                                            }
                                        }else {
                                            receiptContactInfoModel.contact = {};
                                        }
                                    });
                                }else{
                                    receiptContactInfoModel.contact = {};
                                }
                            }else{
                                receiptPartyLocationModel.location = {};
                                receiptContactInfoModel.contact = {};
                            }
                        }else{
                            receiptPartyLocationModel.location = {};
                            receiptContactInfoModel.contact = {};
                        }
                        receiptPartyLocationModel.contactInfo = receiptContactInfoModel;
                        receiptPartyInfoModel.locationInfo = receiptPartyLocationModel;  // 地址信息
                        if(res.result.imgContactList != null){
                            if(res.result.imgContactList.length != 0){
                                receiptPartyContact.contact = res.result.imgContactList[0];
                            }else{
                                receiptPartyContact.contact = {};
                            }
                        }else{
                            receiptPartyContact.contact = {};
                        }
                        receiptPartyInfoModel.imgContactInfo = receiptPartyContact;  // 紧急联系人
                        localStorage.setItem("newOrderToInfo",JSON.stringify(receiptPartyInfoModel));
                        break;
                }
                window.location.href = "newOrder.html";
            })
        }
    });

    // 返回
    $(document).on("click","#goNewOrderPage",function(){
        window.location.href = "newOrder.html";
    });

});