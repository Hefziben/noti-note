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
let tarea;
let whatsaap;
const Order = require('../modelos/order');
const Contacto = require('../modelos/contact');
const Tarea = require('../modelos/tarea');





///Whatsaap bot

app.get('/', (req, res)=>{
    res.send('Hello World');
})

sulla.create().then(client => {
    start(client);
   // getOrders();
    this.myInfo = client;
    whatsaap = client;
} );


// start sample
function start(client) {  
  var contacts = [{
    number: '50767114371'
  }, {
    number: '50767676199'
  }  
];
  client.onMessage(message => {
    console.log(message.from);
    if (message.body === 'A') {
      for (let i = 0; i < contacts.length; i++) {
        const item = contacts[i].number + '@c.us';
        console.log(item);
        client.sendText(item,'hello'); 
      }
      
    }
  });
}

//crear un nuevo contacto
app.post('/nuevoContacto', (req, res)=>{
  const nuevoContacto = req.body
  console.log(nuevoContacto);    
  const crearContacto = new Contacto(nuevoContacto);
  crearContacto.save((err, crearContacto)=>{
    if(res.status == 400) {
      res.send({ mensaje: "error en el post", res: status, err });
    } else {
      res.send({ mensaje: "Contacto guardado con exito", res: crearContacto, err });
    }
  } )
})

//traer contactos
app.get("/contactos", (req, res) => {
 	Contacto.find({}, (err, contactos) =>{
    if(res.status == 400) {
      res.send({ mensaje: "error en el get", res: status, err });
    } else {
      res.send({ mensaje: "peticion existosa", datos: contactos });
      // for (let i = 0; i < contactos.length; i++) {
      //   const element = contactos[i].nombre;
      //   console.log('soy ' + element);
      // }
    }
       
    });
});

//traer contactto por ID
app.get('/contacto/:id', (req, res)=>{
  contactoId = req.params.id;
  Contacto.findById(contactoId)
           .exec()
           .then(datos => 
              res.status(200).send(datos))
              .catch(err => res.status(400).send(err));
})

//Actualizar contacto
app.put('/contacto/:id', (req, res)=>{
  const contactoId = req.params.id;
  Contacto.findByIdAndUpdate(contactoId,
      {$set:req.body}, {new:true})
      .then(datos => res.status(200).send(datos))
.catch(err => res.status(400).send(err));
});

 //borrar contacto
 app.delete('/contacto/:id', (req, res)=>{
  const contactoId = req.params.id;
  Contacto.findByIdAndDelete(contactoId)
      .then(datos => res.status(200).send(datos))
.catch(err => res.status(400).send(err));
});

// **** Crear tareas ***//

//crear tarea con mensaje
app.post('/nuevaTarea', (req, res)=>{
  const nuevaTarea = req.body
  console.log(nuevaTarea);    
  const crearTarea = new Tarea(nuevaTarea);
  crearTarea.save((err, crearTarea)=>{
    if(res.status == 400) {
      res.send({ mensaje: "error en el post", res: status, err });
    } else {
      res.send({ mensaje: "Tarea guardado con exito", res: crearTarea, err });
    }
  } )
})

//buscar tareas
app.get("/tareas", (req, res) => {
  Tarea.find({}, (err, tareas) =>{
   if(res.status == 400) {
     res.send({ mensaje: "error en el get", res: status, err });
   } else {
     res.send({ mensaje: "peticion existosa", res: tareas, err });
    
   }
      
   });
});

//Actualizar tarea
app.put('/tarea/:id', (req, res)=>{
  const tareaId = req.params.id;
  Tarea.findByIdAndUpdate(tareaId,
      {$set:req.body}, {new:true})
      .then(datos => {
        tarea = datos;
        res.status(200).send(datos)
          //console.log(datos); 
      }).then(()=>{
        axios.get('https://whatnotif.herokuapp.com/contactos').then(data =>{
          const contactos = data.data.datos;
          for (let i = 0; i < contactos.length; i++) {
            const cliente = contactos[i];  
            const telefono = `507${cliente.telefono}@c.us`
          const mensaje = `Hola ${cliente.nombre},\n${tarea.mensaje} a tu numero ${cliente.telefono} para la campaña de whatsapp Marketing.\nAtt: Raynier 👋`          
            console.log(mensaje);
            whatsaap.sendText(telefono,mensaje);            
          }
          
        })
      })
.catch(err => res.status(400).send(err));
});

 //borrar tarea
 app.delete('/tarea/:id', (req, res)=>{
  const tareaId = req.params.id;
  Tarea.findByIdAndDelete(tareaId)
      .then(datos => res.status(200).send({ mensaje: "Tarea borrada con exito" }))
.catch(err => res.status(400).send({ mensaje: "Error al borrar tarea", res:err }));
});

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

app.get("/wakeUp", (req, res) => {
  const status = "Alguine me desperto, vere que quiere";  
  if (res.status == 400) {
    res.send({ mensaje: "error en el post", res: status, err });
  } else {
    this.myInfo.sendText("50762673437@c.us", status);
    res.send("me desperte");
    console.log("despierto");
  }
});


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
                      const clienteWhatsapp = `507${myNewOrder.billing.phone}@c.us`;
                      //const clienteWhatsapp = `50762673437@c.us`;
                      this.myInfo.sendText(clienteWhatsapp, mensaje);
                      console.log(mensaje);
                      console.log(clienteWhatsapp);
                    } else {
                      console.log("orden no existe");
                    }
                  }
                });

              res.send({ message: "Orden guardada", res: ordenNueva });
            }
          });
        });  

module.exports = {app, port}
