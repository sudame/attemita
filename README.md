# attemita

> attemita is private/team person repository

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).


## firestore structure

- users
  - { userID }
- teams
  - { teamID } 
    - name: *`string`*
- people
  - {personID}
    - isPrivate: *`boolean`*
    - ownerUser: *`string`* - firebae auth user ID
    - ownerTeam: *`ref`* - to `team/{teamID}`
    - name: *`string`*
- belongs
  - { belongID }
    - team: *`ref`* - to `teams/{teamID}`
    - user: *`string`* firebase auth user ID
