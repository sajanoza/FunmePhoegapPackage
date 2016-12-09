document.addEventListener('deviceready', initMyScript, false);

function initMyScript(){
	
	/*$(document).swipe( {
  swipeUp:function(event, direction, distance, duration) {  
    console.log("You swiped up");
	sendReaction(userId,currentContentId,3);
  },
  swipeDown:function(event, direction, distance, duration) {
    console.log("You swiped down");
	sendReaction(userId,currentContentId,1);
  },
  swipeLeft:function(event, direction, distance, duration) {
    console.log("You swiped left");
	sendReaction(userId,currentContentId,2);
  },
  click:function(event, target) { 
  },
  threshold:50,
  allowPageScroll:"horizontal"
});*/


var fcTitleH1 = document.getElementById("fcTitleH1");
var fcContentDiv = document.getElementById("fcContentDiv");
var userId;

var currentContentId;

//guziory
var banBtn = document.getElementById("banBtn");
var dontCareBtn = document.getElementById("dontCareBtn");
var likeBtn = document.getElementById("likeBtn");




// tu zaczynam broić!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//window.localStorage.removeItem("zalogowanyUser");
var zalogowanyUser = window.localStorage.getItem("zalogowanyUser");
if (zalogowanyUser){
	console.log("user jest juz zalogowany jako user: "+zalogowanyUser);
	userId=zalogowanyUser;
	pobierzContent();
}else{
	//jesli nie tworzymu usera
	var nazwaNowegoUsera = md5(new Date().getTime());
	var apiRequest = new Object();
	apiRequest.action = "addUser";
	apiRequest.login = nazwaNowegoUsera;
	apiRequest.eMail = "dummyEmail@dupa.pl";
	apiRequest.password = "fnm";
	var jsonAjax = new SajanaAjax('http://fnm.iexample.pl/server_mobile_services/php_api.php',gdyUserStworzony);
	jsonAjax.dodaj("apiRequest",apiRequest);
	jsonAjax.start();
;
}
function gdyUserStworzony(response){
	console.log(response)
	if (response['status']=="sukces"){
		zalogowanyUser = response['userId'];
		window.localStorage.setItem("zalogowanyUser", zalogowanyUser);
		userId=zalogowanyUser;
		pobierzContent();
	}

	
}




function pobierzContent(){
	var apiRequest = new Object();
	apiRequest.action = "getContent";
	apiRequest.userId = userId;
	
	var jsonAjax = new SajanaAjax('http://fnm.iexample.pl/server_mobile_services/php_api.php',przetworzResponseCntentu);
	jsonAjax.dodaj("apiRequest",apiRequest);
	jsonAjax.start();	
}


//to trza zmienic







//listenery
banBtn.addEventListener("click",banBtnOnClick);
dontCareBtn.addEventListener("click",dontCareBtnOnClick);
likeBtn.addEventListener("click",likeBtnOnClick);

//funkcje na klik
function banBtnOnClick(){
	sendReaction(userId,currentContentId,1);
}
function dontCareBtnOnClick(){
	sendReaction(userId,currentContentId,2);
}
function likeBtnOnClick(){
	sendReaction(userId,currentContentId,3);
}

function sendReaction(userId,fcObjectId,fcReaction){
	var jsonAjaxBan = new SajanaAjax('http://fnm.iexample.pl/server_mobile_services/php_api.php',gdyWyslanaReakcja);
	var reactionApiRequest = new Object();
	reactionApiRequest.action = "sendReaction";
	reactionApiRequest.userId = userId;
	reactionApiRequest.fcObjectId = fcObjectId;
	reactionApiRequest.fcReaction = fcReaction;
	jsonAjaxBan.dodaj("apiRequest",reactionApiRequest);
	jsonAjaxBan.start();
	
}

function gdyWyslanaReakcja(response){
	console.log("gdyWyslanaReakcja"+response.status);
	if (response.status == "sukces"){
		pobierzContent();
		
		
		
		
	}
}











function przetworzResponseCntentu(response){
	if (response){
		console.log(response);
		var fcContentHTML = decodeHTMLEntities (response.fcContent);
		var fcTitle = response.fcTitle;
		currentContentId = 	response.id;
		
		fcContentDiv.innerHTML = fcContentHTML;	
		fcTitleH1.innerHTML = fcTitle;
		
	}
}







/*
"Klasa"/prototyp do zybkiego ajaxowaia
przyjmuje url phpa i funkcje callbackową której zwraca respone od serwera

Metody:

dodaj(varname,varval); //podajemy dane do wyslania na serwer klucz/nazwa dla php post data i wartosc
!!zalca się wysyłanie wszystkich danych w ednym obiekcie i wywołanie tej metody raz wtedy dowolna struktura danych idzie jako json jako jedna parametr post
 choć można dodaać wiele obiektów oddzielnie wtedy każdy idzie w oddzielnym json stringu w oddzielnym parametrze post
start(); //uruchamia żadanie

*/
function SajanaAjax (url,callBackFunction){
	this.url = url; //url do php
	this.formData = new FormData(); //form data do wysłania
	this.request = new XMLHttpRequest (); //request
	this.request.open('POST',url,true); //otwieranie połaczenia
	this.request.addEventListener("load",onload); // nasłuch odbioru
	this.request.onreadystatechange = function (e) {
	  if (e.currentTarget.readyState == 4) {
		 if(e.currentTarget.status == 200){// jak się uda odebrać response
			 var odebranyJsonString = e.currentTarget.responseText; // odbieramy z php jsonString z responsem
			 var odebranyObiekt = JSON.parse(odebranyJsonString); // rozkodowujemy
			 callBackFunction(odebranyObiekt);// przekazujemy do funkcji callbeckowej do przetworzenia
		 }else{
		  console.log("obsrałosię");//log błedu
		 }
	  }
	};

	this.dodaj = function(varname,varval){//dodawanie obiektów/wartości do wysłania
		varval = JSON.stringify(varval); // kodowanie obiektu/wartości do jsonStringa
		this.formData.append(varname,varval);//dodanie do FormData

	}
	this.start = function(){ //wysyłanie requestu
		this.request.send(this.formData);
	}
}









function decodeHTMLEntities(text) {
    var entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];

    for (var i = 0, max = entities.length; i < max; ++i) 
        text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

    return text;
}
}