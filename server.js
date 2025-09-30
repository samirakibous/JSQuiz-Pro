const express = require("express");
const app = express();

app.use(express.json());

const adminRoutes = require("./src/routes/admin.routes");
app.use("/admin", adminRoutes);

app.listen(3000, () => console.log("Serveur démarré sur le port 3000"));


// const app = require('./src/app');

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`SERVER RUNNING ON PORT ${PORT}`)
// })