const express = require("express");
const cors = require("cors");
const scraper = require("./scraper");
const app = express();
const port = "8080";

app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());
app.use(cors());

app.get("/mostReaded", async(req, res) => {
    try {
        const mostReaded =  await scraper.getMostReadedMangas(scraper.getData);
        res.status(200).json(mostReaded);
    } catch(err) {
        console.log(err);
        res.status(201).json({message: err.message});
    }
});

app.get("/topReviewed", async(req, res) => {
    try {
        const topReviewed =  await scraper.getTopReviewed(scraper.getData);
        res.status(200).json(topReviewed);
    } catch(err) {
        console.log(err);
        res.status(201).json({message: err.message});
    }    
});

app.get("/allMangas", async(req, res) => {
    try {
        const allMangas = await scraper.getAllMangas(scraper.getData);
        res.status(200).json(allMangas);
    } catch(err) {
        console.log(err);
        res.status(201).json({message: err.message});
    }
});

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
