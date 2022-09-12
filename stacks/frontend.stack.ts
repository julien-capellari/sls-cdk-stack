import * as cf from '@aws-cdk/aws-cloudfront';
import * as cfo from '@aws-cdk/aws-cloudfront-origins';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

// Stacks
export class FrontendStack extends cdk.Stack {
  // Attributes
  readonly TodoFrontend: cf.Distribution;

  // Constructor
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Bucket
    const bucket = new s3.Bucket(this, 'todos-react-cdk-stack', {
      accessControl: s3.BucketAccessControl.PRIVATE,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
    });

    // Distribution
    const S3Origin = new cfo.S3Origin(bucket);

    this.TodoFrontend = new cf.Distribution(this, 'TodoFrontend', {
      enabled: true,
      enableIpv6: true,
      priceClass: cf.PriceClass.PRICE_CLASS_100,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: S3Origin,
        allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cf.CachedMethods.CACHE_GET_HEAD,
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cf.CachePolicy.CACHING_OPTIMIZED
      },
      additionalBehaviors: {
        '/index.html': {
          origin: S3Origin,
          allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cf.CachedMethods.CACHE_GET_HEAD,
          viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cf.CachePolicy.CACHING_DISABLED
        }
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    });
  }
}
