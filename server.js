var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var {AccountModel,UserModel,pointModel} = require('./Database/connectDB')
//var jwt = require('jsonwebtoken')
var configViewEngine = require('./viewEngine')
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


configViewEngine(app);
app.use(cookieParser());

// hiển thị giao diện đăng nhập
app.get('/dang-nhap',(req,res,next) => {
    res.render('../views/dangnhap.ejs');
})

//lấy dữ liệu từ client và compare with db
app.post('/dang-nhap', (req,res,next) => {
    var mssv = req.body.mssv;
    var password = req.body.password;
    AccountModel.findOne({
        mssv: mssv,
        password: password
    })
    .then(data => {
        if(data) {
            //var token = jwt.sign(data.mssv, 'mk')
            res.cookie('mssv',req.body.mssv)
            //console.log('token: ',token);
            return res.redirect('/trang-chu');
        }else {
            return res.json('that bai');
        }
    })
    .catch(err => {
        res.status(500).json('loi server')
    })
});

// hiển thị giao diện trang chủ và dùng middleware để lấy dữ liệu từ cookie
app.get('/trang-chu', (req,res,next) => {
    UserModel.findOne({
        mssv: req.cookies.mssv
     })
         .then(dataa => {
             if(dataa) {
                res.render('../views/trangchu.ejs', {dataUser: dataa})
             }else {
                 return console.log('loi server')
             }
         })
         .catch(err => {
            console.log(err)
            res.status(500).json('loi server')
         })
});

app.get('/lich-hoc', (req,res,next) => {
    res.render('../views/lichhoc.ejs')
})

app.get('/ket-qua',  (req,res,next) => {
    pointModel.find({
        mssv: req.cookies.mssv
    })
    .then(data =>{
        if(data) {
            res.render('../views/ketqua.ejs',{dataPoint: data})
        }else{
            console.log('sairoi')
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json('Loi server');
    })
});

app.listen(8080, () => {
    console.log(`Server started on port`);
});