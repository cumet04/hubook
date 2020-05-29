#!/bin/sh

cd $(dirname $0)/.. # cd to root dir

curl -L https://developer.github.com/v4/public_schema/schema.public.graphql -o bin/schema.public.graphql
npx graphql-codegen --config bin/codegen.yml
