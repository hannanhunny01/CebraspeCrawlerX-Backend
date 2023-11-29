
const Concurso = require('../../models/concurso')
const User = require('../../models/userModel')
const puppeteer = require('puppeteer');


const {errorStatus} = require('../../ErrorStatus/errorStatus')
const {updateStatus} = require('../messageAndStatus/updateStatus')


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const conMainPage = async () => {
  const browser = await puppeteer.launch({headless:false});

    try{
    const page = await browser.newPage();
    
    await page.goto('https://www.cebraspe.org.br/concursos/'); 
    await delay(5000);

    const data = await page.evaluate(() => {
      const divContainers = document.querySelectorAll('div.itens-container'); // Selector for div containers
      const items = [];
  
      divContainers.forEach((divContainer) => {
        const liElements = divContainer.querySelectorAll('li.q_circle_outer'); // Selector for li elements
  
        liElements.forEach((liElement) => {
          const name = liElement.querySelector('h3.q_circle_title').textContent;
          const ptag = liElement.querySelectorAll('p.q_circle_text > span');
          const vagas = ptag[0].textContent
          const remuneracao = ptag[1].textContent
          const link_to_site = "https://www.cebraspe.org.br"+ liElement.querySelector('a.icon_with_title_link').getAttribute('href');
  
          items.push({
            name,
            vagas,
            remuneracao,
            link_to_site,
          });
        });
      });
      return items;
    });
  
    
   
    await browser.close();
    updateConOnDatabase(data)
  //   req.items = data
    updateStatus(true,"conMainPage",new Date())
    console.log("concurso Sucess")
    return true;

    next();
 //   return res.status(200).json(data)
}   catch(error){
    updateStatus(false,"Sucess for mainPage Concurso",new Date())
    errorStatus("conMainPage",error)
    return false
  }
  finally{
    if(browser){
      await browser.close()
    }
  }


  }


const updateConOnDatabase = async (items) => {
    try {
        for (const item of items) {
            const contains = await Concurso.findOne({ name: item.name, link_to_site: item.link_to_site });
            
            if (!contains) {
                await Concurso.create(item);
            }
        }

        return true
        
        return res.status(200).json({ message: "Done successfully" });
    } catch (error) {
        return false
        return res.status(500).json({ message: "An error occurred" });
    }
}


const addConData = async (link,items) =>{


    try{ 
      console.log(link)
      const conObject = await  Concurso.findOne({link_to_site:link})
      if(conObject && items.length > conObject.items_on_site_number){
        conObject.items_on_site = items
         await conObject.save()
      }
      
         
      
  
  
      
    
    }catch(error){
      console.log(error)
    }
  }
  
  
  const conPagesCrawler = async (req, res) => {
    const browser = await puppeteer.launch({ headless: false });

    try {
      const conLinks = await Concurso.find({});
      const page = await browser.newPage();
  
      const extractedData = []; // Array to store the extracted data
  
      for (const item of conLinks) {
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
          addConData(currLink,data);
       
        extractedData.push(...data);
      }
     // res.json(extractedData)
  
      await browser.close();
      updateStatus(true,"Success crawling Concurso each page",new Date())

      return true;
    } catch (error) {
      updateStatus(false,"error on crawling Concurso each page",new Date())
      errorStatus("conPagesCrawler",error)
      return false;
    }
    finally{
      if(browser){
        await browser.close()
      }
    }
  };
  





module.exports={conMainPage,updateConOnDatabase,conPagesCrawler}