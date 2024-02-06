# :bug: bugfix

Bug tracking React app implemented for the Advanced Front End course.
This is a simple single-page application, using React, Mobx, and Firebase, that allows both registered and anonymous users to report bugs in certain projects and view reported bugs, as well as update their status.

## Overview
* Routing  
    - Used React Router to create static and dynamic routes.
    - The layout of the page is consistent throughout the pages, using an outlet to render the content of the page depending on the route.
    - The dynamic pages use the project/user ID params to fetch data for the specific ID.
    - Unavailable routes are handled with an error page.
* Public & private routes  
    - The private routes are protected by an additional component, that checks if the user can access the page and, if they can, renders the requested page, otherwise, it renders the specific error page.
    - The private routes are the profile pages of the user that opted for a private profile(can only be accessed by the owner), and the account management page(can only be accessed by authenticated users).
* Component communication
    - Components communicate through props when the data has to be visible to a few components.
    - Data is passed using stores when it has to be visible globally. I used Mobx for this kind of state management, as it is easy to set up and easy to use to use for small projects.
    - Data is also passed through the route parameters for the dynamic routes.
* Reusable components
    - Used Ant Design components with custom configurations for a professional-looking UI, as it has vast options for components, good documentation, and flexible configurations.
    - Created own reusable components for repeating elements, such as forms, tables, and cards.
* Backend
    - As the backend needs are simplistic and not the main focus of the app, I used Firebase for fast development.
