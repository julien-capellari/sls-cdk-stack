import * as apigtw2 from '@aws-cdk/aws-apigatewayv2';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as path from 'node:path';
import { PolicyStatement } from '@aws-cdk/aws-iam';

// Stacks
export class BackendStack extends cdk.Stack {
  // Constructor
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB
    const TodoTable = new dynamodb.Table(this, 'TodoTable', {
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
    });

    // Lambda
    const TodoApiHandler = new lambda.Function(this, 'TodoApiHandler', {
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../backend/dist')),
      handler: 'lambda.handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      environment: {
        TODO_TABLE: TodoTable.tableName
      },
      tracing: lambda.Tracing.ACTIVE
    });

    TodoApiHandler.addToRolePolicy(new PolicyStatement({
      resources: [TodoTable.tableArn],
      actions: [
        'dynamodb:GetItem',
        'dynamodb:Scan',
      ]
    }));

    // Api Gateway
    const TodoApi = new apigtw2.HttpApi(this, 'TodoApi', {
      createDefaultStage: true
    });

    TodoApi.addRoutes({
      path: '/{proxy+}',
      methods: [apigtw2.HttpMethod.ANY],
      integration: new HttpLambdaIntegration('TodoApiIntegration', TodoApiHandler),
    });
  }
}
