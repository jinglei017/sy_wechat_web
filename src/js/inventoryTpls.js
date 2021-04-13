
var pagenNum = 1,pageSize = 100,pages = 0,allTotal = 0;  // 分页信息：第几页，一页的条数，总共几页
var queryPlace = '上海';  // 库存明细的地区

$(function(){
    // 获取当前位置
    getLocationFun();

    var logininf = JSON.parse(localStorage.getItem("logininf"));

    /* 微信中不隐去.header */
    var ua = window.navigator.userAgent.toLowerCase();
    /*if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        $(".header").show();
        $(".main").css({
            "marginTop":"0.88rem"
        })
    }*/

    var partyCode = getUrlParam('p'),name = getUrlParam('n');
    $('#customerName').html(name+'-');

    var queryInventoryDetails = {
        partyCode : partyCode,
        producePlace : queryPlace,
        pageInfo: {
            pageNum: pagenNum,
            pageSize: pageSize
        }
    };
    ajaxRequest(wmsUrl + '/query/selectItemInventoryInfoListPage?token='+logininf.token+'&timeStamp='+logininf.timeStamp, 'post',queryInventoryDetails,'inventoryDetails','获取全部库存列表');

    /* scroll */
    $(".main").scroll(function(){
        if($(".main #tableBodyDetails").outerHeight() - $(".main").scrollTop() - $(".main").height() < 10){
            if(pagenNum < pages || pagenNum == pages){
                var searchName = $('#searchName').val();
                var searchXh = $('#searchXh').val();
                var searchPc = $('#searchPc').val();
                var searchBar = $('#searchBar').val();
                var queryInventoryDetails = {
                    partyCode : partyCode,
                    producePlace : queryPlace,
                    pageInfo: {
                        pageNum: pagenNum,
                        pageSize: pageSize
                    }
                };
                if(searchName!=''){
                    queryInventoryDetails.itemName = searchName; // 商品名
                }

                if(searchXh!=''){
                    queryInventoryDetails.norm = searchXh; // 规格
                }

                if(searchPc!=''){
                    //   queryInventoryDetails.itemBarCode = searchPc; // 批次
                }

                if(searchBar!=''){
                    queryInventoryDetails.itemBarCode = searchBar; // 标志码
                }

                ajaxRequest(wmsUrl + '/query/selectItemInventoryInfoListPage?token='+logininf.token+'&timeStamp='+logininf.timeStamp, 'post',queryInventoryDetails,'inventoryDetails','获取全部库存列表');
            }
        }
    });

    /* 点击查询 */
    $(".header .right").click(function(){
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
        var searchXh = $('#searchXh').val();
        var searchPc = $('#searchPc').val();
        var searchBar = $('#searchBar').val();
        if(searchName == '' && searchXh == '' && searchPc == '' && searchBar == ''){
            loadData('show', '请先输入查询内容！', true);
        }else{
            $('#tableBodyDetails').html('');
            pagenNum = 1;
            var queryInventorys = {
                partyCode : partyCode,
                producePlace : queryPlace,
                pageInfo: {
                    pageNum: pagenNum,
                    pageSize: pageSize
                }
            };

            if(searchName!=''){
                queryInventorys.itemName = searchName; // 商品名
            }

            if(searchXh!=''){
                queryInventorys.norm = searchXh; // 规格
            }

            if(searchPc!=''){
                //   queryInventorys.itemBarCode = searchPc; // 批次
            }

            if(searchBar!=''){
                queryInventorys.itemBarCode = searchBar; // 标志码
            }

            ajaxRequest(wmsUrl + '/query/selectItemInventoryInfoListPage?token='+logininf.token+'&timeStamp='+logininf.timeStamp, 'post',queryInventorys,'inventoryDetails','查询库存');

        }
    });

    /* 重置 */
    $("#inventoryResetBtn").click(function(){
        $('#searchName').val('');$('#searchXh').val('');$('#searchPc').val('');$('#searchBar').val('');
        $(".searchLayer").hide();
        $('#tableBodyDetails').html('');
        pagenNum = 1;
        var queryInventoryDetails = {
            partyCode : partyCode,
            producePlace : queryPlace,
            pageInfo: {
                pageNum: pagenNum,
                pageSize: pageSize
            }
        };

        ajaxRequest(wmsUrl + '/query/selectItemInventoryInfoListPage?token='+logininf.token+'&timeStamp='+logininf.timeStamp, 'post',queryInventoryDetails,'inventoryDetails','获取全部库存列表');
    });

});

