const cacheName = "MyFirstCustomCache"
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(cacheName).then((cache) => {
            return cache.match(event.request).then((response) => {
					//Eger gonderilen request ile cacheimiz match oluyorsa yani gonderilen request in respons u eger cache de var ise , o zaman sen respons u cache den al da kullan, request gonderme onun yerine...
                if (response) {
                    return response;
                } else {
						//Eger sen gonderdigin request e ait response cache de bulunmaz ise o zaman normal fetch ile request gonderip response u al
						//request gonderidginde ise gelen response u tekrar cache e yaz ki, ayni request gonderilmesi gerektitrginde onu bir dahakine cache den getirelim
                    return fetch(event.request.clone()).then((response) => {
                        cache.put(event.request, response.clone())
                        return response;
                    })
                }
            })
        }).catch((err) => {
            console.log('error', err)
        })
    )
})

//Ilk yuklendiginde..diyoruz cache ismini veriyoruz o isimle kaydediyor...sonra da diyoruz ki sen, git request sonrasi gelen datalar uzerine value ler ile birlikte yazidirilmis olan index.html i bootstrap.css i ve index.js i al..yani bunlarin respoinse donerek cikti olarak kullanciya donduruldugu halini git...cache e kaydet...cunku niye bunlar ihnternet olmadiginda gosterilsin kullanicya...COOK ONEMLI...
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            cache.addAll(['index.html', 'bootsrap.css', 'index.js'])
        }).catch((err) => {
            console.log('hata', err)
        })
    )
})

//Sonra url de istek gonderelim once, sol daki refresh iconuna saga tikla, cache i kaldir ve yeniden yukle dedikten sonra bir kez daha refresh yapip sonra networke gideriz....ORDA  GELEN DOSYA NIN NERDEN GELDIGINI GORURUZ...KI ORDA SERVICE WORKER DAN GELDGINI YAZIYOR...KI ZATEN APPLICATION A GIDERSEK DE CACHE LERE BAKARAK NELERIN CACHE LENDIGINI GOREBILIRIZ PREVIEW DAN DA GORUTULEYEBILIRIZ

//bIZ NETWORK DE HEAD E GIDINCE DE STATUS DE DE FROM SERVICE WORKERS YAZDIGINI GOREBILIRZ
//SONRA APPLICATION DA YANI BROWSER DEVELOPER TOOLS DAN APPLICATION I ACTIKTAN SONRA SOL SIDEBAR EN USTTE SERVICE WORKERS A TIKLAYIP GELEN PENCEREDE OFFLINE MODA ALIRSAK VE ARDINDAN SAYFAYI YENILEYECEK OLURSAK EGER..SAYFA DAKI DATALARIMIZIN GELDIGINI GOREBILIIRIZ....HARIKA BESTPRACTISE....
//Biz bu caching isleminin bize gonderilen request sayisi konusunda ne kadar faydasi oldugnu gormek istedigmiz de sunu yapariz...Ayni projeyi caching islemlerini cikararak olustururuz birde ve sonrasinda browser da acip network kismina gidip en altta request sayisini gorebiliriz ama request sayisi zaten ayni sayida olacak ama, asil olarak gelen respoinse un nerden geldigine bakmmamiz gerekiyor bunu da netwerk deki tum request lerin karsilarina bakip orda serviceWorker yazanlar caching den gelenlerdir....Burda tek tek bakarak ilk andaki toplam request saysiindan kac tanesi cache den gelmis bunu gorebiliriz....COOOOK ONEMLI....
//Birde sunu goruruz....CACHINGGG ISLEMI... ILE NETWORK U KAPATIRSAK...APPLICATION DAN HALA DATAMIZIN GELDIGNI GOREBILIRIZI CACHING YAPTIGMIZ YERDE