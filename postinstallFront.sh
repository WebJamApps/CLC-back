#!/usr/bin/env bash

set -e

BRANCH=master

if [[ $BUILD_BRANCH != "master" ]];
then
    BRANCH=develop
fi

if [ ! -d CollegeLutheran ]; then
    (git clone https://github.com/WebJamApps/CollegeLutheran)
fi

(
cd CollegeLutheran || exit;
git stash;
git checkout $BRANCH;
git pull;
cd ..;
)

if [ -f .env ];
then
  (cp .env CollegeLutheran/;
  )
fi

(
cd CollegeLutheran;
npm install;
)