// 成功查询 库存明细
function inventoryDetails(response){
    var detailHtml = '';
    if((response.result.length > 0)&&((response.pageInfo.pageNum < response.pageInfo.pages)||(response.pageInfo.pageNum == response.pageInfo.pages))){
        pages = response.pageInfo.pages;
        $.each(response.result,function(index,value){
            if((value.itemName != '')&&(value.itemName != null)){
                if(value.qty1 != 0){
                    if(value.qty2 != 0){
                        detailHtml += '<div class="itemDiv"><div class="float_l itemCon">'+
                            '<div class="itemLis itemTxt"><span>'+value.itemName+'</span></div>' +
                            '<ul class="itemLis"><li class="float_l text_l itemLi1"><span class="color_titles">批次:&nbsp;</span><span>'+value.createTime+'</span></li>'+
                            '<li class="float_l text_l itemLi2"><span class="color_titles">规格:&nbsp;</span><span>'+ value.norm+'</span></li></ul><ul class="itemLis">'+
                            '<li class="float_l text_l itemLi1"><span class="color_titles">商品条码:&nbsp;</span><span>'+value.itemBarCode+'</span></li>'+
                            '<li class="float_l text_l itemLi2"><span class="color_titles">库存:&nbsp;</span><span>'+ value.qty1+value.unit1+'（'+value.qty2+value.unit2+'）</span></li></ul></div></div>';
                    }else{
                        detailHtml += '<div class="itemDiv"><div class="float_l itemCon">'+
                            '<div class="itemLis itemTxt"><span>'+value.itemName+'</span></div>' +
                            '<ul class="itemLis"><li class="float_l text_l itemLi1"><span class="color_titles">批次:&nbsp;</span><span>'+value.createTime+'</span></li>'+
                            '<li class="float_l text_l itemLi2"><span class="color_titles">规格:&nbsp;</span><span>'+ value.norm+'</span></li></ul><ul class="itemLis">'+
                            '<li class="float_l text_l itemLi1"><span class="color_titles">商品条码:&nbsp;</span><span>'+value.itemBarCode+'</span></li>'+
                            '<li class="float_l text_l itemLi2"><span class="color_titles">库存:&nbsp;</span><span>'+ value.qty1+value.unit1+'</span></li></ul></div></div>';
                    }
                }else{
                    if(value.qty2 != 0){
                        detailHtml += '<div class="itemDiv"><div class="float_l itemCon">'+
                            '<div class="itemLis itemTxt"><span>'+value.itemName+'</span></div>' +
                            '<ul class="itemLis"><li class="float_l text_l itemLi1"><span class="color_titles">批次:&nbsp;</span><span>'+value.createTime+'</span></li>'+
                            '<li class="float_l text_l itemLi2"><span class="color_titles">规格:&nbsp;</span><span>'+ value.norm+'</span></li></ul><ul class="itemLis">'+
                            '<li class="float_l text_l itemLi1"><span class="color_titles">商品条码:&nbsp;</span><span>'+value.itemBarCode+'</span></li>'+
                            '<li class="float_l text_l itemLi2"><span class="color_titles">库存:&nbsp;</span><span>'+ value.qty2+value.unit2+'</span></li></ul></div></div>';
                    }else{
                        detailHtml += '<div class="itemDiv"><div class="float_l itemCon">'+
                            '<div class="itemLis itemTxt"><span>'+value.itemName+'</span></div>' +
                            '<ul class="itemLis"><li class="float_l text_l itemLi1"><span class="color_titles">批次:&nbsp;</span><span>'+value.createTime+'</span></li>'+
                            '<li class="float_l text_l itemLi2"><span class="color_titles">规格:&nbsp;</span><span>'+ value.norm+'</span></li></ul><ul class="itemLis">'+
                            '<li class="float_l text_l itemLi1"><span class="color_titles">商品条码:&nbsp;</span><span>'+value.itemBarCode+'</span></li>'+
                            '<li class="float_l text_l itemLi2"><span class="color_titles">库存:&nbsp;</span><span>--</span></li></ul></div></div>';
                    }
                }
            }
        });
    }else{
        pages = 0;
        detailHtml = contentISBlank;
    }
    allTotal = response.pageInfo.total;
    $('#inventoryNum').html('库存-'+allTotal+'条 ');
    $('#tableBodyDetails').append(detailHtml);
    pagenNum += 1;

    $(".searchLayer").hide();
}


