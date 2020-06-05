# Kurs-pm-data-api
# Welcome to Kurs-pm-data-api 👋

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-12.0.0-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## Introduction

The course information project (KIP) is an initiative at KTH that was launched in 2018 to improve the quality and availability of information about KTH:s courses. The background to the project is, among other things, that it was difficult for the student to find information about the courses and even more difficult to compare information about several courses. The reason for the problems is scattered course information in several places and that there is no uniformity or assigned places for the course information. The project takes measures to consolidate course information into two locations and to present the information in a manner that is uniform for KTH. The student should find the right information about the course, depending on their needs. The result of the project is a public course site where the correct course information is collected and presented uniformly. Also, a tool is developed for teachers to enter and publish course information. Eventually, this will lead to the student making better decisions based on their needs, and it will also reduce the burden on teachers and administration regarding questions and support for the student.

Kurs-pm-api is a microservice to save course memos data to database. It accepts data from admin pages (kurs-pm-data-admin-web) and serves this data to the public view of course memos (kth-pm-web). It uses `Node.js`, `Moongoose`, `kth-node-cosmos-db`, and is based on [https://github.com/KTH/node-api](https://github.com/KTH/node-api).

### 🏠 [Homepage](https://github.com/KTH/kurs-pm-data-api)

## Overview

Kurs-pm-api is used to save data in Azure Cosmos db by using kth-node-cosmos-db to establish a connection to Azure. Before using it, the database and collection must be prepared in Azure because it is establish a connection to an existing database and not trying to create it from a code. Meanwhile for creating models and saving data it uses a Mongoose. To present a documentation `Swagger` is used.
Admin and public pages uses different rights and keys to separate their behaviour.
Only admin pages may change api data while public pages can only read. Therefore while useing a 'Swagger' developer should choose a correct api key, because some function will not be shown in details.


### Related projects

- [https://github.com/KTH/kurs-pm-data-admin-web](https://github.com/KTH/kurs-pm-data-admin-web)
- [https://github.com/KTH/kurs-pm-web](https://github.com/KTH/kurs-pm-web)
- [https://github.com/KTH/node-web](https://github.com/KTH/node-api)

## Prerequisites

- Node.js 12.0.0
- Ansible Vault

### Secrets for Development

Secrets during local development are ALWAYS stored in a `.env`-file in the root of your project. This file should be in .gitignore. It needs to contain at least ldap connection URI and password in order for authentication to work properly.

```
MONGODB_URI=mongodb://kurs-pm-data-api-stage-mongodb-kthse:[password, specified in Azure]==@kurs-pm-data-api-stage-mongodb-kthse.documents.azure.com:[port, specified in Azure]/kursinfo?ssl=true&authSource=kursinfo
API_KEYS_0=?name=kursinfo-web&apiKey=1234&scope=read
API_KEYS_1=?name=kurs-pm-data&apiKey=5678&scope=write&scope=read
APPINSIGHTS_INSTRUMENTATIONKEY=[Azure, Application insights, Instrumentation Key, can be found in Overview]
SERVER_PORT=3001 [if you want to change port]
```

These settings are also available in an `env.in` file.

## Prepara database in Azure

Create database `kursinfo` and manually set Throughput: 400 (Shared),
In this database create a collection `coursememos` where a shard key is `/courseCode`.
Change a connection string:

`mongodb://kurs-pm-data-api-stage-mongodb-kthse:[password]==@kurs-pm-data-api-stage-mongodb-kthse.documents.azure.com:[port]`~~/?ssl=true&replicaSet=globaldb~~`/kursinfo?ssl=true&authSource=kursinfo`




## Install

```sh
npm install
```

## Usage

Start the service on [http://localhost:3001/api/kurs-pm-data/swagger](http://localhost:3001/api/kurs-pm-data/swagger).

```sh
npm run start-dev
```

## In production

Secrets and docker-compose are located in cellus-registry.

Used:
```sh
npm run start
```

## Run tests

```sh
npm run test
```

## Use 🐳

Copy `docker-compose.yml.in` to `docker-compose.yml` and make necessary changes, if any. 

```sh
docker-compose up
```


### Monitor and dashboards

Status: 

To monitor status: http://localhost:3001/api/kurs-pm-data/_monitor

To see branch information: http://localhost:3001/api/kurs-pm-data/_about

To see more detailed behaviour in project used application insights: f.e., kursinfo-web-stage-application-insights-kthse


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
API_KEYS_0=?name=kursinfo-web&apiKey=1234&scope=read
API_KEYS_1=?name=kurs-pm-data-admin-web&apiKey=5678&scope=write&scope=read
APPINSIGHTS_INSTRUMENTATIONKEY=[Azure, Application insights, Instrumentation Key, can be found in Overview]
```

## Author

👤 **KTH**

- Website: https://kth.github.io/
- Github: [@KTH](https://github.com/KTH)
