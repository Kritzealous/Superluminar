import { Stack, StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class LambdaNodeCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, "MyTable", {
      partitionKey: { name: "id", type: AttributeType.STRING },
    });

    const lambdaFuntion=new NodejsFunction(this, "MyFunc", {
      runtime: Runtime.NODEJS_16_X,
      handler: "handler",
      entry: "lib/lambda-node.ts",
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Add DynamoDB permissions to the Lambda function
const policy = new PolicyStatement({
  actions: ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem"],
  //actions: ["dynamodb:GetItem"],

  resources: [table.tableArn],
});
//lambdaFuntion.addToRolePolicy(policy);
  }
}
