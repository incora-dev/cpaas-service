import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; 

import { handler } from "./index"; 
import { APIGatewayProxyEvent, Context } from "aws-lambda";

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

app.post("/send", async (req, res) => {
  const event: APIGatewayProxyEvent = {
    body: JSON.stringify(req.body),
    headers: {},
    httpMethod: "POST",
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    path: "/send",
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {} as any,
    resource: "/send",
    stageVariables: null,
  };

  const context: Context = {} as Context;

  try {
    const result = await handler(event, context);
    res.status(result.statusCode).set(result.headers).send(result.body);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Local server running at http://localhost:${PORT}/send`);
});
