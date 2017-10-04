# Recast.AI starter kit Alexa

A starter kit for developing bots on Alexa, powered by the [Recast.AI](https://recast.ai) platform.

> **Note:** This project is currently in beta version and can be modified at any time.

## Requirements

#### Node version

We recommend to use at least `node v4.3.0`


#### Recast.AI account

Create an account on the [Recast.AI](https://recast.ai) platform and follow this [quick tutorial](https://recast.ai/gettingstarted) to create your first bot on the interface.

#### Alexa integration

Follow the instructions on the [dedicated article](https://blog.recast.ai) on our blog to integrate with Alexa.

## Usage


#### Installation

`git clone https://github.com/RecastAI/starter-alexa.git my-bot && cd my-bot`

using npm
`npm install`

or yarn
`yarn`


#### Run locally

using npm `REQUEST_TOKEN=xxxxxxxx npm start`

using yarn `REQUEST_TOKEN=xxxxxxxxx yarn start`

where `REQUEST_TOKEN` is your bot's request token.

- download [ngrok](https://ngrok.com/)
- launch it: `./ngrok http 3000`

## Documentation

Code | Documentation
------------ | -------------
Receiving messages | [The Recast.AI SDK](https://github.com/RecastAI/SDK-NodeJS/wiki) - connect
Sending messages | [The Recast.AI SDK](https://github.com/RecastAI/SDK-NodeJS/wiki) - connect
Rich messaging | See the different [payload message](https://man.recast.ai)
Manage the conversation | [The Recast.AI SDK](https://github.com/RecastAI/SDK-NodeJS/wiki) - converse


## How your code will be deployed?

To host your bot and deploy your code, create a repository on Github, and push this code on it.
Connect your github account on Recast:

- Go to your bot page
- Click on the **RUN** tab, and on the **Bot Hosting** menu
- Connect your Github account
- Select the repository you've just created
- Wait a little, we're starting your instance...

Every time you will push onto the master branch, we'll deploy your code 👏

#### Requirements

Since we deploy your code in generic containers, there are 3 requirements:

- [x] Your package.json **must** contain the `build` task. It must be present even if empty or just copying files. The default one you will find in the starter kit is `"build": "babel src -d lib"` to compile your Javascript. So you can code with your favorite ES6, ES7 features :thumbsup:
- [x] A lib directory must be present (by default it's created with the `build` task)
- [x] The entrypoint of your code in production **must** be in the `lib/bot.js` file. This file **must** contain an export of a `bot` function named `bot`. It takes as the first argument the body of the request (Bot Connector, custom curl,...)

You can change all other file names, directory structures, but be sure that these three points work fine!

You can add any env. variable you want in the **Bot Hosting** section and then use it in your code with this syntax: `process.env.MY_ENV_VAR_NAME`

## More

You can view the whole API reference at [man.recast.ai](https://man.recast.ai).
You can follow us on Twitter at [@recastai](https://twitter.com/recastai) for updates and releases.

## License

Copyright (c) [2017] [Recast.AI](https://recast.ai)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

