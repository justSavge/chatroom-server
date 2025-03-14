fetch("http://localhost:6657/register", {
  method: "post",
  body: JSON.stringify({
    name: "tom",
    account: "123",
    password: "7970",
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
})
  .then((data) => data.json())
  .then((data) => console.log(data))
  .catch(console.error);
