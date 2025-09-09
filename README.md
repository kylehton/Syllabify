### Syllabify

## About the App
This is an application built to ease the experience of entering new classes with new syllabi. Syllabify aims to
make the syllabus-reading experience simpler, parsing dates automatically to integrate the course assignment, 
project, and exam deadlines directly into your Google Calendar in seconds! This is the MVP version so far, and 
will have more features added later on. I chose to take a minimalist route in color patterning and design, to make
it easy on the eyes and with text, so students that are fatigued won't have as much eye strain. Additionally the
back-pattern blur on the landing page is a blurred syllabus!


## Frameworks/Tools/Libraries Used
 - Next.js
 - Node.js (hidden layer via Next.js)
 - Google 0Auth2.0 Client
 - Google Calendar API
 - OpenAI API (model: gpt-4o-mini)
 - ShadCN UI/TailwindCSS


## User Flow
1. The user first signs in/signs up for Syllabify using their Google Account
2. They are prompted to select their syllabus, which must be in PDF format.
3. From there, they are upload their PDF to be analyzed and parsed by OpenAI
4. The parsed dates are then sent back, and parsed into the Data Table component from ShadCN.
5. The user then has different actions they can take, from editing events to deleting them.
6. Finally, they can choose to push all events to their linked Google Calendar.


## Single Origin/Page Application
My app is a single-page application served from a single origin. The client-side pages are pre-built into static assets and served by Node.js. The app communicates with the backend through same-origin **/api** routes, which simplifies development and removes the need for CORS.


## Google-User Authentication
Google is used for user authentication, where the user signs into the application, granting permissions to Syllabify
to read and write to their Google Calendar. Upon signing in/up, Google sends a credential code, which is used to retrieve
an access token as a Bearer token for Google API requests. To reinforce validation of the access token, the user is kept
logged in for no more than an hour, inline with the lifespan of each access token. The token is provided in all API requests
to Google APIs. (Later on, user login will be fully persisted + tokens will have managed refresh once persisted database 
is added)


## Client-Side Pages

# Landing Page - [login-page.tsx]
This page is the landing page, containing the name of the application, as well as the entry point to sign in/up and use
the application

# Main Dashboard - [/dashboard/page.tsx]
I used the Next.js App Router for routing between pages, and so I followed the appropriate naming convention. You will see
in various parts of the codebase that it routes to '/dashboard', which points to the dashboard directory and its page.tsx.
This page contains all of the functionality and main components, imported from the '/dashboard/components' folder.


## Server-Side Endpoints
Following the standard single-origin convention, all endpoints are in the [/api] folder.

# Google Status/Authentication and Calendar - [/api/google]
All endpoints revolving/including usage of Google authentication and APIs.

1. Log In - [/auth/login] + [/auth/login/callback]
This is the login endpoint for the application. From here, the main route.ts in this directory is called, beginning
the sign in/up process. It then continues the process, calling the callback directory route.ts, which handles the 
access token retrieval logic. The access token is stored in an HTTP-only cookie, using HTTPS security for non-local
deployments.

2. Log Out - [/auth/logout]
This is the logout endpoint for the application, providing an endpoint to remove the cookie and effectively log out
of the user's account.

3. Status - [/auth/status]
The status endpoint provides an authentication checkpoint to see whether any user is logged in, and if so, returns
the access token to use

4. Calendar - [/calendar]
The calendar endpoint provides a function to post events to a calendar. It uses concurrent mapping to process the 
event uploads, since there is no efficient batch requesting, and to stay within rate limiting of Google API.


# Syllabus Upload - [/api/upload]
This endpoint takes in the resume in PDF format in the request body, and parses it into text. Through this, it gets
sent back to the client-side page, where it is then routed to the below endpoint.


# OpenAI - [/api/openai]
This endpoint handles the parsing and analysis of a text-converted syllabus, using a created system prompt and the 
Chat Completions API. The system prompt provides guidelines for how to pull the dates out of the resume, including
the JSON format in which to return them. It also uses the RFC 3339 time format, which is the same one that Google
Calendar API requires as a parameter for event creation.


## Note
The [/test/data] directory, holding an empty pdf, is to remove the test check errors from the 'pdf-parse' imported
library