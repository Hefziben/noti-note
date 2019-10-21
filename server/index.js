// creating the server
const express = require("express");
const app = express();
const router = express.Router();
const axios = require('axios');


//dotenv 
require('dotenv').config()

// import CORS
const cors = require('cors');
// check computer environment port number
const port = process.env.PORT || 3002;
// To parse a boydy to json
var bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// Use CORS
app.use(cors());



//sulla
const sulla = require('sulla');

//make calls 
miInfo = '';
const Order = require('../modelos/order')





///Whatsaap bot

app.get('/', (req, res)=>{
    res.send('Hello World');
})

sulla.create().then(client => {
    start(client);
   // getOrders();
    this.myInfo = client;
    
        

} );

function start(client) {  
  client.onMessage(message => {
    console.log(message.from);
    if (message.body === 'A') {
      client.sendText('50762673437@c.us', goodText);
    }
  });
}

//wocommerce API
let defaultHeaders = {
  params: {
    orderby: "date",
  order: "desc",
  status: "processing",
  },
  withCredentials: true,
  auth: {
    username: process.env.WOOCOMMERCE_API_CLIENT,
    password: process.env.WOOCOMMERCE_API_SECRET
  }
};


app.get('/', (req, res)=>{
  res.send('Hello World');
})
        app.post("/api/v1/order", (req, res) => {
          const nuevaOrden = req.body;
          const ordenNueva = new Order(nuevaOrden);
          ordenNueva.save((err, ordenNueva) => {
            if (res.status == 400) {
              res.send({ mensaje: "error en el post", res: ordenNueva, err });
            } else {
              ///get the new order# from PWA
              let newItem = ordenNueva.number;
              console.log(newItem);

              ///get the orders from Woocommerce
              axios
                .get(
                  `${process.env.WOOCOMMERCE_API_ENDPOINT}/wp-json/wc/v3/orders`,
                  defaultHeaders
                )
                .then(data => {
                  const newo = data.data;
                  for (let items of newo) {
                    if (newItem == items.number) {
                      let myNewOrder = items;
                      console.log("se proceso una nueva orden señor");
                      //console.log(myNewOrder);
                      const mensaje = `** *FAJAS DE YESO BELLA MIA* **
                    \n  Hola *${myNewOrder.billing.first_name}*, 
                    \n¡Gracias por confiar en nosotros!
                    \nYa recibimos tu orden con ID: *${myNewOrder.number}* y vamos a procesarlo de inmediato. 
                    \n*Detalles de tu orden*
                    \n*Estado*: en proceso
                    \n*Productos* 
                    \n1.${myNewOrder.line_items[0].name} x ${myNewOrder.line_items[0].quantity} = ${myNewOrder.line_items[0].total}
                    \n*Total:* $${myNewOrder.total}
                    \n*dirección:*  
                    \n ${myNewOrder.billing.address_1} ${myNewOrder.billing.address_2} 
                    \n ${myNewOrder.billing.state} ${myNewOrder.billing.country} 
                    \n*Metodo de Pago:* Pago en la entrega
                    \n\n*En breve estaremos en contacto contigo.*`;
                      //const clienteWhatsapp = `507${myNewOrder.billing.phone}@c.us`;
                      const clienteWhatsapp = `50762673437@c.us`;
                      this.myInfo.sendText(clienteWhatsapp, mensaje).then(res =>{
                        console.log(res);
                        
                      });
                      console.log(mensaje);
                      console.log(clienteWhatsapp);
                      
                    } else{
                        console.log('orden no existe');
                        
                    }
                  }
                });

              res.send({ message: "Orden guardada", res: ordenNueva });
            }
          });
        });  
module.exports = {app, port}
