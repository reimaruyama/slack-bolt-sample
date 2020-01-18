# What is this?
I tried to make an slack app using bolt.  
Add a reminder from Modal GUI

![sample.gif](https://user-images.githubusercontent.com/39688400/71776559-ffd6de80-2fd6-11ea-9fc3-476411e306d2.gif)

## Slack Configuration

- Set your Endpoint URL
  - `http(s)://YOUR_ENDPOINT:YOUR_APP_PORT/slack/events`
  
- To
	- Event Subscriptions >> Request URL
	- Interactive Components >> Request URL
	- Interactive Components >> Select Menus >> Options Load URL
	- slash command >> edit command >> Request URL

- Add Scopes
  - Bot Token Scopes
    - commands
    - channels:manage
    - reminders:write
    - reminders:read
  - User Token Scopes
    - reminders:read
    - reminders:write

## Appendix: Deploy sample to ECS(on Fargate) using CDK

push docker file to your ecr
```Dockerfile
FROM mhart/alpine-node:12

RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    git

RUN git clone --depth 1 https://github.com/reimaruyama/slack-bolt-sample.git

WORKDIR /slack-bolt-sample

RUN npm install

EXPOSE 3000
```
Set your tokens to Secret Manager
```json
{
  "SLACK_SIGNING_SECRET": "",
  "SLACK_BOT_TOKEN": "",
  "SLACK_USER_TOKEN": ""
}

```

cdk stack  
```typescript
// lib/aws-cdk-low-level-construct-library-sample-stack.ts

import cdk = require('@aws-cdk/core');
import ecr = require("@aws-cdk/aws-ecr");
import ecs = require('@aws-cdk/aws-ecs');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');
import Logs = require("@aws-cdk/aws-logs")
import secretsmanager = require('@aws-cdk/aws-secretsmanager');

export class BoltReminderDeployStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const logGroup = new Logs.LogGroup(this, 'bolt-sample-LogGroup', {
      logGroupName: 'bolt-sample-LogGroup',
    });

    const repository = ecr.Repository.fromRepositoryArn(
      this,
      "bolt-repo",
      process.env.REPOSITORY_ARN ?? ""
    );

    const cluster = new ecs.Cluster(this, 'BoltCluster', {
      clusterName: 'BoltCluster',
    });

    const fargateLogdriver = new ecs.AwsLogDriver({
      streamPrefix: "bolt-sample",
      logGroup: logGroup
    });

    const tokens = secretsmanager.Secret.fromSecretArn(this, 'BoltTokens', process.env.SECRETS_ARN ?? "");

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition');
    const container = taskDefinition.addContainer('BoltContainer', {
      image: ecs.ContainerImage.fromEcrRepository(repository),
      environment: {
        STAGE: 'prod',
        SLACK_SIGNING_SECRET: tokens.secretValueFromJson("SLACK_SIGNING_SECRET").toString(),
        SLACK_BOT_TOKEN: tokens.secretValueFromJson("SLACK_BOT_TOKEN").toString(),
        SLACK_USER_TOKEN: tokens.secretValueFromJson("SLACK_USER_TOKEN").toString(),
        PORT: "3000"
      },
      command: ["npm", "start"],
      logging: fargateLogdriver
    });
    container.addPortMappings({
      containerPort: 3000
    });

    const appLoadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'BoltService', {
      cluster: cluster,
      memoryLimitMiB: 1024,
      cpu: 512,
      desiredCount: 1,
      taskDefinition: taskDefinition
    });
  }
}

```
