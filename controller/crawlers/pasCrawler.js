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
  
    console.log(data);
  
    await browser.close();
    req.items = data
    next();
 //   return res.status(200).json(data)
}   catch(error){
    return res.status(500).json({message:"internal server Error"})
}
  }


  const updatePasOnDatabase = async (req, res) => {
    try {
        for (const item of req.items) {
            const contains = await PasUnb.findOne({ stage_pas: item.stage_pas, year_pas: item.year_pas });
            
            if (!contains) {
                await PasUnb.create(item);
            }
        }
        
        return res.status(200).json({ message: "Done successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
}






module.exports = {pasMainPage,updatePasOnDatabase}
