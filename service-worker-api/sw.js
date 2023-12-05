
console.log("sw")
//Service-worker file i main.js de kaydettikten sonra sw.js dosyasinda ilk olarak yapacagimz islem, servicework un install eventini tetiklemektir
//Simdi bu install islemi zaten service-worker i tanimldgimz da 1 kere tetiklendigi icin sonradan bizim bu yazdigmz kodlari ve console u bize bir turlu gostermeyecektir, bu install event indeki consolelari gorebilmek icin, en ustteki console.log("sw") u kaldirip tekrar yazarsak o zaman install eventi icindeki console lari gorebilirz
//Birde eger Application da sol sidebar Service Worker a tiklayinca skip-waiting diye bir button var ise ona tiklayarak beklemesini gec diyebilirz..ya da yine arkada application da unregister, stop deyip tekrar refresh edebiliriz sayfamizi
self.addEventListener('install',(ev)=>{
    console.log("install-event: ", ev)
    console.log("installed !!!")
	//sw.js icinde install eventinin icinde cache islemini baslatabiliriz, cache lemek istedigmz yerleri burda cache leyebiliriz artik
	//ev.waitUntil( event bir sonraki duruma gecene kadar birseyleri beklesin
	//Burda verilen cachelenecek dosyalari ekleyene bakla ardindan da active duruma dus diyebiliriz
	//caches.open() deddgimz de bizim cache imize bir isim vermemiz gerekiyor bu isim bize bagli biz burda hangi ismi verirsek browser da devtools da application menusunde bu isimle kaydedecek cache i..Burda birden fazla cache leyecegimz dosyalari dizi icinde girebiliriz 
	// '/' diyerek kok dizini ana sayfayi cache lemis oluruz..Bu neden onemli cunku,node_modules icerisindeki...kullanilan ku

    ev.waitUntil(
        caches.open("myCache").then((cache)=>{
            console.log(cache)
            cache.addAll(['/','/index.html','/main.js']).then(()=>{
                console.log("Anasayfaya ait js ve html cachelendi")
            },(err)=>{
                console.log("cache işleminde hata ",err)
            })
					//Cache lemeleri yaparken istersek eger sirasi ile that diye devam edip devaminda yeni bir dosya yi da cache leyebiliyoruz
					//Ama sunu unutmayalim..cache ekleme isleminde her zaman caches.open diye cache i acmamiz gerekiyor 
        }).then(()=>{
            caches.open("myCache").then((cache)=>{
                cache.addAll(['/assets/resim.jpg']).then(()=>{//Benim direk klasorden aldigimz resmi de sen cache le ki daha hizli  yukleme gerceklesebilsin..tekrar tekrar her seferinde bastan resmi yuklemeye calismasin
                    console.log("Resim cachelendi")
                },(err)=>{
                    console.log("resim cache işleminde hata ",err)
                })
            })
         
        })
    )
})
//Bu cache ledgimiz dosyalari hangi isimler uzerinden cache ledi isek onlari kontrol etmek icin ise yine browser-dev-tools dan Application a gidip sol sidebar da Cache storage da kontrol edebilriiz neler in cachelendigiini. Birde tabi ki sayfamizi ilk yuklendikten sonra(ilk yukleme her zaman uzak endpointten olur henuz cache de birsey olmadigindan dolayi..), sonrasinda dev-tools network den 

//Soyle dusunelim..Bizim uygulamamizin bir cok buyuk boyutta resim  oldugunu dusunursek, uzak apiden aldigi veya index.html icinde.. o zaman her refresh de sayfanin gosterilmesi cok  uzun zaman alacaktir ama cache e 1 kez kaydedildikten sonra ilk verileri alirken biraz zaman alir ama ardindan cache den getirildiginde cok daha hizli performansli bir sekilde getirecektir


//Burda da active oldugu durumda...Tekrar active yapmis oluyoruz...
self.addEventListener('activate',(ev)=>{
    console.log(ev)
    console.log("active !!!")

	//Burda cache listemizde tutmaya devam etmek istedgimz array i belirleriz ve ardindan da silmek istegimz cache ismini tutmak istedimz cache listesi icinde yok ise sil diyerek den belirli bir sure den sonra cache ler den istediklerimzin silinmesini saglayabiliriz

	 const cachesToKeep = ["v2"];

  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (!cachesToKeep.includes(key)) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
})


