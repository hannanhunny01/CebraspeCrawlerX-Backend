
const VestUnb = require('../../models/vestibular')
const User = require('../../models/userModel')
const puppeteer = require('puppeteer');

// errorStatus and SystemStatus
const {errorStatus} = require('../../ErrorStatus/errorStatus')
const {updateStatus} = require('../messageAndStatus/updateStatus');
const { trusted } = require('mongoose');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const vestMainPage = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new', // Opt in for the new Headless mode
  });

    try{
    const page = await browser.newPage();
    
    await page.goto('https://www.cebraspe.org.br/vestibulares/'); 
    await delay(3000);

    const data = await page.evaluate(() => {
      const divContainers = document.querySelectorAll('div.itens-container'); // Selector for div containers
      const items = [];
  
      divContainers.forEach((divContainer) => {
        const liElements = divContainer.querySelectorAll('li.q_circle_outer'); // Selector for li elements
  
        liElements.forEach((liElement) => {
          const name = liElement.querySelector('h3.q_circle_title').textContent;
          const link_to_site = "https://www.cebraspe.org.br"+ liElement.querySelector('a.icon_with_title_link').getAttribute('href');
  
          items.push({
            name,
            link_to_site,
          });
        });
      });
      return items;
    });
  
    
  //  console.log(data)
    await browser.close();
    updateStatus(true,"vestMainPage",new Date())

    if( await updateVesOnDatabase(data)){
      return true
    }else{
      return false
    }
   
}   catch(error){
  console.log(error)
  updateStatus(false,"Success for main page VEstibular",new Date())
  errorStatus("vestMainPage",error)
  return false
}
finally{
  if(browser){
    await browser.close()
  }
}
  }


const updateVesOnDatabase = async (items) => {
    try {
        for (const item of items) {
            const contains = await VestUnb.findOne({ name: item.name, link_to_site: item.link_to_site });
            
            if (!contains) {
                await VestUnb.create(item);
            }
        }
        return true
       // return res.status(200).json({ message: "Done successfully" });
    } catch (error) {
      return false;
        return res.status(500).json({ message: "An error occurred" });
    }
}




const addVestdata = async (link,items) =>{


    try{ 
      console.log(link)
      const vestObject = await  VestUnb.findOne({link_to_site:link})
      if(vestObject && items.length > vestObject.items_on_site_number){
        vestObject.items_on_site = items
         await vestObject.save()
      }
      
         
      
  
  
      
    
    }catch(error){
      console.log(error)
    }
  }
  
  
  const vestPagesCrawler = async (req, res) => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new', // Opt in for the new Headless mode
    });

    try {
      const vestLinks = await VestUnb.find({});
      const page = await browser.newPage();
  
      const extractedData = []; // Array to store the extracted data
  
      for (const item of vestLinks) {
        let currLink = item.link_to_site
        await page.goto(item.link_to_site);
        await delay(3000);
  
        const data = await page.evaluate(() => {
            const ulElements = document.querySelectorAll('ul.page-concursos__cargos-list');
            const items = [];
          
            ulElements.forEach(ulElement => {
              const liElements = ulElement.querySelectorAll('li'); // Query within ulElement
              liElements.forEach(liElement => {
                const dateElement = liElement.querySelector('div > h2');
                const nameElement = liElement.querySelector('div > p');
          
                if (!dateElement || !nameElement) {
                      //Skip case no found of elements
                   return;
                }
          
                const date = dateElement.textContent;
                const htmlref = nameElement.innerHTML;
          
                const startIndex = htmlref.indexOf('href="') + 'href="'.length;
                const endIndex = htmlref.indexOf('"', startIndex);
                const link = htmlref.substring(startIndex, endIndex);
          
                const name = nameElement.textContent;
          
                let crawledobject = { date, name, link };
                if (crawledobject.date != "NENHUM LINK CADASTRADO"){
                  items.push(crawledobject);
                }
              });
            });
          
            return items;
          });
        addVestdata(currLink,data);
       
        extractedData.push(...data);
      }
    //  res.json(extractedData)
  
      await browser.close();
      updateStatus(true,"vest pages crawling Success",new Date())

      return true;
    } catch (error) {
      updateStatus(false,"vest pages on Error",new Date())
      errorStatus("vestPagesCrawler",error)
      return false;
    }
  };
  
  
  
  
  
  

module.exports = {vestMainPage,updateVesOnDatabase,vestPagesCrawler}