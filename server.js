const express = require("express");
const app = express();

app.use(express.json());

const adminRoutes = require("./src/routes/admin.routes");
app.use("/admin", adminRoutes);

app.listen(3000, () => console.log("Serveur démarré sur le port 3000"));
