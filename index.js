const {app, port} = require("./server/index");
require("./database");


//start the server

app.listen(port, () => {
    console.log(`server running on port:${port}`);
})


    