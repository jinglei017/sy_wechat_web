function getLocationFun(){
	var roleId = localStorage.getItem("roleId");
	var logininf = localStorage.getItem("logininf");
	var orderLength = localStorage.getItem("orderLength");
	var tfoOrderNo = localStorage.getItem("tfoOrderNo");
	var day2 = new Date();
	day2.setTime(day2.getTime());
	var s2 = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate();
	
	var getCurrentData = localStorage.getItem("getCurrentData");
	if(getCurrentData ==  "" || getCurrentData == null || getCurrentData == undefined){
		localStorage.setItem("getCurrentData",s2);
	}else if(getCurrentData != s2){
		localStorage.removeItem("currentTime");
		localStorage.setItem("getCurrentData",s2);
	}
	if(logininf == "" || logininf == null || logininf == "null" || logininf == undefined || logininf == "undefined"){
		
	}else{
		logininf =  JSON.parse(localStorage.getItem("logininf"));
		var getCurrentTime = localStorage.getItem("currentTime");
		if(getCurrentTime == "" || getCurrentTime == null || getCurrentTime == "NaN" || getCurrentTime == undefined  || getCurrentTime == "null" || getCurrentTime == "undefined"){
			localStorage.setItem("currentTime","300000");
			addTimerTask()
		}else{
			addTimerTask()
		}
		function addTimerTask(){
			var timer5 = setInterval(function(){
				orderLength = localStorage.getItem("orderLength")
				getCurrentTime = localStorage.getItem("currentTime");
				if(getCurrentTime == "300000"){
					localStorage.setItem("currentTime","0");
					var ua = window.navigator.userAgent.toLowerCase();
			 		//通过正则表达式匹配ua中是否含有MicroMessenger字符串
					if(ua.match(/MicroMessenger/i) == 'micromessenger'){
						wx.getLocation({ //微信定位
						    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
						    success: function (res) {                                                                                                          
						        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						        var longitude = res.longitude ; // 经度，浮点数，范围为180 ~ -180。
						       	var locations = longitude + "," + latitude;
						       	localStorage.setItem("locationCodeVal",locations);
                                var data = {
                                    latLng: locations,
                                    refNo: logininf.deviceNo,
                                    orderNo: tfoOrderNo,
                                    refType: logininf.deviceType
                                };
                                $.ajax({
                                    url: tmsUrl + '/save/eqpPositionInfo?token='+logininf.token,
                                    type:"post",
                                    contentType:'application/json',
                                    data: JSON.stringify(data),
                                    success: function(data) {}
                                })
						    },
						    fail:function() {
								loadData("show","未能获取地理位置！首先检查手机是否启用微信定位",true)
			                }
						});
					}else{
						var location_lon = '',location_lat = ''; // 经度,纬度
						if (navigator.geolocation){ //h5定位
							navigator.geolocation.getCurrentPosition(function(position) {
						        location_lon = position.coords.longitude;
						        location_lat = position.coords.latitude;
						        localStorage.setItem("locationCodeVal",location_lon + "," + location_lat);
						        getGDPosition(location_lon,location_lat)
						    });
						}else {
							loadData("show", "您的设备不支持定位功能",true)
						}
					}
					//将h5经纬度转化为高德经纬度
					function getGDPosition(location_lon,location_lat){
						$.ajax({
							url:"/GDMap-getPoint/assistant/coordinate/convert?locations="+location_lon+","+location_lat+"&coordsys=gps&output=json&key=5b33d8e1e3b18ab18ff17c7b0233958d",
							type:"get",
							dataType:"json",
							success:function(res){
							    var data = {
                                    latLng: res.locations,
                                    refNo: logininf.deviceNo,
                                    orderNo: tfoOrderNo,
                                    refType: logininf.deviceType
                                };
                                $.ajax({
                                    url: tmsUrl + '/save/eqpPositionInfo?token='+logininf.token,
                                    type:"post",
                                    contentType:'application/json',
                                    data: JSON.stringify(data),
                                    success: function(data) {}
                                })
							}
						})
					}
				}else{
					var getCurrentTime1 =  parseInt(getCurrentTime) + parseInt(1000);
					localStorage.setItem("currentTime",getCurrentTime1);
				}
			},1000)
		}
	}
}

