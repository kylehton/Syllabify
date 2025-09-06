"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const GoogleSignInButton = dynamic(
  () => import("./GoogleSignInButton"),
  { ssr: false }
);



export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-8 md:p-12 lg:p-16 relative overflow-hidden">
      {/* Large title in top left */}
      <div className="flex-1 flex items-start">
        <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-primary leading-none tracking-tight">
          syllabify
        </h1>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-3/5 h-full opacity-45 pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-l-2xl shadow-2xl transform rotate-1 blur-sm">
          {/* Syllabus content lines */}
          <div className="p-6 space-y-14 lg:space-y-18 xl: space-y-20">
            <div className="h-4 bg-slate-300 dark:bg-slate-500 rounded w-3/4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam necessitatibus quis ullam voluptatem pariatur tempore labore, architecto recusandae numquam dolor sunt esse modi aut quam nobis, perferendis veniam expedita.</div>
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-full">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam necessitatibus quis ullam voluptatem pariatur tempore labore, architecto recusandae numquam dolor sunt esse modi aut quam nobis, perferendis veniam expedita.</div>
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-5/6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam necessitatibus quis ullam voluptatem pariatur tempore labore, architecto recusandae numquam dolor sunt esse modi aut quam nobis, perferendis veniam expedita.</div>
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-4/5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam necessitatibus quis ullam voluptatem pariatur tempore labore, architecto recusandae numquam dolor sunt esse modi aut quam nobis, perferendis veniam expedita.</div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-full mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam necessitatibus quis ullam voluptatem pariatur tempore labore, architecto recusandae numquam dolor sunt esse modi aut quam nobis, perferendis veniam expedita.</div>
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-full">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam necessitatibus quis ullam voluptatem pariatur tempore labore, architecto recusandae numquam dolor sunt esse modi aut quam nobis, perferendis veniam expedita.</div>
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-3/4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam necessitatibus quis ullam voluptatem pariatur tempore labore, architecto recusandae numquam dolor sunt esse modi aut quam nobis, perferendis veniam expedita.</div>
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-5/6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam necessitatibus quis ullam voluptatem pariatur tempore labore, architecto recusandae numquam dolor sunt esse modi aut quam nobis, perferendis veniam expedita.</div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded w-full mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam necessitatibus quis ullam voluptatem pariatur tempore labore, architecto recusandae numquam dolor sunt esse modi aut quam nobis, perferendis veniam expedita.</div>
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-4/5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam necessitatibus quis ullam voluptatem pariatur tempore labore, architecto recusandae numquam dolor sunt esse modi aut quam nobis, perferendis veniam expedita.</div>
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-full">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam necessitatibus quis ullam voluptatem pariatur tempore labore, architecto recusandae numquam dolor sunt esse modi aut quam nobis, perferendis veniam expedita.</div>
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-2/3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam necessitatibus quis ullam voluptatem pariatur tempore labore, architecto recusandae numquam dolor sunt esse modi aut quam nobis, perferendis veniam expedita.</div>
          </div>
        </div>
      </div>

      {/* Description and sign in button in bottom right */}
      <div className="flex justify-end z-10 relative">
        <div className="max-w-md text-right space-y-6">
          <div className="space-y-1">
            <p className="text-base md:text-xl leading-relaxed">
              Simplify your syllabi.
            </p>
            <p className="text-sm">
              Turn your course syllabus into events on your calendar!
            </p>
          </div>
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  )
}
