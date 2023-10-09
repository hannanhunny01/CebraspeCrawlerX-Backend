const SystemStatus = require('../../models/systemStatus');
const   cache = require('memory-cache');
const updateStatus = async (status,action,date) => {

        try{
                 
                const newStatus = new SystemStatus({status,action,date});
                await newStatus.save();
                return true;


        }catch(error){console.log(error)}

function cacheMiddleware(req, res, next) {
            const key = 'systemStatus';
            const cachedData = cache.get(key);
          
            if (cachedData) {
              res.status(200).json(cachedData);
            } else {
              next();
            }
          }
}

const getSystemStatus = async () => {
    try {
        try{
        const objects = await SystemStatus.find().sort({ _id: -1 }).limit(50);
        const key = 'systemStatus';
        cache.put(key, objects, 10800000); 

        res.status(200).json(objects);
        return res.status(200).json(objects);}
        catch(error){
          return res.status(500).json({message:"Error retrieving data"})        }
    } catch (error) {
        console.log(error);
    }
};

