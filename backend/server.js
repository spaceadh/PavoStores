import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors'
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoute.js";
import uploadRouter from "./routes/uploadRouter.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

/*
app.get("/api/keys/google", (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || "" });
});*/

app.use("/api/upload", uploadRouter);
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});
/*
app.get('/access_token', (req, res) => {
  res.status(200).json({ access_token: req.access_token });
});

// Access token function

app.get('/register_mpesa',access,(req,res)=>{
  let url = "";
  let auth = 'Bearer'+ req.access_token;

  request(
    {
    url: url,
    method:"POST",
    headers: {
      "Authorization": "Basic " + auth
    },
    json:{

    }
  },
  function(error,response,body){
    if (error) {
      console.log(error);
    } else {
      req.access_token = JSON.parse(body).access_token;
    }
  )
}
)










function access(req, res, next) {
  let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate";
  let auth = Buffer.from(process.env.CONSUMER_KEY + ':' + process.env.CONSUMER_SECRET).toString('base64');

  request({
    url: url,
    headers: {
      "Authorization": "Basic " + auth
    }
  },
  (error, response, body) => {
    if (error) {
      console.log(error);
    } else {
      req.access_token = JSON.parse(body).access_token;
      next();
    }
  });
}
*/
app.post('/api/stkpush', (req, res) => {
  



  async function getAccessToken() {
    const consumer_key = "eotKUjbnnWWuGRiKT12B4pBZGRAw0L7sAEUHftYPc9jTzvDk";
    const consumer_secret = "ryY4EnHaR63GB2EnWaWNAHT1QacE8Qrj0IAfTUDypo4GKddYYpbjZG1VDRirPtn5";
    const url =
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const auth =
      "Basic " +
      new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: auth,
        },
      });
     
      const dataresponse = response.data;
      // console.log(data);
      const accessToken = dataresponse.access_token;
      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  app.get("/", (req, res) => {
    res.send("MPESA DARAJA API WITH NODE JS BY UMESKIA SOFTWARES");
    var timeStamp = moment().format("YYYYMMDDHHmmss");
    console.log(timeStamp);
  });
  
  
  //ACCESS TOKEN ROUTE
  app.get("/access_token", (req, res) => {
    getAccessToken()
      .then((accessToken) => {
        res.send("😀 Your access token is " + accessToken);
      })
      .catch(console.log);
  });
  
  //MPESA STK PUSH ROUTE
  app.get("/stkpush", (req, res) => {
    getAccessToken()
      .then((accessToken) => {
        const url =
          "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        const auth = "Bearer " + accessToken;
        const timestamp = moment().format("YYYYMMDDHHmmss");
        const password = new Buffer.from(
          "174379" +
            "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
            timestamp
        ).toString("base64");
  
        axios
          .post(
            url,
            {
              
              Password: password,
              Timestamp: timestamp,
              TransactionType: "CustomerPayBillOnline",
              Amount: "10",
              PartyA: "", //phone number to receive the stk push
              PartyB: "",
              PhoneNumber: "",
              CallBackURL: "https://dd3d-105-160-22-207.ngrok-free.app/callback",
              AccountReference: "UMESKIA PAY",
              TransactionDesc: "Mpesa Daraja API stk push test",
            },
            {
              headers: {
                Authorization: auth,
              },
            }
          )
          .then((response) => {
            res.send("😀 Request is successful done ✔✔. Please enter mpesa pin to complete the transaction");
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send("❌ Request failed");
          });
      })
      .catch(console.log);
  });
  
  //STK PUSH CALLBACK ROUTE
  app.post("/callback", (req, res) => {
    console.log("STK PUSH CALLBACK");
    const CheckoutRequestID = req.body.Body.stkCallback.CheckoutRequestID;
    const ResultCode = req.body.Body.stkCallback.ResultCode;
    var json = JSON.stringify(req.body);
    fs.writeFile("stkcallback.json", json, "utf8", function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("STK PUSH CALLBACK JSON FILE SAVED");
    });
    console.log(req.body);
  });
  
  // Echo the data received from the client
 /* console.log("Phone Number:", phone);
  console.log("Account Number:", accountNumber);
  console.log("Amount:", amount);*/
  async function getAccessToken() {
  }
  res.status(200).json({ message: "STK Push request received successfully" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});









