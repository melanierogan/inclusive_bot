![inclusiveBot](https://avatars0.githubusercontent.com/in/38059?s=60&u=a0231357e67efbe5677c2571831c7e5a4e8c724e&v=4)
# inclusiveBot

> A GitHub App built with [Probot](https://github.com/probot/probot) that checks your pull requests (PR) for unfriendly terminology.


The bot is currently hosted on glitch, [here](https://melanierogan-inclusive-bot.glitch.me) 
The github app is [here](https://github.com/apps/inclusivebot). You will have to you set up on your own repositories with your own chosen permissions.


## What this bot will do

Checks your PR for unfriendly, or not inclusive terminology. These words have been collected through talking to different engineers and asking them what they find unfriendly, not inclusive or not helpful terminology. The bot will let you know where these words occur by commenting on your PR. 


## What this bot won't do

This bot won't change your code for you. It won't correct your grammar. It won't suggest alternative terms to use, but that is something I want to add after I get some initial feedback.


## How does it work?

When the inclusiveBot github app is installed on your repos any incoming PRs are checked for unfriendly terms. If one is found, a comment appears on the PR. 

<img width="773" alt="Screenshot 2020-01-14 at 00 17 43" src="https://user-images.githubusercontent.com/16557524/72302871-4e354e80-3663-11ea-8da8-223798e7c9a7.png">

## Setup

You can install the app to run on your chosen repos here: https://github.com/apps/inclusivebot
You can then get the bot running in two ways. 

After installing the github app
1. Open the glitch site where the bot will run
2. Clone the repo, adjust the env files and run locally deploy it yourself to glitch or heroku.

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Feedback

I would welcome any feedback you have on the project. You can open an issue via this repo, or drop me a slack message. Feedback can include constructive or helpful comments on the format of the code, the approach to the app or if you have come across any unfriendly or not inclusive words or terminology, you can submit a PR to add more words to those I have already researched or crowd sourced. Thank you!


## License

[ISC](LICENSE) © 2019 Melanie Rogan
