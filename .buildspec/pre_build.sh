#!/bin/bash
# If we need to pull from docker hub, we can hit a limit. So docker login is helpful.
 if [ "$CODEBUILD_WEBHOOK_EVENT" != "PULL_REQUEST_MERGED" ] ; then
    echo "loggging into docker for base images."
    docker login -u $DOCKER_LOGIN_USERNAME -p $DOCKER_LOGIN_PASSWORD
 fi
