# Welcome to kurs-pm-data-api 👋

![Version](https://img.shields.io/badge/version-0.8.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-18-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## Introduction

The course information project (KIP) is an initiative at KTH that was launched in 2018 to improve the quality and availability of information about KTH:s courses. The background to the project is, among other things, that it was difficult for the student to find information about the courses and even more difficult to compare information about several courses. The reason for the problems is scattered course information in several places and that there is no uniformity or assigned places for the course information. The project takes measures to consolidate course information into two locations and to present the information in a manner that is uniform for KTH. The student should find the right information about the course, depending on their needs. The result of the project is a public course site where the correct course information is collected and presented uniformly. Also, a tool is developed for teachers to enter and publish course information. Eventually, this will lead to the student making better decisions based on their needs, and it will also reduce the burden on teachers and administration regarding questions and support for the student.

Kurs-pm-api is a microservice to save course memos data to database. It accepts data from admin pages ([kurs-pm-data-admin-web](https://github.com/KTH/kurs-pm-data-admin-web)) and serves this data to the public view of course memos ([kurs-pm-web](https://github.com/KTH/kurs-pm-web)). It uses [Node.js](https://nodejs.org/), [Mongoose](https://mongoosejs.com/), `kth-node-cosmos-db`, and is based on [node-api](https://github.com/KTH/node-api).

### 🏠 [Homepage](https://github.com/KTH/kurs-pm-data-api)

## Overview

Kurs-pm-api is used to save data in a Azure Cosmos database by using `kth-node-cosmos-db` to establish a connection to Azure. Before using it, the database and collection must be prepared in Azure because it will establish a connection to an existing database, and not try to create it from a code. `Mongoose` is used for creating models and saving data. To present a documentation [Swagger](https://swagger.io/) is used.

Admin and public pages uses different rights and keys to separate their behaviour.

Only admin pages may change API data while public pages can only read. Therefore while useing `Swagger`, a developer should choose the correct api key, because some functions will not be shown in details.

### Related Projects

- [kurs-pm-data-admin-web](https://github.com/KTH/kurs-pm-data-admin-web)
- [kurs-pm-web](https://github.com/KTH/kurs-pm-web)
- [node-api](https://github.com/KTH/node-api)

## Prerequisites

- Node.js 18

### Secrets for Development

Secrets during local development are ALWAYS stored in a `.env`-file in the root of your project. This file should be in .gitignore.

```
MONGODB_URI=mongodb://kurs-pm-data-api-stage-mongodb-kthse:[password, specified in Azure]==@kurs-pm-data-api-stage-mongodb-kthse.documents.azure.com:[port, specified in Azure]/kursinfo?ssl=true&authSource=kursinfo
API_KEYS_0=?name=kursinfo-web&apiKey=[generate a password for public pages]&scope=read
API_KEYS_1=?name=kurs-pm-data&apiKey=[generate a password for admin page]&scope=write&scope=read
APPLICATIONINSIGHTS_CONNECTION_STRING=[Azure, Application insights, connection string, can be found in Overview]
USE_COSMOS_DB='true'
LOGGING_ACCESS_LOG=debug
SERVER_PORT=3001 [if you want to change port]
```

These settings are also available in an `env.in` file.

## Prepara Database in Azure

1. Create database `kursinfo` and manually set Throughput: 400 (Shared). Name of database will be used in a connection string.
2. In this database create a collection `coursememos` where a shard key is `/courseCode`.
3. Change a connection string by adding name of database (`kursinfo`) after port slush `[port]/` and as a search query after `?` as `authSorce=kursinfo`:

`mongodb://kurs-pm-data-api-stage-mongodb-kthse:[password]==@kurs-pm-data-api-stage-mongodb-kthse.documents.azure.com:[port]`~~/?ssl=true~~`/kursinfo?ssl=true&authSource=kursinfo`

More information can be found in Confluence: [Om kursen: Databas och API, connection string](https://confluence.sys.kth.se/confluence/x/a4_KC)

## For Development

### Install

```sh
npm install
```

### Usage

Start the service on [localhost:3001/api/kurs-pm-data/swagger](http://localhost:3001/api/kurs-pm-data/swagger).

```sh
npm run start-dev
```

## In Production

Secrets and docker-compose are located in cellus-registry.

## Run tests

```sh
npm run test
```

## Monitor and Dashboards

### Application Status

[localhost:3001/api/kurs-pm-data/\_monitor](http://localhost:3001/api/kurs-pm-data/_monitor)

### Branch Information

[localhost:3001/api/kurs-pm-data/\_about](http://localhost:3001/api/kurs-pm-data/_about)

### Application Insights

To see more detailed behaviour in project, use `Application Insights`, e.g., `kursinfo-web-stage-application-insights-kthse`.

## Use 🐳

Copy `docker-compose.yml.in` to `docker-compose.yml` and make necessary changes, if any.

```sh
docker-compose up
```

## Deploy in Stage

The deployment process is described in [Build, release, deploy](https://confluence.sys.kth.se/confluence/x/aY3_Ag). Technical details, such as configuration, is described in [How to deploy your 🐳 application using Cellus-Registy](https://gita.sys.kth.se/Infosys/cellus-registry/blob/master/HOW-TO-DEPLOY.md) and [🔧 How To Configure Your Application For The Pipeline](https://gita.sys.kth.se/Infosys/cellus-registry/blob/master/HOW-TO-CONFIGURE.md).

### Edit secrets.env

```sh
ansible-vault edit secrets.env
```

Password find in gsv-key vault

### Configure secrets.env

```
MONGODB_URI=mongodb://kurs-pm-data-api-mongodb-kthse:[password, specified in Azure]==@kurs-pm-data-api-mongodb-kthse.documents.azure.com:[port, specified in Azure]/kursinfo?ssl=true&authSource=kursinfo
API_KEYS_0=?name=kursinfo-web&apiKey=[generate a password for public pages]&scope=read
API_KEYS_1=?name=kurs-pm-data-admin-web&apiKey=[generate a password for admin page]&scope=write&scope=read
APPLICATIONINSIGHTS_CONNECTION_STRING=[Azure, Application insights, connection string, can be found in Overview]
```

## Author

👤 **KTH**

- Website: https://kth.github.io/
- Github: [@KTH](https://github.com/KTH)
