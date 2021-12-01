import fastify from 'fastify';

const app = fastify();

app.get("/ping", (_, res) => {
  res.send("pong")
})

app.listen(process.env.PORT || 5000, (err, address) => {
  console.log(err, address)
})