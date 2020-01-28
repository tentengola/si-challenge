# si-challenge

## Working Endpoints

POST - https://oqy83h9467.execute-api.us-east-1.amazonaws.com/dev/login
  
PUT - https://oqy83h9467.execute-api.us-east-1.amazonaws.com/dev/interactions

POST - https://oqy83h9467.execute-api.us-east-1.amazonaws.com/dev/interactions
  
## Run Tests

To run tests...

```
npm install
npm run test
```

## Deploy in AWS

The easiest way to deploy is to use the Serverless Framework. If you don't already have serverless installed globally in your environment, install it with...

```
npm install -g serverless
```

You will also need to have your AWS credentials available for Serverless to use, but once you have those set up, run...

```
npm run deploy
```

This will upload the code in a zip and create all AWS resources. It also generate a directory that will contain your cloudformation templates called .serverless

## Docs

https://s3.amazonaws.com/s3.tantangula.com/index.html
