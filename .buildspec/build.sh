#!/bin/bash
# Build the image if we are updating a pr.
if [ "$CODEBUILD_WEBHOOK_EVENT" != "PULL_REQUEST_MERGED" ] ; then
      echo Build started on `date`
      echo Building the Docker image... 
      docker build -t $REPO_NAME:$BUILD_VERSION .
fi

# Login to ECR
echo Logging in to Amazon ECR...
aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com

# Tag either with extra extension or without.
if [ "$CODEBUILD_WEBHOOK_EVENT" == "PULL_REQUEST_MERGED" ] ; then  
      docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$REPO_NAME:$BUILD_VERSION-$BUILD_EXTENSION
      docker tag $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$REPO_NAME:$BUILD_VERSION-$BUILD_EXTENSION $REPO_NAME:$BUILD_VERSION
      docker tag $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$REPO_NAME:$BUILD_VERSION-$BUILD_EXTENSION $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$REPO_NAME:$BUILD_VERSION
else
      docker tag $REPO_NAME:$BUILD_VERSION $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$REPO_NAME:$BUILD_VERSION     
fi

# Tag latest
if [ $TAG_LATEST ] ; then
      docker tag $REPO_NAME:$BUILD_VERSION $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$REPO_NAME:latest  
fi