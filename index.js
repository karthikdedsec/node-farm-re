const fs = require("fs");
const http = require("http");
const url = require("url");

////////////////////////////////////////////////////////////////////////////////
//blocking synchronous way
// const hello = "hello world";
// console.log(hello);

// //read the data
// const data = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(data);

// //write the data
// const textOut = `this is what we know about the avocado: ${data}`;

// fs.writeFileSync("./txt/output.txt", textOut);

//non blocking async
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) {
//     return console.log("error");
//   }
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("file written");
//       });
//     });
//   });
// });
// console.log("will read file");
//////////////////////////////////////////////////

//SERVER

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%ORGANIC%}/g, product.organic);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  //overview
  if (pathName === "/overview" || pathName === "/") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((card) => {
        return replaceTemplate(tempCard, card);
      })
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    //product
  } else if (pathName === "/product") {
    res.end("this is the product");

    //api
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    //not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>page not found</h1>");
  }
});

server.listen(4000, "127.0.0.1", () => {
  console.log("listening on port 4000");
});
