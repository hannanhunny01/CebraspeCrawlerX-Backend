const express = require('express')

const app = express()

PORT = 3000

app.listen(PORT,()=>{
    console.log('listening')
    return "hello worlld"
})