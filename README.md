# Welcome to kurs-pm-data-api 👋

![Version](https://img.shields.io/badge/version-0.8.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-12.0.0-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## Introduction

The course information project (KIP) is an initiative at KTH that was launched in 2018 to improve the quality and availability of information about KTH:s courses. The background to the project is, among other things, that it was difficult for the student to find information about the courses and even more difficult to compare information about several courses. The reason for the problems is scattered course information in several places and that there is no uniformity or assigned places for the course information. The project takes measures to consolidate course information into two locations and to present the information in a manner that is uniform for KTH. The student should find the right information about the course, depending on their needs. The result of the project is a public course site where the correct course information is collected and presented uniformly. Also, a tool is developed for teachers to enter and publish course information. Eventually, this will lead to the student making better decisions based on their needs, and it will also reduce the burden on teachers and administration regarding questions and support for the student.

Kurs-pm-api is a microservice to save course memos data to database. It accepts data from admin pages ([kurs-pm-data-admin-web](https://github.com/KTH/kurs-pm-data-admin-web)) and serves this data to the public view of course memos ([kurs-pm-web](https://github.com/KTH/kurs-pm-web)). It uses [Node.js](https://nodejs.org/), [Mongoose](https://mongoosejs.com/), `kth-node-cosmos-db`, and is based on [https://github.com/KTH/node-api](node-api).

### 🏠 [Homepage](https://github.com/KTH/kurs-pm-data-api)

## Overview

Kurs-pm-api is used to save data in a Azure Cosmos database by using `kth-node-cosmos-db` to establish a connection to Azure. Before using it, the database and collection must be prepared in Azure because it will establish a connection to an existing database, and not try to create it from a code. `Mongoose` is used for creating models and saving data. To present a documentation [Swagger](https://swagger.io/) is used.

Admin and public pages uses different rights and keys to separate their behaviour.

Only admin pages may change API data while public pages can only read. Therefore while useing `Swagger`, a developer should choose the correct api key, because some functions will not be shown in details.

### Related Projects

- [kurs-pm-data-admin-web](https://github.com/KTH/kurs-pm-data-admin-web)
- [kurs-pm-web](https://github.com/KTH/kurs-pm-web)
- [node-api](https://github.com/KTH/node-api)
- [Mongoose](https://mongoosejs.com/)
- [Swagger](https://swagger.io/)
- [React-pdf](https://react-pdf.org/)
- [html-react-parser](https://github.com/remarkablemark/html-react-parser)

## Prerequisites

- Node.js 12.0.0
- Ansible Vault

### Secrets for Development

Secrets during local development are ALWAYS stored in a `.env`-file in the root of your project. This file should be in .gitignore. It needs to contain at least ldap connection URI and password in order for authentication to work properly.

```
MONGODB_URI=mongodb://kurs-pm-data-api-stage-mongodb-kthse:[password, specified in Azure]==@kurs-pm-data-api-stage-mongodb-kthse.documents.azure.com:[port, specified in Azure]/kursinfo?ssl=true&authSource=kursinfo
API_KEYS_0=?name=kursinfo-web&apiKey=[generate a password for public pages]&scope=read
API_KEYS_1=?name=kurs-pm-data&apiKey=[generate a password for admin page]&scope=write&scope=read
APPINSIGHTS_INSTRUMENTATIONKEY=[Azure, Application insights, Instrumentation Key, can be found in Overview]
USE_COSMOS_DB='true'
LOGGING_ACCESS_LOG=debug
SERVER_PORT=3001 [if you want to change port]
```

These settings are also available in an `env.in` file.

## Prepara Database in Azure

Create database `kursinfo` and manually set Throughput: 400 (Shared),
In this database create a collection `coursememos` where a shard key is `/courseCode`.
Change a connection string:

`mongodb://kurs-pm-data-api-stage-mongodb-kthse:[password]==@kurs-pm-data-api-stage-mongodb-kthse.documents.azure.com:[port]`~~/?ssl=true&replicaSet=globaldb~~`/kursinfo?ssl=true&authSource=kursinfo`

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
APPINSIGHTS_INSTRUMENTATIONKEY=[Azure, Application insights, Instrumentation Key, can be found in Overview]
```

## PDF Generation

The application has an endpoint that generates a PDF course memo. The PDF file is generated with [React-pdf](https://react-pdf.org/). Memo data in `HTML` will be parsed into `React` elements with [html-react-parser](https://github.com/remarkablemark/html-react-parser), before they are added to the document element tree.

'React`components are converted with [Babel](https://babeljs.io/) into`./components-dist/`.

### Course Memo Components

```sh
CourseMemo
|-- CourseMemoDocument
|   |-- CourseMemoCoverSheet
|   |-- CourseMemoPages
|       |-- CourseMemoContent
|       |-- CourseMemoPageFooter
|-- CourseMemoHtmlParser
|-- CourseMemoStyles
```

#### CourseMemo

Entry point component. Renders `CourseMemoDocument` component.

#### CourseMemoDocument

Renders wrapping `Document` component, `CourseMemoCoverSheet` and `CourseMemoPages`.

#### CourseMemoCoverSheet

Renders `Page` component containing the memo’s cover sheet.

#### CourseMemoPages

Renders `Page` component containing the memo’s pages. Inside the `Page`, a `CourseMemoContent` component is rendered for the memo`s content, and a`CourseMemoPageFooter` component for the memo’s footers.

#### CourseMemoContent

Renders `Section` components for the memo’s sections. Contains logic for determining if sections are visible in memo, or not.

#### CourseMemoPageFooter

Renders footer text and page numbers.

#### CourseMemoHtmlParser

Parses `HTML` data into `React` elements. Called from `CourseMemoContent`.

#### CourseMemoStyles

Contains all styles for PDF components.

## Author

👤 **KTH**

- Website: https://kth.github.io/
- Github: [@KTH](https://github.com/KTH)
