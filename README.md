# Project 3: Plantpedia

## Overview
This was the third project for the Software Engineering Immersive course with GA, which consisted of a full-stack group project built using the MERN stack.

You can find the deployed version of the project [here](https://plant-pedia.herokuapp.com/).

![Homepage](/client/src/images/home-screen.png)
![User Profile](/client/src/images/user-profile.png)
![Show Page](/client/src/images/show-page.png)

## Navigation

* [Brief](#the-brief)
* [Technologies](#technologies)
* [Planning](#planning)
  * [Features](#features)
  * [Wireframing](#wireframing)
* [Coding](#coding)
  * [Search Feature](#search-feature)
  * [Favorites Feature](#favorites-feature)
* [Reflection](#reflection)
  * [Challenges](#challenges)
  * [Key Learnings](#key-learnings)
* [Future Features](#future-features)
* [Credits](#credits)

## The Brief

**Timeframe:**
* 1 week

**General Project Brief:**
* A full stack website that stores user-generated data in a MongoDB database
* A React frontend that is connected to the backend
* User registration, login, and authentication

## Collaborators

Jacqueline Zhou - [Github](https://github.com/jacqizee/)
Philip Sopher - [Github](https://github.com/psopher/)
Rob Green - [Github](https://github.com/greezyBob/)

## Technologies 

* MERN Stack (MongoDB, Express.js, React, Node.js)
* React Router
* JavaScript (ES6+)
* Mongoose
* JSON Web Token / bcrypt
* Material UI (MUI)
* HTML5, CSS3, and SASS
* Axios
* VSCode
* Eslint
* Git & GitHub
* Insomnia
* Trello for Project Management
* Third Party Dependencies:
  - react-image-crop
  - moment.js

## Planning

### Features
* Homepage - index of all plants with a search bar that allows users to filter by plant characteristics (ex. flower color)
* Navbar - allow users to navigate across the different pages on the site
* User Login/Register - login/register to website
* User Profile - view added, favorited, and edited plants
* Edit User Profile - edit user profile, update profile picture
* Plant Show Page - detailed view of plant, where you can favorite a plant
* Add/Edit Plant Page - users can add or edit plants
* Editor Application - users can apply for editor rights for editing plants
* Mobile-Friendly/Responsive Web Design
* Dark Mode

### Wireframing

![Plantpedia Wireframe]()

## Coding

We utilized Trello to divide up different parts of the application, while also creating a list of any bugs or features we noticed that should be addressed.

### Back-End
We initially worked on coding out the back-end of our project in a group of three. As we continued to develop the application, we added and updated the back-end as needed.

Areas I implemented on the back-end individually included:

#### Populating Nested Virtual Fields for Plant Show Page
Populated a virtual field within a virtual field was initially was a bit difficult as we did not understand how or if this was possible, but by reading through the Mongoose documentation I was able to find and populate the fields we desired.
```
    // Retrieve a plant and populate virtual fields, then populating virtual fields within virtual fields
    const plant = await Plant.findById(id)
      .populate('ownerUsername', 'username')
      .populate('lastEditUsername', 'username')
      .populate({
        path: 'comments',
        populate: {
          path: 'image',
          select: 'image'
        }
      })
```

#### Email Validation:
Validating emails before they entered the database by checking for the presence of both an '@' and a '.'. Tying this in with an email input field on the front-end and we have greater certainty that a user is entering a valid email.
```
  // Making sure the email address provided when registering is a valid email address with pre-validation conditions
  userSchema
  .pre('validate', function (next) { 
    if (this.isModified('email') && (this.email.indexOf('@') === -1 || this.email.indexOf('.') === -1)) { 
      this.invalidate('email', 'does not contain an email')
    }
    next()
  })
```

### Front-End

We decided to divide up different front-end pages across the three of us. We coded alongside one another on Zoom so that in any instance one of us ran into a bug or needed help, the rest of us were readily available to chip in and provide suggestions or talk through potential ways to tackle a problem.

Division of Work:
* Jackie - Add/Edit Plant Pages (form inputs and submittion, metric/imperial measurement slider, styling), Plant Show Page (comment filtering, pagination, and styling), dark mode configuration
* Rob - Home Page (search bar, flower color filter, styling), Plant Show Page (favoriting, base styling), dark mode setup
* Philip - Login/Register pages, Edit User Profile (profile picture upload, image handling), Add/Edit Plant Pages (upload image feature)

## Reflection

### Challenges

### Key Learnings

One major takeaway from this group project was learning how to communicate and work with other people's code. Different people have different ways to approach a problem, so working together in a group allowed me to better train my skill for reading and understanding the intent and inner workings of someone elses code, then learning to build upon the foundation they've established to address any bugs or issues. This reinforced the need for leaving behind concise but informative comments, so others can more easily decipher what the thought process and purpose of different components or functions that are written, reducing the time spent needed to decipher exactly what's going on and where.

Another key takeaway for me was the importance of forward thinking design and planning, while also keeping an open mind and a certain bit of flexibility to our though processes.

## Future Features

* More descriptive error handling
* Favoriting plants directly from the homepage rather than just on the Plant Show page
* More robust filter options for our search bar
* Comment replies
* Splash page

## Credits:

* Images
  * 

* Fonts
  * 
