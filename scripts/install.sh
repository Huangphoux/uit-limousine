#! /bin/bash

# Install concurrently
npm install

# Install dependencies for server
cd client || exit
npm install --verbose

# Install dependencies for client
cd ..
cd server || exit
npm install --verbose