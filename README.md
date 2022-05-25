# Project 3: Plantpedia

---
### Overview
---
This project is Philip, Jacqueline, and Rob's third fully developed exercise at General Assembly's Software Immersive course.

The assignment was to create a full stack website comprised of a backend that uses express to store user-generated data on a mongodb database and a frontend that uses React and React-based frameworks. The project was to be completed by a three-person team within one week.

We chose to create "Plantpedia" because we all like plants and because it would allow us not only to use all the skills we have learned but to also grow on this skill base.  


Are you curious to see the end result? [Check out the site.](https://a-day-at-the-zoo.netlify.app/) 

---
### Brief
---
* A full stack website that stores user-generated data in a mongodb database.
* A React frontend that is connected to the backend.
* User registration, login, and authentication.
* Write a readme.
* Commit early and often to Github.
* Complete it in one week.

---
### Technologies Used
---
* HTML
* CSS
* GoogleFonts
* JavaScript
* Git and GitHub
* React
  - React hooks: useState, useEffect, BrowserRouter, Route, Routes, useNavigate, Link
* Material UI
  - Components: Avatar, Button, CssBaseline, TextField, Link, Grid, Box, LockOutlinedIcon, Typography, Container, createTheme, AppBar, Toolbar, IconButton, Menu, Tooltip, MenuItem, AdIcon, DarkModeIcon, LightModeIcon, FormControl, FormControlLabel, Select, InputLabel, Slider, Checkbox, OutlinedInput, Chip, Paper, ToggleButton, ToggleButtonGroup, PhotoCamera, styled, Accordion, AccordionSummary, AccordionDetails, Pagination, TextareaAutosize, Stack, Tabs, Tab
* Third Party Dependencies:
  - react-image-crop
  - moment.js
* Axios
* Express
* Mongoose / Mongoose Unique Validator
* MongoDB
* JSON Web Token / bcrypt
* Trello
* Excalidraw
* A [http://www.mauvecloud.net/randomchooser.html](Random Chooser) for divvying up tasks


---
### Frontend Interface
---
The interface includes 11 pages:
* Home.js is the root page, where users are greeted with a list of all plants and a dynamic search bar that allows users to search for plants by name and also by flower color.
* Login.js is where the user logs in. There are certain pages, such as user profiles, that the user can't view without being logged in and thusly redirects the user to the login page if clicked
* Register.js is where a new user can register
* NotFound.js is our 404 page
* PageNavbar.js is our navbar. It has the logo and name of our site on the left. On the right, when a user is logged in, there is a dark-mode toggle, a '+' button that directs users to the PlantAdd page, and a menu bar that allows users to click on their own profile or to log out. When a user is logged out, on the righthand side is different, containing only "Login" and "Register" options that link to the respective pages
* PlantAdd.js is a form where a user can add a plant along with a description of the plant, an image, and all of the important information about the plant
* PlantEdit.js is the same form as PlantAdd, but data for the selected plant populates in the form upon pageload
* PlantShow.js is the show page for the plant. It is accessed when the user clicks on the specific plant image. The page includes the image of the plant, an accordion for displaying information about the plant, and a comment section.
* EditorApplication.js is where the user applies for editing permissions. It is accessed when a user that does not have editing permissions presses the "edit" button on the PlantShow page. When a user submits an application, the data is directed to an "EditorApplications" section of the database. The admins can read the application there and then toggle "canEdit" to "true" on the user's profile on the backend.
* EditUserProfile.js is where the user sets and edits their bio profile picture. React-image-crop is used to crop the image into a square image on desktop, but when the screen is less than 700px, the image crop functionality is disabled.
* UserProfile.js is the user's profile. Inspired by Instagram's user profile, it has the user profile image and information at the top, and at the bottom is a tab bar where users can toggle between their posted plants, their favorite plants, and their edited plants

---
### Backend Models and Controllers
---
The backend includes 4 models:
* User: 
  - Database fields: username, email, password, image, favorites, myEdits, bio, canEdit, and hasApplied  
  - Virtual fields: createdPlants and createdComments
* Plant: 
  - Database fields: name, scientificName, description, images, watering, sunExposure, soilType, flowerColor, mood, lifespan, isIndoor, height, width, nativeArea, owner, lastEdit, comments, favorites, editors, and timestamps
  - Virtual fields: ownerUsername and lastEditUsername
* Comments:
  - Database fields: text, owner, username, timestamps
  - Virtual fields: image
* EditorApplication:
  - Database fields: firstName, lastName, text, owner, username, timestamps
  - Virtual fields: none

Each model has its own controller. To view profiles of other users, and to update or post any information, the user must first get past a secure route that checks to see if the user's id matches the one on the jwt web token associated with the user id.

The server uses express to listen for and route calls and mongoose to connect to the mongodb backend

---
### Approach
---


#### Planning
The first thing we did was brainstorm ideas for a site. Once we had one that we all liked, we created Excalidraw mockups for the site and decided to go with Material UI as our frontend React Framework. We then created Trello checklists for the initial frontend and backend coding that would be useful to do together before splitting up tasks.

#### Coding
It was decided that we would code the entire backend together, so that's the coding we did. When this was done, we moved onto the frontend, setting up the folder structures, the Index.js, the App.js, and the PageNavBar together before dividing and conquering on creating MVP browser pages.

When the MVP was made, we added bells and whistles to it, such as an intelligent searchbar, comments, an editor application, and intelligent image handling and cropping.

Once the site had all the functionality we wanted, styling became the focus. We added a dark mode, a custom color palette, and custom fonts, along with general stylistic enhancements so that it rendered well on mobile as well as on desktop


---
### Screenshots
---
![Homepage](/client/src/images/home-screen.png)
![User Profile](/client/src/images/user-profile.png)
![Show Page](/client/src/images/show-page.png)
![Mobile and Dark Mode](/client/src/images/mobile-dark.png)

---
### Challenges
---
This was each of our first team projects using Github branches, so the first challenge we faced was making sure we all knew how to make our commits and merges without erasing other people's work. Luckily we did not have any Github issues.

We each faced and conquered solo challenges as well.

Rob's biggest challenge was the intelligent searchbar that filters by searching the name and combines it with flower-color tags.

Jackie's biggest challenges were creating the Add Plants and Edit Plants forms and getting the comments section to work well on the PLants Show page.

Philip's biggest challenge was image handling. He used React Image Crop for users to be able to crop their profile pictures into squares on desktop in the Edit Profile page. On mobile, the crop functionality is not enabled. On the Plant Add and Plant Edit page, the added images are automatically centered and cropped into squares, making it so only square plant images populate the site.

---
### Wins
---
The biggest win was everything. We accomplished a lot and are proud of ourselves!

---
### Ideas for Future Improvements
---
Making it so that the user can update his/her username. Currently we left this option out because it doesn't change the username for all the posts and comments that the user made, so users would encounter 404 pages when clicking on old usernames.

Error handling and error messages are there but could be more descriptive

Favoriting plants from the homepage is something that could be added.

Another thing would be to incorporate more types of tags into the intelligent searchbar.

Another thing we didn't quite get to were comment replies.

... You tell us! We've been looking at this too long and are zonked — you're the one with fresh eyes!