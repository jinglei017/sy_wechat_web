getAllInfo();
var allnInfoData = "";
function getAllInfo(){
	var logininf =  JSON.parse(localStorage.getItem("logininf"));
	$.ajax({
		url: cmdUrl + '/dictionary/all/all?token='+logininf.token+'&timeStamp='+logininf.timeStamp,
		type:"get",
  		contentType : 'application/json',
 		success: function(data) {
 			allnInfoData = data.result;
 			localStorage.setItem("allInfo",JSON.stringify(data.result));
 		}
	})
	
	var umTenantid1 = logininf.umTenantId;
	var data1 = JSON.stringify({
		umTenantId:umTenantid1
	});
	
	$.ajax({
		url: cmdUrl + '/cdAct/getCdActList.json?token='+logininf.token+'&timeStamp='+logininf.timeStamp,
		type:"post",
  		data:data1,
  		headers: {
	        Accept: "application/json; charset=utf-8"
	    },
  		contentType:'application/json; charset=utf-8',
 		success: function(data) {
 			localStorage.setItem("adActInf",JSON.stringify(data.result));
 		}
	})
}
	