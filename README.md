# si-challenge

## Run Tests

To run tests...

```
npm install
npm run test
```

## Run in Development Mode

To run in development mode you will have to install SAM local. Installation instructions for various platforms can be found here...https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html

Once you have AWS SAM CLI installed you can run...

```
npm install
npm run start-dev
```

## Deploy in AWS

The easiest way to deploy is to use the Serverless Framework. If you don't already have serverless installed globally in your environment, install it with...

```
npm install -g serverless
```

You will also need to have your AWS credentials available for Serverless to use, but once you have those set up, run...

```
sls deploy
```

This will upload the code in a zip and create all AWS resources. It also generate a directory that will contain your cloudformation templates called .serverless
