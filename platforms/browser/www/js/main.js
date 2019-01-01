var akttime = new Date();
var content;
var storagetype = 0;
var geodata = [];

//initApp------------------------------------------------------------------------------------------------
function initApp(){
mySwiper = new Swiper(".swiper-container", {threshold:10,autoHeight:true});
if(typeof NativeStorage!=="undefined"){storagetype=0;}else{storagetype=1;}
if (storagetype==0){
NativeStorage.getItem("geodata", function(result){if(typeof result==="object"){geodata = result}else{geodata = []}; buildpage("start");}, function(e){geodata = []; buildpage("start");});
}else{
if (localStorage.getItem("geodata")!=null){geodata = JSON.parse(localStorage.getItem("geodata")) || []}else{geodata = []}
buildpage("start");
}
}

//backbutton------------------------------------------------------------------------------------------------------
function onBackKeyDown(){navigator.app.exitApp()}

//save gps point-------------------------------------------------------------------------------
function saveGPS(){
$("#savegpsbtn").css({opacity:0.5}).attr("onclick","");
navigator.geolocation.getCurrentPosition(geoSuccessLive, geoErrorLive, {maximumAge:60000, timeout:10000, enableHighAccuracy:true});
}
function geoSuccessLive(position){
var newItem = {"la":position.coords.latitude,"lo":position.coords.longitude,"a":position.coords.accuracy,"t":position.timestamp};
geodata.push(newItem);
geodata = objectarray_unique(geodata);
if(storagetype==0){NativeStorage.setItem("geodata", geodata)}else{localStorage.setItem("geodata", JSON.stringify(geodata))}
$("#savegpsbtn").css({opacity:1}).attr("onclick","saveGPS()");
$("#syncbtn").show().css({opacity:1}).attr("onclick","sync()").html("Sync "+geodata.length+" Points");
alert("Position saved!");
}
function geoErrorLive(error){
$("#savegpsbtn").css({opacity:1}).attr("onclick","saveGPS()");
alert("Position not found!");
}

//sync----------------------------------------------------------
function sync(){
$("#syncbtn").css({opacity:0.5}).attr("onclick","");
$.ajax({url:'https://reisetagebuch.filavision.de/wp-content/plugins/fila-gpstravelroute/ajax.php',type:'POST',data:'a=sync&geodata='+encodeURIComponent(JSON.stringify(geodata)),crossDomain:true,dataType:'json',jsonp:'callback',timeout:30000,cache:false,success:function(data, status){
if (data["mel"]==1){
geodata=[];
if(storagetype==0){NativeStorage.remove("geodata")}else{localStorage.removeItem("geodata")};
$("#syncbtn").hide();
alert("Sync complete!");
}
},error:function(){$("#syncbtn").show().css({opacity:1}).attr("onclick","sync()");alert("Sync error!")}});
}

//seitenaufbau--------------------------------------------------------------------------------------------------------------------
function buildpage(page){
akttime = new Date();
mySwiper.removeAllSlides();

if (page=="start"){//start
content="<h1>Save current Position</h1><div class='fakebtn' onclick='saveGPS()' id='savegpsbtn'>Save GPS Point</div>";
content+="<br /><div class='fakebtn' onclick='sync()' id='syncbtn'></div>";
mySwiper.appendSlide('<div id="content0" class="swiper-slide"><div class="p5 center">'+content+'</div></div>');
if (geodata.length>0){
$("#syncbtn").show().css({opacity:1}).attr("onclick","sync()").html("Sync "+geodata.length+" Points");
}else{
$("#syncbtn").hide();
}
}

}

//doppelte object einträge in einem array löschen----------------------------------------------------------------------------------------------------------
function objectarray_unique(arrayName){var newArray = new Array();for(var i=0;i<arrayName.length;i++){var tmp=0;for(var j=0;j<newArray.length;j++){if (JSON.stringify(arrayName[i])==JSON.stringify(newArray[j])){tmp=1;}}if (tmp==0){newArray.push(arrayName[i]);}}return newArray;}