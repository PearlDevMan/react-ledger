<p align="center">
    <a href="https://www.vespaiach.com/">
        <img src="https://raw.githubusercontent.com/vespaiach/ledger/main/ledger.svg" height="56" width="56" data-canonical-src="https://www.vespaiach.com/ledger.svg" title="Ledger"/>
    </a>
</p>

<p align="center">
  <b>Ledger</b> is a small web application managing personal money balance
  <br>
  It is built with React/Redux and awesome GUI framework: <a href="https://github.com/mui-org/material-ui" title="Material UI">Material UI</a>
</p>

<br>

# Motivation

I'm trying to bring my money balance excel file to web application

# Live Playground

The demo version at: https://www.vespaiach.com/ . Use the account below to login:

-   email: test@test.com
-   password: 12345678

# Development

Development environment requirements :

-   Node.js >= 12.0.0
-   PostgreSQL
-   TypeScript
-   Docker
-   Docker compose

I am using Lerna to make sure both backend project and frontend project work well to gether in a mono repo.

Backend is using Adonisjs framework version 5. Frontend is React application combined with Redux, Redux Saga and Material UI framework

## Download and bootstrap project:

Download project:

```
git clone https://github.com/vespaiach/ledger
```

Install Lerna:

```
cd ./ledger
npm install
```

Bootstrap all packages:

```
npm run lerna bootstrap

```

## Start PostgresQL and migrate database

Run PostgresQL:

```
cd ./ledger
docker-compose up -d
```

Run database migration and seeds:

```
cd ./package/server
node ace migration:run
node ace db:seed
```

_Note_: Before running database migration, please create a .env file and config all necessary environment variables (refer to .env.example for more details).

## Start development:

```
cd ./package/server
npm run dev
```

# Deployment

Normally, backend code should be deployed in one host and frontend code in another code. However, this web application is leveraging Adonisjs framework and making the frontend application become a view of Adonisjs. Hence, we can deploy it in one host.

-   Build docker image (Dockerfile in root folder)
-   Deploy docker image
