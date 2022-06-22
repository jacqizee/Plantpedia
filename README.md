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
---

### Front-End

We decided to divide up different front-end pages across the three of us. We coded alongside one another on Zoom so that in any instance one of us ran into a bug or needed help, the rest of us were readily available to chip in and provide suggestions or talk through potential ways to tackle a problem.

Division of Work:
* Jackie - Add/Edit Plant Pages (form inputs and submittion, metric/imperial measurement slider, styling), Plant Show Page (comment filtering, pagination, and styling), dark mode configuration
* Rob - Home Page (search bar, flower color filter, styling), Plant Show Page (favoriting, base styling), dark mode setup
* Philip - Login/Register pages, Edit User Profile (profile picture upload, image handling), Add/Edit Plant Pages (upload image feature)

#### Add/Edit Plant Pages
When putting together the Add/Edit Plant forms, one issue I ran into was handling nested values and deeper nested values with useState. When we initially designed our database, we nested properties within properties within properties, thinking it made sense to group things like Characteristics or Upkeep together. However, the unnecessary grouping complicated updating and accessing values, especially for these forms. This was a lesson that when designing a database, it's important to keep things practical rather than needlessly complicating things.

#### Slider with Unit Conversions
To spice up an otherwise boring form, I added in a slider to handle the Height and Width measurement of a plant, which could handle the user switching between centimeters and inches. To do this, I wrote one function to handle movement on the slider, and one to handle unit changes:

```
export const handleSizeChange = (e, setMatureSize, matureSize, setFormData, formData, unit) => {
  const { name, value } = e.target
  setMatureSize({ ...matureSize, [name]: value })
  if (unit === 'cm') {
    setFormData({ ...formData, [name]: Math.ceil(value / 2.54) })
  } else {
    setFormData({ ...formData, [name]: value })
  }
  
  export const handleUnitChange = (e, matureSize, setMatureSize, setMax, setStep, setUnit) => {
  const { height, width } = matureSize
  setUnit(e.target.value)
  if (e.target.value === 'in') {
    setMatureSize({ height: Math.ceil(height / 2.54), width: Math.ceil(width / 2.54) })
    setMax(150)
    setStep(10)
  } else if (e.target.value === 'cm') {
    setMatureSize({ height: Math.ceil(height * 2.54), width: Math.ceil(width * 2.54) })
    setMax(380)
    setStep(20)
  }
}
```

#### Comment Sorting

To sort comments, I opted to update the comment value of the Plant state, which would re-render the component each time a new sort selection was made. Initially a group member tried to hande the sort with a separate state, but we found that complicated things and was a bit buggy in execution.

```
  const handleDropdown = (e) => {
    setCommentDropdown(e.target.value)
    // If oldest is selected, display oldest -> newest, and vice versa
    if (e.target.value === 'oldest') {
      setPlant({ ...plant, comments: plant.comments.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)) })
    } else if (e.target.value === 'newest') {
      setPlant({ ...plant, comments: plant.comments.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)) })
    }
    updatePageResults(page, plant)
  }
```

#### Comment Pagination
This was my first time attempting to paginate items. I used MUI pagination components to achieve this, and wrote functions to handle when a user navigates to a different page. Since we have only a low volume of comments to deal with, I opted to load the full comment array then simply modify which comments are displayed. In the future, a potential change that could be made is only loading smaller chunks of comment data to reduce the load on our database.

```
  // handle page change
  const handlePageChange = (e) => {
    const { dataset, innerText } = e.target
    let pageNumber
    // Check what button was pressed, a number or an icon (ex right/left arrows)
    if (!innerText) {
      dataset.testid === 'NavigateBeforeIcon' ? pageNumber = page - 1 : pageNumber = page + 1
    } else {
      pageNumber = parseInt(innerText)
    }
    setPage(pageNumber)
    updatePageResults(pageNumber, plant)
  }
```

## Reflection

### Challenges

I found the project very fun and insightful. It allowed to put parts of what we had learned throughout the course to use, but also presenting us with real world problems and tackling creating a project under a short deadline. My key takeaways were:
* When designing a database, it's important to be mindful of how we plan to use the data, and design accordingly
  * Keep things simple and shallow (no need to nest within a nest within a nest if there's no justification) 
* Clean, commented code is valuable not just to keep yourself organized, but to allow others to more easily read, digest, and build upon your code
* Plan, plan, plan. More time spent planning helps eliminate frustration and guess-work down the line.

### Key Learnings

One major takeaway from this group project was learning how to communicate and work with other people's code. Different people approach problems differently, so working together in a group allowed me to train my skill for reading and understanding the someone elses code and thought process, to then build upon the foundation they've established. This reinforced the need for leaving behind concise but informative comments, allowing others to more rapidly understand the purpose of different components/functions, reducing the time spent needed to decipher exactly what's going on and where.

## Future Features

* More descriptive error handling on forms
* Favoriting plants directly from the homepage rather than just on the Plant Show page
* More robust filter options for our search bar
* Reply to comments
* Splash page
* Footer

## Credits:

* Images
  * Plant images for seed data - [The Spruce](https://www.thespruce.com/)

* Fonts
  * [Google Fonts](https://google.com/fonts)
