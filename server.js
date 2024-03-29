const express = require('express');
const hbs = require('hbs');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

//firebase
var admin = require("firebase-admin");
var serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://askaboutblockchain.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("questions");


const {generateMessage} = require('./public/js/message');
const qna = require('./qna');

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(path.join(__dirname + '/public')));

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


app.get('/', (req, res) => {

          res.render('index.hbs');
  });
  io.on('connection', (socket) => {
    
    
  
    socket.on('createMessage', (message, callback) => {
      let question =  {"question":message.text,
      'top': 3};
      let content = JSON.stringify(question);
      console.log(message.text);
      qna.get_answers(qna.method, content, function (result) {
        // Write out the response from the /knowledgebases/create method.
            let obj = JSON.parse(result)
            let replyMessage = "";
            if (obj.answers[0].answer == 'No good match found in KB.'){
              replyMessage = "I'm   sorry, I am not trained to answer that yet.";
              socket.emit('newMessage', generateMessage('Bot', replyMessage));
              
            }
            else{
              replyMessage = obj.answers[0].answer;
              socket.emit('newMessage', generateMessage('Bot', obj.answers[0].answer));
            }
            

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            
            if(dd<10) {
                dd = '0'+dd
            } 
            
            if(mm<10) {
                mm = '0'+mm
            } 

            today = mm + '/' + dd + '/' + yyyy;
           
      var newPostRef = ref.push();
      newPostRef.set({
        question: message.text,
        answer: obj.answers[0].answer,
        date: today
      });
        });

      callback();
    });
  
    
  
   
  });



server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
})


