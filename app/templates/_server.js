var express = require('express'),
    app = express(),
    port = process.env.PORT || 7777,
    router = express.Router()

router.get('/', function(req, res) {
  res.json({content: 'Hello World!'})
})

app.use('/', router)
app.listen(port)
console.log('<%= package.name %> loading on port', port)

