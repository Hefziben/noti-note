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
const Order = require('../modelos/order');
const Contacto = require('../modelos/contact');
const Tarea = require('../modelos/tarea');

//make calls 
miInfo = '';
let tarea;
let whatsaap;
let apiDev = 'http://localhost:3002'
let apiProd = 'https://whatnotif.herokuapp.com'
let categoriaId = [];

const bienvenida = 
  `Que bueno que te animaste a ser parte de whatsy Marketing Panamá. Para comenzar a recibir promocienes envía la frase inicial de la(s) categoría(s) de tu preferencia separadas conun espaco:
\nAutomotriz: *au*    -  Cursos: *cu*
Restaurantes: *re*  - Eventos: *ev*
Salones y Spa: *ss* - Hoteles: *ho*
Medicina: *me*      - Moda: *mo*
Productos: *pr*     - Servicios: *se*`

///Whatsaap bot

app.get('/', (req, res)=>{
    res.send('Hello World');

   
})

// function sayHello() {
//   const promo =  {nombre: 'pizza',
//     categoria:'pr',
//   mensaje: 'approvecha descuento'}
//   console.log(promo.categoria);
  
  
//   axios.get(`${apiDev}/contactos`).then( data => {     
//     const contactos = data.data.datos;    
//     for (let contacto of contactos ) {
//       console.log(contacto.categorias);      
//       const categoriaExiste = RegExp(promo.categoria, 'i').test(contacto.categorias);
//       //console.log(categoriaExiste);
//       if (categoriaExiste){
//         console.log(contacto.nombre + ' incluye la caterogia '+ promo.categoria );       
        
        
//       } 
      
//     }
//   });
   
   
// }

sulla.create().then(client => {
    start(client);
   // getOrders();
    myInfo = client;
    whatsaap = client;
} );


//start sample
function start(client) {
  client.onMessage(message => {
    console.log(message.from);   
    axios.get(`${apiDev}/contactos`).then(data => {
      const contactos = data.data.datos;
      for (let contacto of contactos) {
        if (message.from == `507${contacto.telefono}@c.us`) {
          const usuario = contacto;
          //console.log(usuario);
          const automotriz = RegExp('au', 'i').test(message.body);
          const cursos = RegExp('cu', 'i').test(message.body);
          const restaurantes= RegExp('re', 'i').test(message.body);
          const eventos = RegExp('ev', 'i').test(message.body);
          const salones_Spa = RegExp('ss', 'i').test(message.body);
          const hoteles = RegExp('ho', 'i').test(message.body);
          const medicina = RegExp('me', 'i').test(message.body);
          const productos = RegExp('pr', 'i').test(message.body);
          const servicios = RegExp('se', 'i').test(message.body);
          if(automotriz){
            usuario.categorias.push('au')
            categoriaId.push('automotriz')
          } if(cursos){
             usuario.categorias.push('cu')
             categoriaId.push('cursos')
          } if(restaurantes){
             usuario.categorias.push('re')
             categoriaId.push('restaurantes')
          } if(eventos){
             usuario.categorias.push('ev')
             categoriaId.push('eventos')
          } if(salones_Spa){
             usuario.categorias.push('ss')
             categoriaId.push('salonos y spa')
          } if(hoteles){
             usuario.categorias.push('ho')
             categoriaId.push('hoteles')
          } if(medicina){
             usuario.categorias.push('me')
             categoriaId.push('medicina')
          } if(productos){
             usuario.categorias.push('pr')
             categoriaId.push('productos')
          } if(servicios){
             usuario.categorias.push('se')
             categoriaId.push('servicios')
          }
          
          let datos = {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            telefono:usuario.telefono,
            categorias: usuario.categorias
          }
          console.log(categoriaId);
          console.log(usuario._id);
          
          axios.put(`${apiDev}/contacto/${usuario._id}`, datos).then( data =>{
            console.log(data.data);
             
          })
          
          return
        } else{
          // nuevo contacto
          const usuarioNuevo = {
            telefono: message.from
          }
          console.log('contacto no existe');
          axios.post(`${apiDev}/nuevoContacto`, usuarioNuevo).then(data =>{
            console.log(data.data);            
          })
          //send welcome message
          const registro = `Hola,
Gracias por contactor Whatsy Panama, serias tan amable de decirnos tu nombre para registrarte en nuestra base de datos de promociones? escribe tu nombre ry apellido separado por una coma. Ejemplo: Fulano, Arias.`
         //client.sendText(message.from, registro)           
        }
      }
    });

    // if (message.body === 'A') {
    //   for (let i = 0; i < contacts.length; i++) {
    //     const item = contacts[i].number + '@c.us';
    //     console.log(item);
    //     client.sendText(item,'hello');
    //   }

    // }
  });
}

//crear un nuevo contacto
app.post('/nuevoContacto', (req, res)=>{
  const nuevoContacto = req.body;
  const categoria = nuevoContacto.categorias; 
  const frecuencia = nuevoContacto.frecuencia;  
  const bienvenida = 
  `Hola ${nuevoContacto.nombre},
Que bueno que te animaste a ser parte de *Whatsy Panamá*. Te subcribiste a la(s) categoria(s) *${categoria}* y recibirás promociones *${frecuencia}*. Además te dejamos nuestra guia:
- Para añadir o modificar categorias, envía la palabra *ajustes*  
    \n- Para ver todas las promos, envía la palabra *promos*
    \n- Si tienes alguna duda o consulta, envía la palabra *ayuda*
    \n- Cuéntanos saber tus sugerencias, envía la palabra *opinar*
    \n- Para ver esta information de nuevo, envía un chat con la palabra *info*`
  console.log(nuevoContacto);    
  console.log(bienvenida);
  const crearContacto = new Contacto(nuevoContacto);
  crearContacto.save((err, clienteNuevo)=>{
    if(res.status == 400) {
      res.send({ mensaje: "error en el post", res: status, err });
    } else {
      res.send({ mensaje: "Contacto guardado con exito", res: clienteNuevo, err });

      const telefono = `507${clienteNuevo.telefono}@c.us`
       whatsaap.sendText(telefono,bienvenida);   
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
          console.log(datos); 
      }).then(()=>{
        if(tarea.estado == "enviado"){
          axios.get(`${apiDev}/contactos`).then( data => {     
            const contactos = data.data.datos;  
            console.log(contactos);
              
            for (let contacto of contactos ) {
              console.log(contacto.categorias);      
              const categoriaExiste = RegExp(tarea.categoria, 'i').test(contacto.categorias);
               if (categoriaExiste){
                console.log(contacto.nombre + ' incluye la caterogia '+ tarea.categoria ); 
                 const telefono = `507${contacto.telefono}@c.us`
                const mensaje = `Hola ${contacto.nombre},\n${tarea.mensaje}.\nAtt: Raynier 👋`;
                console.log(mensaje);
                console.log(telefono);
                //whatsaap.sendText(telefono,mensaje);                 
              } 
              
            }
          });      
        } 
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
       // sayHello();

module.exports = {app, port}
