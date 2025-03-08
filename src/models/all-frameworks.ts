import { IFramework } from "../interfaces/framework.interface";
import { v4 as uuidv4 } from 'uuid';

export const mainFrameworks: IFramework[] = [
    {
      name: "React",
      currentVersion: "18.2.0",
      latestVersion: "18.2.0",
      releaseDate: new Date("2022-06-14"),
      repository: "facebook/react",
      documentationUrl: "https://react.dev",
      breakingChanges: [],
      id: uuidv4()
    },
    {
      name: "Angular",
      currentVersion: "17.0.0",
      latestVersion: "17.0.0",
      releaseDate: new Date("2023-11-08"),
      repository: "angular/angular",
      documentationUrl: "https://angular.io/docs",
      breakingChanges: [],
      id: uuidv4()
    },
    {
      name: "Vue.js",
      currentVersion: "3.3.0",
      latestVersion: "3.3.0",
      releaseDate: new Date("2023-05-17"),
      repository: "vuejs/core",
      documentationUrl: "https://vuejs.org",
      breakingChanges: [],
      id: uuidv4()
    },
    {
      name: "Next.js",
      currentVersion: "14.0.0",
      latestVersion: "14.0.0",
      releaseDate: new Date("2023-10-26"),
      repository: "vercel/next.js",
      documentationUrl: "https://nextjs.org/docs",
      breakingChanges: [],
      id: uuidv4()
    },
    {
      name: "Nuxt.js",
      currentVersion: "3.8.0",
      latestVersion: "3.8.0",
      releaseDate: new Date("2023-10-25"),
      repository: "nuxt/nuxt",
      documentationUrl: "https://nuxt.com/docs",
      breakingChanges: [],
      id: uuidv4()
    },
    {
      name: "Svelte",
      currentVersion: "4.2.0",
      latestVersion: "4.2.0",
      releaseDate: new Date("2023-07-01"),
      repository: "sveltejs/svelte",
      documentationUrl: "https://svelte.dev/docs",
      breakingChanges: [],
      id: uuidv4()
    },
    {
      name: "Express",
      currentVersion: "4.18.2",
      latestVersion: "4.18.2",
      releaseDate: new Date("2022-10-08"),
      repository: "expressjs/express",
      documentationUrl: "https://expressjs.com",
      breakingChanges: [],
      id: uuidv4()
    },
    {
      name: "NestJS",
      currentVersion: "10.2.0",
      latestVersion: "10.2.0",
      releaseDate: new Date("2023-08-11"),
      repository: "nestjs/nest",
      documentationUrl: "https://docs.nestjs.com",
      breakingChanges: [],
      id: uuidv4()
    },
    {
      name: "Django",
      currentVersion: "4.2.0",
      latestVersion: "4.2.0",
      releaseDate: new Date("2023-04-05"),
      repository: "django/django",
      documentationUrl: "https://docs.djangoproject.com",
      breakingChanges: [],
      id: uuidv4()
    },
    {
      name: "Laravel",
      currentVersion: "10.0.0",
      latestVersion: "10.0.0",
      releaseDate: new Date("2023-02-14"),
      repository: "laravel/laravel",
      documentationUrl: "https://laravel.com/docs",
      breakingChanges: [],
      id: uuidv4()
    }
  ];