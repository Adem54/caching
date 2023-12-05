let SW_INFO="";

//Sayfam yuklendigi zaman bir islem yapmak istiyorum..Ve serviceworker i sayfa yuklenir yuklnmez..service worker javascript dosyamiz in ismi ne ise onu register yapiyorum oncelikle 
//Burasi hep standarttir...once service-worker i register yapariz her zaman...
document.addEventListener("DOMContentLoaded",()=>{
  if("serviceWorker" in navigator){//navigator objesinde serviceWorker diye bir property var mi demektir bu
	//if (navigator.serviceWorker) { = if("serviceWorker" in navigator){ ayni seydir bunlar
    navigator.serviceWorker.register('./sw.js').then((registration)=>{
        console.log("register-service-worker-response: ",registration)
          SW_INFO = registration.installing || registration.waiting || registration.active;
			 //SW_INFO degiskenine register in status unu assign ediyoruz
			 console.log("SW_INFO: ",SW_INFO)
    })
  }
})
//simdi burda bilemmiz gereken cok onemli bir nokta....Biz register islemini  yaptigimiz zaman, islem register edilip edilmedigini anlamak icin 
//1-Zaten console.llog  a status durumunu yazdirip kontrol edebiliyoruz  yukarda yaptgimz gibi..Service-worker in status durumunu biz SW_INFO degiskenine atadik ki bu status durumuna gore islemler yapacagiz eger ornegn aktif ise deaktif et dememeiz gerekebilir veya tam tersi, deaktif ise aktif et gibi...
//2-Chrome devtools dan Application a git sol sidebar da Service workers a gidersek orda STatus a baktgimiz da #1647 activated and is running oldugunu gorebiliriz 

/*
Ayrica yine Devtools da Application da STatus u daha detayli da gorebiliyoruz 
Version	Update Activity	Timeline
#1650	Install	
​
#1650	Wait	
​
#1650	Activate

*/





//Burda da bir uzak endpoint imize request gonderiyoruz
const fetchData=()=>{
  fetch('https://jsonplaceholder.typicode.com/photos')
      .then(response => response.json())
      .then(json => {
			console.log("json: ", json);
        document.getElementById('h2').innerHTML=json.length
      })
}
fetchData()