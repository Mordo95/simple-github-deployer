# Simple github deployer

Runs actions from a config file for multiple gits using one github hook.

## Overview

This project allows to configure multiple repositories using a single config file and execute actions on them when a push event is received.  
When the event is received, the payload is verified.  
`git pull` is executed inside the path the configured repository resides in.  
When done, the given action is ran inside the path the configured repository resides in.  

## Useful commands
`npm start`         Starts the action listener  
`npm make:secret`   Creates a secret to use in the config file

## Installing
1. Clone this git repository
2. Run `npm i`
3. Run `cp config.example.json config.json`
4. Run `npm make:secret` to generate a secret.
5. Update `config.json` to your likings using the secret generated.
6. Run `npm start` to run the listener

## Config file structure

Reference to config.example.json for an example. A repository can be defined as following;
```js
{
    "name": "mordo95/example-repo", // The FULL name of the repository
    "secret": "34333f3bfd6bc91d6e092c1c6c42e242", // The secret used for the github webhook
    "branch": "dev", // Optional, overrides the branch. Default branch is the repository's master branch configured in github (not the default)
    "path": "/var/www/example-repo", // The directory where the git is located
    "action": "update.sh", // The action or command line instruction to execute
}
```

## Response status codes

The hook will return a few different status codes, depending on the result of the action.

| Code | Reason |
| ---- | ------ |
| 200  | Ignored or OK |
| 404  | The repository is not (correctly) configured |
| 500  | The payload contains no verification header or is not valid |