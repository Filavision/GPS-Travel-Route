var akttime = new Date();
var content;
var storagetype = 0;

//initApp------------------------------------------------------------------------------------------------
function initApp(){
if(typeof NativeStorage!=="undefined"){storagetype=0;}else{storagetype=1;}
if (storagetype==0){
NativeStorage.getItem("geodata", function(result){if(typeof result==="object"){geodata = result}else{geodata = []}}, function(e){geodata = []});
}else{
if (localStorage.getItem("geodata")!=null){geodata = JSON.parse(localStorage.getItem("geodata")) || []}else{geodata = []}
}
mySwiper = new Swiper(".swiper-container", {threshold:10,autoHeight:true});
buildpage("start");
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
alert("Position saved!");
}
function geoErrorLive(error){
$("#savegpsbtn").css({opacity:1}).attr("onclick","saveGPS()");
alert("Position not found!");
}

//seitenaufbau--------------------------------------------------------------------------------------------------------------------
function buildpage(page){
akttime = new Date();
mySwiper.removeAllSlides();

if (page=="start"){//start
content="<h1>Save your GPS Position</h1><div class='fakebtn' onclick='saveGPS()' id='savegpsbtn'>Save GPS Point</div>";
mySwiper.appendSlide('<div id="content0" class="swiper-slide"><div class="p5 center">'+content+'</div></div>');
}

}

//doppelte object einträge in einem array löschen----------------------------------------------------------------------------------------------------------
function objectarray_unique(arrayName){var newArray = new Array();for(var i=0;i<arrayName.length;i++){var tmp=0;for(var j=0;j<newArray.length;j++){if (JSON.stringify(arrayName[i])==JSON.stringify(newArray[j])){tmp=1;}}if (tmp==0){newArray.push(arrayName[i]);}}return newArray;}