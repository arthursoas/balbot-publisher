# Balbot Publisher

Balbot publish is a nodejs script for publishing Balbot conversational flow on several chatbots on Take Blip.
It purpose is avoiding the necessity to apply flow changes manually in each bot when some update is released.

### What is Balbot

Balbot is a chatbot that uses several messages types, like plain text, images, menus etc. on Take Blip using builder structure. The name Balbot is a reference to [@VictorBalbo](https://github.com/VictorBalbo).

### Usage

Download the project to a local directory:
```sh
git clone https://github.com/arthursoas/balbot-publisher.git
```

Edit the file `chatbots.csv` using your chatbots data (on chatbot per row). To get chatbot `Key` and `CommandUrl` access the article on [Help Center](https://help.blip.ai/docs/en/api-sdks/como-encontrar-a-api-key-do-meu-bot/#docsNav)

Install script dependencies
```sh
yarn install
```

Run the script
```sh
yarn start
```
