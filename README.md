# Trip planner

<p align="center">
   <img src="https://github.com/gustavopolonio/nlw-journey/blob/master/.github/web.png" width="760"/>
</p>

# :pushpin: Table of Contents
* [About this Project](#book-about-this-project)
* [How to Use](#construction_worker-how-to-use)
* [Technologies](#computer-technologies)
* [License](#closed_book-license)

# :book: About this Project

Trip planner is an app to organize your trip together with your guests.

You put the trip destination, the start and end date, invite the guests and you can add important activities and links. So that everyone has a travel schedule with easy access.

Live link: [https://nlw-journey-front-end-taupe.vercel.app/](https://nlw-journey-front-end-taupe.vercel.app/)

This project is an improvement of a [Rocketseat](https://app.rocketseat.com.br/) idea.

# :construction_worker: How to Use

Before starting, you need to have installed in your machine: [Node](https://nodejs.org/en/download/), [npm](https://www.npmjs.com/) (or other package manager), [Git](https://git-scm.com/) 
and a code editor (I use [VSCode](https://code.visualstudio.com/)).

```bash

# Clone this repository via HTTPS:
$ git clone https://github.com/gustavopolonio/nlw-journey.git

# Open a terminal to run the backend and go into the backend repository:
$ cd nlw-journey/backend-node

# Install dependencies:
$ npm install

# Open a terminal to run the frontend and go into the frontend repository:
$ cd nlw-journey/frontend

# Install dependencies:
$ npm install

```

Create your environment variables based on the examples of `.env.example` both for the backend and frontend

```bash
cp .env.example .env
```

After copying the examples, make sure to fill the variables with your own values. For the `DATABASE_URL` env you need to create a postgresql database and retrieve its url (mine is created at [Neon](https://neon.tech/))

**Start both the backend and frontend in a development environment**

```bash
npm run dev
```

# :computer: Technologies

* [Vercel](https://vercel.com/) for frontend deploy
* [Render](https://render.com/) for backend deploy
* [Neon](https://neon.tech/) for postgres database
* Node + Fastify
* Vite + React
* Tailwind

---

Made with :green_heart: by [Gustavo Polonio](https://github.com/gustavopolonio) 🚀

[![Linkedin Badge](https://img.shields.io/badge/-Gustavo-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/gustavo-polonio-04b77a169/)](https://www.linkedin.com/in/gustavo-polonio-04b77a169/)
[![Gmail Badge](https://img.shields.io/badge/-gustavopolonio1@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:gustavopolonio1@gmail.com)](mailto:gustavopolonio1@gmail.com)
