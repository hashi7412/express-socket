import express from "express";
import config from './config.json'
const app = express();

app.get("", (req:any, res:any) => {
    res.send("Hello World");
});

app.listen(config.PORT, () => {
    console.log(`Server running on PORT ${config.PORT}`);
});
