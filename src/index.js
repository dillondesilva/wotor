import express from 'express';

const app = express();
app.use(express.static('./game'));

app.listen(9000, function () {
  console.log('Server is running...');
});
