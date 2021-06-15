#!/usr/bin/env bash
set -e

pushd .

# The following line ensure we run from the project root
PROJECT_ROOT=`git rev-parse --show-toplevel`
cd $PROJECT_ROOT

IMAGE_NAME=myriadsocial/myriad-web
VCS_REF=`git rev-parse --short HEAD`
VERSION=`awk -F \" '/"version": ".+"/ { print $4; exit; }' package.json`
BUILD_DATE=`date -u +"%Y%m%d"`

# Build the image
echo "Building ${IMAGE_NAME}:latest docker image, hang on!"
time docker build -f ./.maintain/docker/Dockerfile --build-arg VCS_REF=${VCS_REF} --build-arg BUILD_DATE=${BUILD_DATE} -t ${IMAGE_NAME}:latest .
# Build verison
time docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${VERSION}

# Show the list of available images for this repo
echo "Image is ready"
docker images | grep ${IMAGE_NAME}

popd
