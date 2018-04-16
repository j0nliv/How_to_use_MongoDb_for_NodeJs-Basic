## NodeJs kullanarak MongoDb ile Veritabanı İşlemleri Gerçekleştirme<br><br>
![resim](https://cdn-images-1.medium.com/max/720/1*ay9nx1XdZ3AOzx5Ev8xJEg.png)<br>
**MongoDb'yi edinmek için: [MongoDB](https://www.mongodb.com/download-center?jmp=nav)** <br>
**Projeye dahil edilen packageler:**
*mongoose,express,ejs,body-parser,method-override*<br><br>
`app.set('view engine','ejs');`<br>
* *Projede varsayılan view engine'in ejs olduğunu belirttik.*<br>

`app.use(bodyparser.urlencoded({extended:true}));`<br>
* *Body-parser package'i kullanılabilir hale getirdik.*<br>

`app.use(methodOverride("_method"));`<br>
* *Method-override package'i kullanılmak üzere aktif hale getirdik ve _method ismi ile kullanıldığını belirttik.*<br>

`mongoose.connect("mongodb://localhost/ogrenciDb");`<br>
* *Veritabanımızı local olarak oluşturduk.*<br>

`var ogrenciSablon = new mongoose.Schema({
    adi : String,
    soyadi : String,
    sinifi : String,
    numarasi : Number
});`<br>
* *Örnek dökümanımızı oluşturduk ve kaydedeceğimiz verilerin tiplerini ve özelliklerini belirttik.*<br>

`var Ogrenci = mongoose.model("Ogrenci",ogrenciSablon);`<br>
* *Oluşturduğumuz dökümanımızı veritabanına bağladık.*<br>

### Veri Arama (app.js) <br>
`app.get("/",(req,res)=>{`<br>
	`Ogrenci.find({},(err,ogrenciListesi)=>{`<br>
   * *Herhangi bir şart belirtmeksizin dökümanımızdan verileri çektik ve verileri ogrenciListesi parametresine atadık.*<br>
  
   `if(err)console.log("Hata"+err);`<br>
   `res.render("index",{ogrenciListesi:ogrenciListesi});`<br>
   
   * *Index.ejs sayfasını render ederek bu sayfada kullanılmak üzere ogrenciListesindeki verileri geçirdik.*<br>
   
  `});});`<br>
  `app.get("/ekle",(req,res)=>{`<br>
	`res.render("ekle");`<br>
`});`<br>

`app.get("/duzenle/:id",(req,res)=>{`<br>
  * *:id ile url üzerinden id değerini request ettik.*<br>
  
`Ogrenci.findById(req.params.id,(err,ogrenci)=>{`<br>
 * *Request edilen id değerinin bulunduğu veri dökümanımızda varsa listeleyerek öğrenci parametresine geçirdik.*<br>
  
`if(err)console.log("Hata"+err);`<br>
`else res.render("duzenle",{ogrenci:ogrenci});`<br>
`});});`<br>

### Veri Güncelleme (app.js)
`app.put("/duzenle/:id",(req,res)=>{`<br>
	`Ogrenci.findByIdAndUpdate(req.params.id,req.body.ogrenci,(err)=>{`<br>
  
 * *Request edilen id değerinin bulunduğu verinin döküman verileri, düzenle formundaki düzenlediğimiz verilerle günceller.*<br>
		
   `if(err)console.log("Hata: "+err);`<br>
	 `res.redirect("/");`<br>
  * *Index sayfasına yönlendirdik.*<br>
     
`});});`<br>

### Veri Silme (app.js)
`app.delete("/:id",(req,res)=>{`<br>
* *Method-override package kullanarak oluşturduğumuz(index.ejs'de tanımlanan) delete metodunu post ettik.*<br>

`Ogrenci.findByIdAndRemove(req.params.id,(err)=>{`<br>
* *Request edilen id değerinin bulunduğu veriyi dökümanımızdan listeleyerek silme işlemini gerçekleştirdik.*<br>

`if(err)console.log("Hata: "+err);`<br>
`res.redirect("/");`<br>
`});});`<br>

### Veri Ekleme (app.js)
`app.post("/ekle",(req,res)=>{`<br>
`var adi = req.body.adi;`<br>
`var soyadi = req.body.soyadi;`<br>
`var sinifi = req.body.sinifi;`<br>
`var numarasi = req.body.numarasi;`<br>
* *Body-parser package yardımıyla ekle.ejs'de oluşturduğumuz form elemanlarındaki değerlere erişimi sağladık*<br>

`var yeniOgrenci = {adi:adi,soyadi:soyadi,sinifi:sinifi,numarasi:numarasi};`<br>
* *Verileri json formatında kaydetmek üzere düzenledik.*<br>

`Ogrenci.create(yeniOgrenci,(err)=>{`<br>
* *Tanımladığımız yeniOgrenci json nesnesini dökümanımıza kaydettik.*<br>

`if(err)console.log("Hata: "+err);`<br>
`console.log(yeniOgrenci);`<br>
`res.redirect("/");`<br>
`});});`<br>    
 
 ### Sunucuyu Ayağa Kaldırma
 `const server = app.listen(3000,(err)=>{`<br>
	 `if(err)console.log(err);`<br>
	 `console.log("Sunucu Aktif! Port numarası: %d",server.address().port);`<br>
   `});`<br>
   
 ### Index.ejs
 `<% ogrenciListesi.forEach((ogrenciler)=>{ %>`<br>
 * *ogrenciListesi parametresiyle gönderdiğimiz verileri foreach döngüsü ile listelemek üzere ogrenciler nesnesine atadık.*<br>
 
 `<%= ogrenciler.adi %>`<br>
 * *ogrenciler nesnesinin değerine erişerek yazdırdık.(Veri yazdırırken = konulmalıdır.)*<br>
 
 `/<%= ogrenciler.id %>?_method=DELETE"`<br>
 * *Method-override package kullanarak sil methodumuzu oluşturduk.*<br>
 
 ### Ekle.ejs
 `name="adi">`<br>
 * *Body-parser package yardımıyla form elemanlarına girilen değerleri post ettik.*<br>
 
 ### Duzenle.ejs
 `action="/duzenle/<%= ogrenci.id %>?_method=PUT"`<br>
 * *Method-override package kullanarak düzenle methodumuzu oluşturduk.*<br>
 
 `name="ogrenci[adi]"`<br>
 * *Düzenlenecek verileri ogrenci dizisi olarak gönderdiğimizden namelerini bu şekilde düzenledik.*<br>

