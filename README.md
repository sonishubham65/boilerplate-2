# Start application

- baseuri: <https://localhost:3000/v1>

- Start server on Prod
`npm run start`

- Start server on local
`npm run start:dev`

# Migration - Generate and apply sequelize migration

- Debug server
`npm run start:debug`

- Run following command to generate blank migration file
`npm run migration:generate --name create-users-table`

- Run following command to run and push all the migration
`npm run migration:run`

- Run following command to undo the migration
`npm run migration:undo`

# Authentication

- Open this url and you will be redirected to facebook and once login, you will be back on localhost:3000 and getting access token
<http://localhost:3000/v1/auth/facebook/>

# Test cases

- Run following command to run Unit test cases for specific file (Controller)
`npm run test -f post.controller.spec.ts`

- Run following command to run Unit test cases for specific file (Service)
`npm run test -f post.service.spec.ts`

- Run following command to run E2E test case
`npm run test:e2e -f product.e2e-spec.ts`

- Error handling
`{{baseuri}}/error/1`
`{{baseuri}}/error/2`
`{{baseuri}}/error/3`

# DTO

- post.controller.ts, create function, /v1/post -> create api

# Fake data generate

- on Main.ts, written function code, simply call the function fakeData
