import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
// import * as glue from 'aws-cdk-lib/aws-glue';
// import * as kinesisanalyticsv2 from 'aws-cdk-lib/aws-kinesisanalyticsv2';

export class KinesisStack extends cdk.Stack { 
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const destinationBucket = new s3.Bucket(this, 'DestinationBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const stream = new kinesis.Stream(this, 'KinesisStream', {
      retentionPeriod: cdk.Duration.days(1),
      streamMode: kinesis.StreamMode.ON_DEMAND,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const deliveryStream = new firehose.DeliveryStream(
      this,
      'KinesisFirehose',
      {
        destination: new firehose.S3Bucket(destinationBucket),
        source: new firehose.KinesisStreamSource(stream),
      }
    );

    destinationBucket.grantPut(deliveryStream);

    // Create a Kinesis Analytics application thorough AWS CDK is very hard.
    // So we are going to use the AWS Console to create the application.
    // Then upload the notebook to Zeppelin.
  }
}
