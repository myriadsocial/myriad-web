#!/usr/bin/env bash

set -e

pushd .

# The following line ensure we run from the project root
PROJECT_ROOT=`git rev-parse --show-toplevel`
cd $PROJECT_ROOT

IMAGE_NAME=myriadsocial/myriad-web

# Build the image
echo "Building ${IMAGE_NAME}:latest docker image, hang on!"
time docker build -f ./.maintain/docker/Dockerfile -t ${IMAGE_NAME}:latest .

# Show the list of available images for this repo
echo "Image is ready"
docker images | grep ${IMAGE_NAME}

popd