//Simdi buraya dikkat edelim...Biz cache leri yukarda kaydettik ama kaydettigimz cacheleri client-side da kullanilabilmeleri icin..bizim fetch event i icinde eger gondrilecek olan request e ait response daha onceden cache de var ise o zaman sen o responsu git cache den al , hic bosu bosuna bir kez daha uzak apiye fetch yapma, ama yok cache icinde bulamaz isen o zaamn tamam gidip fetch islemini uzak apiden yapabilirsin diyecegiz
//Muhtemelen cache leme islemi yapilan request ler e bir id atiyordur cache e kaydederken, ayni id de request gondrildiginde, o id li request cache de var mi onu kontrol edip...o id li request e ati respoinsu cache den veriyuordur
//Yani network de ki o her bir satir bir fetch islemidir, yani sadece apilere gonderilen requestler degill..ornegin resim eger url uzerinden aliniyor ise o da bir fetch islemidir..Sonra mesele eger html icinde font lar script tarafindan aliniyorsa onlar da uzaktan data cekiyor birer fetch islemidir
/*
    <img src="https://images.unsplash.com/photo-1676359912443-1bf438548584?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
*/

self.addEventListener('fetch',(ev)=>{
    console.log('ev', ev)
    console.log(ev.request.url)
    console.log("fetch !!!")
	 //Burda yapilan tum fetch islemlerini yakalamis oluyoruz...ZATEN KRITIK NOKTA DA BURASIDIR, CUNKU BUNLAR UZAKTAN GETIRILIYOR BIZ BUNLARI CACHE DEN GETIR EGER CACHE E KAYDEDIILMIS ISE DEYIP CACHE DEN GETIRILMESINI SAGLADIGMZDA...OFFLINE DURUMDA UYGULAMAMIZIN KULLANILABILMESINI SAGLAMIS OLACAGIZ
	 //
    ev.respondWith(//Burasini kullandigmz da burasi prevent the browser's default handling, and provide(a promise for) a response yourself..Kendi responsuzmu kullanmamizi sagliyor
		//Eger fetch event inin respons u, cache icinde var ise demis oluyuorz burda..Yani bir proxy server veya bir middleware gibi calisiyor ve araya giriyor ve diyor ki eger response cache imde var ise bunu cach imizden alip kullanalim
      //  caches.match(ev.request).then((cacheResponse)=>{
			//Eger cacheResponse var ise yani daha once boyle bir request e ait response cache kaydedilmis ise o zaman cacheResponsu bana ver yok boyle bir response yok ise cache de o zamanda sen normal uzak api ye fetch yap, ve dikkat edelim uzak api ye fetch yapiyrosan o zaman da ordan gelen responsu da hemencecik cache ekle, kaydet ki bir sonraki ayni url e request atildiginda, sen onu o zaman cache den getirebil..Ama bunun icin ise...yeni bir cache ismi ile cache e kaydediliyor..Burda da yeni bir cahce ismi ile 'dynamicCache' ile de kaydedbilirz ya da zaten yuukadar daha onceeddn bir kez acip kaydettimgiz  myCache ismi ile de yapabilirz ya da istersek...fetch leri customize yaparak..iste ornegin jsonplaceholder a istek atiliyor ise o zaman yeni bir cahce ismi ac vs de denebilir belki..
	//BURASI BOYLE DE YAPILIR-1		
			caches.match(ev.request).then((cacheResponse)=>{
            return cacheResponse || fetch(ev.request).then((response)=>{
              return caches.open("dynamicCache").then((cache)=>{
                    cache.put(ev.request,response.clone())//yeni bir fetch deen response geldi o responun clonu  nu kaydeddecgiz
                    return response
                })
            })
        })
    )

	 //AMA BU SEKILDE DE YAPILIR YENI BIR CACHE ISMINI KULLANMADAN MEVCUT KAYDETTIMGZ CACHE IN ICINE DE YAPABILIRIZ
	 //Yani once cache i ismini vererek acip ardindan tum kontrolleri yaparak respionse burda var ise burdan kullan yok ise uzak api den fetch et ve onu da hemen cache e kaydet ki bir sonraki request url ayni olursa cache den data yi alabilelim
	 /*
	 caches.open("myCache").then((cache)=>
	 {
		caches.match(ev.request).then((cacheResponse)=>{
			if(cacheResponse)
			{
				return cacheResponse;
			}else{
			
				return fetch(ev.request).then((response)=>{
					cache.put(ev.request, response.clone())
					return response;
				})
			}
		})
	 })  */
})

/*

Cache ne yapiyor biliyor muyuz ayni ne gibi davraniyor soyle yapiyor hem data yi kaydediyor hem de o data ya ait fetch-url i kaydediyor o url e istek gonderilince gidiyor cache e daha once boyle bir url e istek gonderilme durumunda cache bir respoinse kaydedilmis mi kaydedilmis ise , data yi cache den aliyor...aslinda isin ana ozeti tam olarak budur...YANI TABIRI CAIZ ISE MINI BIR ENDPOINT ISLEVI GORECEK SEKILDE...CALISIYOR AMA LOKALDE CALISIYOR...INTERNET OLMADIGI DURUMLARDA ISTE BUYUZDEN...BU SEKILDE KOLAYCA CALISIYOR
*/