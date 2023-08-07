const express = require('express')
const mongoose = require("mongoose")
const cors = require('cors')
const path = require('path')
const app = express()

PORT = 3000

app.listen(PORT,()=>{
    console.log('listening')
    return "hello worlld"
})