var express  		= require('express'),
	mongoose 		= require('mongoose'),
	bodyparser  	= require('body-parser'),
	methodOverride	= require('method-override'),
	app		 		= express();

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride("_method")); 

mongoose.connect("mongodb://localhost/ogrenciDb");

var ogrenciSablon = new mongoose.Schema({
    adi : String,
    soyadi : String,
    sinifi : String,
    numarasi : Number
});

var Ogrenci = mongoose.model("Ogrenci",ogrenciSablon);

app.get("/",(req,res)=>{
	Ogrenci.find({},(err,ogrenciListesi)=>{
		if(err)console.log("Hata"+err);
		res.render("index",{ogrenciListesi:ogrenciListesi});
	});
});
app.get("/ekle",(req,res)=>{
	res.render("ekle");
});

app.get("/duzenle/:id",(req,res)=>{
	Ogrenci.findById(req.params.id,(err,ogrenci)=>{
		if(err){
			console.log("Hata"+err);
		}else{
			res.render("duzenle",{ogrenci:ogrenci});
		}
	});
});

app.put("/duzenle/:id",(req,res)=>{
	Ogrenci.findByIdAndUpdate(req.params.id,req.body.ogrenci,(err)=>{
		if(err)console.log("Hata: "+err);
		res.redirect("/");
	});
});

app.delete("/:id",(req,res)=>{
	Ogrenci.findByIdAndRemove(req.params.id,(err)=>{
		if(err)console.log("Hata: "+err);
		res.redirect("/");
	});
});

app.post("/ekle",(req,res)=>{
	var adi = req.body.adi;
	var soyadi = req.body.soyadi;
	var sinifi = req.body.sinifi;
	var numarasi = req.body.numarasi;
	var yeniOgrenci = {adi:adi,soyadi:soyadi,sinifi:sinifi,numarasi:numarasi};

	Ogrenci.create(yeniOgrenci,(err)=>{
		if(err)console.log("Hata: "+err);
		console.log(yeniOgrenci);
		res.redirect("/");
	});
});

const server = app.listen(3000,(err)=>{
	if(err){
		console.log(err);
	}
	console.log("Sunucu Aktif! Port numarası: %d",server.address().port);
});