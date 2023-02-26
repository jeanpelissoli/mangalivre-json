const puppeteer = require("puppeteer");

async function getData() {
    let mangas = [];
    let index = 0;
    const getTitles = document.querySelectorAll(".series-title h1");
    const getImgs = document.querySelectorAll(".cover-image");
    const getDescrip = document.querySelectorAll(".series-desc");
    const getAuthor = document.querySelectorAll(".series-author");
    getTitles.forEach((title) => {
        mangas.push({title: title.innerHTML});
        if(getDescrip[index]) {
            mangas[index].description = getDescrip[index].innerText;
        }
        if(getImgs[index]) {
            const regex = /\(([^)]+)\)/;
            const outerHtml = getImgs[index].outerHTML.match(regex)[1];
            mangas[index].img = outerHtml.replace(/["']+/g, "");    
        }
        if(getAuthor[index]) {
            const doesItMatch = "COMPLETO";
            if(!getAuthor[index].innerText.match(doesItMatch)) {
                mangas[index].author = getAuthor[index].innerText;       
            }
            mangas[index].author = getAuthor[index].innerText.replace(doesItMatch, "").trim();
        }
        index++;
    })
    return mangas; 
}

async function getMostReadedMangas(getDataFunc) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = "https://mangalivre.net/lista-de-mangas/ordenar-por-numero-de-leituras/todos/desde-o-comeco";
    await page.goto(url);
    
    const getData = Object.assign(getDataFunc);
    const mangas = await page.evaluate(getData);
    await browser.close();
    return mangas;
}

async function getTopReviewed(getDataFunc) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = "https://mangalivre.net/lista-de-mangas/ordenar-por-nota";
    await page.goto(url);
    const getData = Object.assign(getDataFunc);
    
    const mangas = await page.evaluate(getData);
    await browser.close();
    return mangas;
}

async function getAllMangas(getDataFunc) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = "https://mangalivre.net/lista-de-mangas/ordenar-por-nome/";
    
    const getData = Object.assign(getDataFunc);
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let transform = [];
    for(const l in alphabet) {
        transform.push(alphabet[l].toLowerCase());
    }
    let allMangas = [];
    let index = 0;
    
    while(index < 24) {
        await page.goto(url + transform[index]);
        const mangas = await page.evaluate(getData);
        allMangas.push(mangas);
        index++;
    }
    await browser.close();
    return allMangas;
}

module.exports = {
    getData: getData,
    getMostReadedMangas: getMostReadedMangas,
    getTopReviewed: getTopReviewed,
    getAllMangas: getAllMangas
}