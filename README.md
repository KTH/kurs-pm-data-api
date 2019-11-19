# Node-api

## Template project for RESTful API:s

In an attempt to simplify the process of starting up new Node.js based projects, there exists two template projects
to use as a foundation.

The two projects are [node-web][web], a web server with express, and [node-api][api], a RESTful API.
The node-web project CAS as a mechanism for authorisation and authentication.

#### Where can I find the template projects?

- [https://github.com/KTH/node-api.git][api]
- [https://github.com/KTH/node-web.git][web]

It's important that we try to make changes that affect the template projects in the template projects themselves
to make sure that all other projects based on the templates get the good stuff.

#### How do I use this template project for a project of my own?

1. Create a new repository on Gita or Github.
2. Clone the node-api repository by using:

   ```bash
   git clone git@github.com:KTH/node-api.git NEW_REPOSITORY_NAME
   ```

3. Navigate to the cloned project directory

4. Change remote repo

   ```bash
   git remote add origin https://github.com/KTH/<NEW_REPOSITORY_NAME>.git
   ```

### How to configure the applications

Make sure you have a MongoDb connected. An easy way to add a MongoDb is to clone and start the following database repo on your local machine: https://gita.sys.kth.se/infosys/kth-node-backend

```
# Logging
LOGGING_ACCESS_LOG=/Users/hoyce/repos/github/node-api/logs
```

Set your basePath property in `swagger.json`:

```
{
  "swagger": "2.0",
  "info": {
  "title": "Node API",
    "description": "Template API project for Node.js",
    "version": "1.0.0"
  },
  "basePath": "/api/node/v1",
```

Please, remember to set path to match your application.

#### What is `swagger-ui`?

The `swagger-ui` package is simply used to provide a basic UI for
testing the API. It is not directly required in the code, which
means running checks like `npm-check` will claim it is unused.
It cannot be stressed enough, **do not remove this package**!

#### What can I customize?

Follow the instructions for the files and folders below. For
any files and folders not listed, avoid editing them in a your
custom project.

- `server/models/`

  Anything in this folder can be edited to fit your project.
  You can safely remove the `sample.js` file and add your own
  mongoose-based schemas and models.

- `server/init/routing/sampleRoutes.js`

  This file contains routing config for the sample controller.
  You can either rename or remove this file. Other files in this
  folder should only be edited in the template project. The paths
  for the routes come from the `swagger.json` file.

- `server/controllers/sampleCtrl.js`

  This file contains the sample controller. You can either rename
  or remove this file. You can add your own controllers to this
  folder. Remember to add your custom controllers to the `index.js`
  file.

- `swagger.json`

  This file contains the API configuration and documentation.
  You should add your own paths to this file. See the [Swagger
  website][swagger] for documentation on the `swagger.json` format.

- `start.sh` and `stop.sh`

  Make sure to update the project name in these files.

- `package.json`

  Update the project name and add any dependencies you need.
  Excluding the testing scripts, avoid editing the scripts.

- `server/server.js`

  Add additional startup code to the init callback.

- `test/`

  As explained below, you can completely remove all tests if
  you like. If you want to use testing in your project, here's
  the recommended place to put your test files.

- `server/lib/`

  Here you can put custom code that does not fit in any other
  place. Though do not edit the `routing.js` file.

- `config/`

  Any and all configuration goes here. In particular you must
  edit the `commonSettings.js` file to match your project's
  proxy prefix path (i.e. `/api/node`). Other files you may
  want to edit are the environment specific files for the
  database connection config. Finally the `localSettings.js`
  file should never be checked into source control as it's
  used to contain sensitive information. You can also
  override other settings in this file.

- `.gitignore`

#### Common errors

When trying to run node-api as a standalone you might encounter the following error:

```
return binding.open(pathModule._makeLong(path), stringToFlags(flags), mode);
```

This is because the SSL information is incorrect in localSettings.js. Set `useSsl: false` to avoid this.

#### Testing

The template project uses a [sample setup][sample-test] for
tests using [tape][tape]. It is not required to use this test
harness in your projects. Simply remove the sample code and
any reference to it in your project's `package.json` file.

Keep in mind that you still need to provide a working npm
script for `npm test` for the build server. If you don't want
or need tests, a simple `echo "ok"` will suffice.

[api]: https://github.com/KTH/node-api
[web]: https://github.com/KTH/node-web
[tape]: https://github.com/substack/tape
[sample-test]: test/unit/specs/sampleCtrl-test.js
[swagger]: http://swagger.io/
