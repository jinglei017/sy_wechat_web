
$(function(){
    // 获取当前位置
    getLocationFun();

    /* 微信中不隐去.header */
    var ua = window.navigator.userAgent.toLowerCase();
    // if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    //     $(".header").show();
    //     $(".personMain").css({
    //         "marginTop":"0.88rem"
    //     })
    // }

    var logininf = JSON.parse(localStorage.getItem("logininf"));

    getList();
    function getList(){
        $.ajax({
            url: wmsUrl + '/query/partyItemInventoryCount?token='+logininf.token+'&timeStamp='+logininf.timeStamp,
            type: "get",
            beforeSend:function(){
                loadData('show');
            },
            success:function(response){
                var data = response;
                if(data != null){
                    if(data.msg != 'success' && data.msg != 'SUCCESS'){
                        if ($('.loadingExceptionMsg').length < 1) {
                            loadData('show', '查询出错，请刷新重试');
                            $(".loading").addClass('loadingExceptionMsg');
                        }
                        return false;
                    }else{
                        if ($('.loadingExceptionMsg').length < 1) {
                            loadData('hide');
                        }
                    }
                }else{
                    if ($('.loadingExceptionMsg').length < 1) {
                        loadData('show', '查询出错，请刷新重试');
                        $(".loading").addClass('loadingExceptionMsg');
                    }
                    return false;
                }
                contactList(response);
            }
        });
    }

    function contactList(response){
        var detailHtml = '',num = 0;
        if(response.result.length > 0){
            $.each(response.result,function(index,value){
                num += 1;
                detailHtml += '<ul class="personItem" partyCode="'+value.partyCode+'" tenantCode="'+value.tenantCode+'" name="'+value.partyName+'"><li class="float_l">'+
                    value.partyName+'</li><li class="float_r"><span class="goBtn"></span></li><li class="float_r">'+value.itemCount+'条</li></ul>';
            });
        }
        if(num == 0){
            $('#tableBodyDetails').html('<div class="contentISBlank"><span>---暂无委托人，无法查看库存---</span></div>');
        }else{
            $('#tableBodyDetails').html(detailHtml);
        }

    }

    // 选择委托人查看库存
    $("#tableBodyDetails").on("click",".personItem",function(){
        var partyCode = $(this).attr('partyCode'),name = $(this).attr('name');
        window.location.href = "inventoryTpls.html?p="+partyCode+"&n="+name;
    });
});

