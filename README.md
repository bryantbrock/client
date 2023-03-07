# Streamline Scientific Client Portal
Purpose of this code base is to serve as the code for the Streamline Scientific Client Portal.

## Installation
`npm install`
`cp .env.example .env` - configure with auth0 account credentails and database connection string

## Updating database schemas that are not reflected in source control
Run `npx prisma db pull` to update local models to match live db.
Run `npx prisma db push` to implement db tables as specified in `prisma/prisma.schema`

## Recreate orm client after changes
Then regenerate prisma client `npx prisma generate`.

## Run
`npm run dev`

## Build
Building of the images is automatically handled via AWS Codebuild using the following params.
+ `buildspec.yaml` - Build pipeline file.
+ `.buildspec/` - directory of run scripts for the build.
+ `Dockerfile` - image configuration for the build.