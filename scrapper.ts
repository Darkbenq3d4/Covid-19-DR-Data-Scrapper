const puppeteer = require('puppeteer');
const firebase = require('firebase/app');
const { database } = require('firebase/app');
require('firebase/database');
require('firebase/auth');
import { firebaseConfig, user_email, user_password } from "./env";
firebase.initializeApp(firebaseConfig);
var DB = firebase.database();
var Auth = firebase.auth();
async function scrapeShit(url:string){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
           

    const provincias = await page.evaluate(() => {
      const rows = document.querySelectorAll('g#Republica-Dominicana g path');
        return Array.from(rows, row => 
          ({
            nombre: row.getAttribute('data-original-title'),
            casos: row.getAttribute('data-content')!.split('<br>')[0].replace('Confirmados:',''),
            recuperados:row.getAttribute('data-content')!.split('<br>')[1].replace('Recuperados:',''),
            muertos:row.getAttribute('data-content')!.split('<br>')[2].replace('Fallecidas:','') 
          }));
    })

      
    await browser.close();
     return provincias;
    
}
var Data = scrapeShit('https://coronavirusrd.gob.do/');
Data.then(function(result){
  Auth.signInWithEmailAndPassword(user_email, user_password).then((user: any)=>{
    var i = 0;
    result.forEach((dato: { nombre: string; casos: any; recuperados: any; muertos: any; }) => {
        DB.ref('DatosCovid19/' + i).set({
       provincia : dato.nombre,
       casos: dato.casos,
       recuperados: dato.recuperados,
       muertos: dato.muertos
       }, () => {
        console.log("Listo con "+dato.nombre);
      });
       i++;

    });
  });
 
});
  

