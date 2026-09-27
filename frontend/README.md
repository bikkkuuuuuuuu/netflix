## Ecommerce Application
 ## How to setup
  * Yarn setup
  - `npm i yarn -g`

  * React Setup
  - `yarn create vite<foldername>`
  - follow the steps

  * Change the working directory
  - `cd <foldername>`

  * Setup the packages/dependencies
  - `yarn`
  * Run the react server
  - `yarn run dev`


## React Hook 
- every hook function starts with `use` keyword
- hook functions are only usable in functional components


## Tailwind with react
- yarn add -D tailwindcss postcss autoprefixer
- npx tailwindcss init -p


## Register
-Fullname, email,password.connfirmPassword,phone, address,gender,role customer|seller, image

## web storage

- local storage
- session storage
- cookies

- cookies=> domain store,time dependent storage unit,path
- per domain=> 300 cookies =>4096 bytes(google chrome) total of 4096*300 = 1.2mb
- string
- document.cookie='user=value;expires=Isodate;path' set
- document.cookie='' get/read

* local/session
- key -value data
- value string data
- no time dependency
- max size 5mb -10mb
- localstorage,sessionstorage
- setItem(key,value) .getItem(key) .removeItem(key) .clear()