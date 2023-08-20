const PasUnb = require('../../models/pasunb')
const User = require('../../models/userModel')
const puppeteer = require('puppeteer');

const pasMainPage = async (req,res,next) => {

    try{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto('https://www.cebraspe.org.br/pas/subprogramas/'); // Replace with the URL of the webpage you want to scrape
  
    const data = await page.evaluate(() => {
      const divContainers = document.querySelectorAll('div.itens-container'); // Selector for div containers
      const items = [];
  
      divContainers.forEach((divContainer) => {
        const liElements = divContainer.querySelectorAll('li.q_circle_outer'); // Selector for li elements
  
        liElements.forEach((liElement) => {
          const stage_pas = liElement.querySelector('h3.q_circle_title').textContent;
          const year_pas = liElement.querySelector('h4.q_circle_title').textContent;
          const link_to_site = "https://www.cebraspe.org.br"+ liElement.querySelector('a.icon_with_title_link').getAttribute('href');
  
          items.push({
            stage_pas,
            year_pas,
            link_to_site,
          });
        });
      });
  
      return items;
    });
  
    
  
    await browser.close();
    req.items = data
    next();
 //   return res.status(200).json(data)
}   catch(error){
    return res.status(500).json({message:"internal server Error"})
}
  }


  const updatePasOnDatabase = async (req, res, next) => {
    try {
        for (const item of req.items) {
            const contains = await PasUnb.findOne({ stage_pas: item.stage_pas, year_pas: item.year_pas });
            
            if (!contains) {
                await PasUnb.create(item);
            }
        }

        req.crawler_type_message = "crawling sucessful on PasUNb"
        next()
      //  return res.status(200).json({ message: "Done successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
}

const addPasdata = async (link,items) =>{


  try{ 
    console.log(link)
    const pasObject = await  PasUnb.findOne({link_to_site:link})
    if(pasObject && items.length > pasObject.items_on_site_number){
      pasObject.items_on_site = items
       await pasObject.save()
    }
    
       
    


    
  
  }catch(error){
    console.log(error)
  }
}


const pasPagesCrawler = async (req, res) => {
  try {
    const pasLinks = await PasUnb.find({});
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const extractedData = []; // Array to store the extracted data

    for (const item of pasLinks) {
      let currLink = item.link_to_site
      await page.goto(item.link_to_site);
      await delay(3000);

      const data = await page.evaluate(() => {
        const ulElements = document.querySelectorAll('ul.page-concursos__cargos-list');
        const items = [];

        ulElements.forEach(ulElement => {
          const liElements = ulElement.querySelectorAll('li'); // Query within ulElement
          
          liElements.forEach(liElement => {
            const date = liElement.querySelector('div > h2').textContent;
            const htmlref = liElement.querySelector('div > p').innerHTML

            const startIndex = htmlref.indexOf('href="') + 'href="'.length;
            const endIndex = htmlref.indexOf('"', startIndex);
            const link = htmlref.substring(startIndex, endIndex);


            const name = liElement.querySelector('div > p ').textContent;

            let crawledobject = { date, name, link }
            if (crawledobject.date != "NENHUM LINK CADASTRADO"){
                  items.push(crawledobject)
            } 

        
          });
        });

       return items
      });
      addPasdata(currLink,data);
     
      extractedData.push(...data);
    }
    res.json(extractedData)

    await browser.close();
  } catch (error) {
    console.log(error);
  }
};















module.exports = {pasMainPage,updatePasOnDatabase,pasPagesCrawler}
