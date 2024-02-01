//웹 서비스 개발을 위한 백엔드 서버개발 공부

const express = require("express");
const { ObjectId } = require('mongodb')
const { SocketAddress } = require("net");
const app = express();
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended : true}));
const { MongoClient } = require("mongodb");
const methodOverride = require('method-override')
app.use(methodOverride('_method')) 

let db;
const url =
  "mongodb+srv://jyh6314:jy3042425!@cluster0.lpgkteh.mongodb.net/?retryWrites=true&w=majority";
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("forum");
    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

//8080은 port = 다른사람이 들어올 수 있는 창구

app.get("/", (요청, 응답) => {
  응답.sendFile(__dirname + "/index.html");
});

app.get("/about", (요청, 응답) => {
  응답.sendFile(__dirname + "/about.html");
});

app.get("/news", (요청, 응답) => {
    db.collection('post').insertOne({title : '나의 상품'})
  응답.send("오늘 비옴");
});

app.get("/shop", (요청, 응답) => {
  응답.send(result[1].content);
});


//서버 데이터를 html에 넣는 방법
app.get('/list', async(요청, 응답) => {
  let result = await db.collection('post').find().toArray()
  응답.render('list.ejs', {글목록 : result})
})

app.post('/list', async(요청, 응답) =>{

})

app.get('/write', async(요청, 응답) => {
 
  응답.render('write.ejs')
})

app.post('/newpost', async(요청,응답)=> {

  try{
    if(요청.body.title == '' && 요청.body.content == ''){
      응답.send('내용을 정확하게 입력해주세요')
    }else{
      await db.collection('post').insertOne({title : 요청.body.title, content : 요청.body.content})
      응답.redirect('/list')
  
    }
   

  }catch(err){
    응답.status(500).send('서버 에러')

  }



})

app.get('/detail/:id', async (요청, 응답) => {
  try{
    let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id) })
    응답.render('detail.ejs', { result : result })

  }catch(e){
    응답.send('ERROR')

  }

})

app.get('/edit/:id' , async(요청,응답)=>{
  let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id) })

  응답.render('edit.ejs', {result: result})
})

app.post('/newpost', async(요청,응답)=> {

  



})

app.post('/repost', async (요청, 응답) => {
  try{
    const postId = new ObjectId(요청.body.id);
    const originalPost = await db.collection('post').findOne({ _id: postId });

    if (!originalPost) {
      응답.send('Post not found.'); 
      return;
    }
    if(요청.body.title == '' && 요청.body.content == ''){
      응답.send('내용을 정확하게 입력해주세요')
    }else if(요청.body.id == ''){
      응답.send('id가 변경되었습니다.')

    }
    else{
      await db.collection('post').updateOne( { _id : new ObjectId(요청.body.id) }, {$set: {title : 요청.body.title, content : 요청.body.content }}) 
      응답.redirect('/list')
  
    }
   

  }catch(err){
    응답.status(500).send('서버 에러')

  }

})
//ajax의 장점은 새로고침이 필요없음

app.delete('/delete', async(요청,응답)=>{
  console.log(요청.query)
  await db.collection('post').deleteOne({ _id : new ObjectId(요청.query.docid)})
  응답.send('삭제완료')
})








// REST API 원칙
//1. Uniform Interface 

// - 여러 URL과 method는 일관성이 있어야합니다.

// - 하나의 URL로는 하나의 데이터를 가져오게 디자인하는게 좋고 

// - 간결하고 예측가능하게 URL과 method를 만드는게 좋습니다. 

 

// 2. Client-server 역할 구분 

// 유저에게 서버역할을 맡기거나 DB를 직접 입출력하게 시키면 안좋습니다. 

 

// 3. Stateless

// 셋째로 요청들은 서로 의존성이 있으면 안되고 각각 독립적으로 처리되어야합니다.

 

// 4. Cacheable

// 서버가 보내는 자료들은 캐싱이 가능해야합니다.

// 그러니까 자주 받는 자료들은 브라우저에서 하드에 저장해놓고 

// 서버에 요청을 날리는게 아니라 하드에서 뽑아쓰는걸 캐싱이라고 합니다. 

 

// 5. Layered System 

// 서버기능을 만들 때 레이어를 걸쳐서 코드가 실행되도록 만들어도 된다고 합니다. 

 

// 6. Code on demand

// 서버는 실행가능한 코드를 보낼 수 있습니다. 