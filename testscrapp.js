const puppeteer = require('puppeteer');
const firebase = require('firebase/app');
require('firebase/database');
const firebaseConfig = {
  apiKey: "AIzaSyDP-Yrac_ALqTq49siuRa_Uco4CGJLQ1OI",
  authDomain: "eagle-bot-cebypg.firebaseapp.com",
  databaseURL: "https://eagle-bot-cebypg.firebaseio.com",
  projectId: "eagle-bot-cebypg",
  storageBucket: "eagle-bot-cebypg.appspot.com",
  messagingSenderId: "1087218450759",
  appId: "1:1087218450759:web:beaee678d48b249d43cc62",
  measurementId: "G-JS2G0GJ9XP"
}
firebase.initializeApp(firebaseConfig);
var DB = firebase.database();
async function scrapeShit(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
      

    const provincias = await page.evaluate(() => {
      const rows = document.querySelectorAll('g#Republica-Dominicana g path');
        return Array.from(rows, row => 
          ({nombre: row.getAttribute('data-original-title'), casos:row.getAttribute('data-content').split('<br>')[0].replace('Confirmados:',''), recuperados:row.getAttribute('data-content').split('<br>')[1].replace('Recuperados:',''), muertos:row.getAttribute('data-content').split('<br>')[2].replace('Fallecidas:','') }));
    })

      
    await browser.close();
     return provincias;
    
}
var Data = scrapeShit('https://coronavirusrd.gob.do/');
Data.then(result => {
    console.log(result)
});
