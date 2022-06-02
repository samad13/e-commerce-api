const express = require("express")
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const router = express.Router();
const cors = require('cors');
require("dotenv/config");
const authJwt = require('./helpers/jwt');
 const errorHandler = require('./helpers/error-handlers')

app.use(cors());
app.options('*', cors())
//middleware
//app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
 app.use(errorHandler)

const api = process.env.API_URL


// routes
const productsRouter = require('./routers/products')
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');

 
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/products`, productsRouter)
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);



//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true, useUnifiedTopology: true
})
.then(()=>{
    console.log("database connected...")
})
.catch((err)=>{
    console.log(err)
})


app.listen(4000, ()=>{
    console.log("server running on port 400")
})