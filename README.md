# Project 3: Plantpedia

---
### Overview
---
This project is Philip, Jacqueline, and Rob's third fully developed exercise at General Assembly's Software Immersive course.

The assignment was to create a full stack website comprised of a backend that uses express to store user-generated data on a mongodb database and a frontend that uses React and React-based frameworks. The project was to be completed by a three-person team within one week.

We chose to create "A Day at the Zoo" because because we both like animals, and we found an [API](https://zoo-animal-api.herokuapp.com) that was comprehensive and free. 

The interface includes 3 pages:
* Home.js is the root page, where users are welcomed to the site and presented a button to start viewing animals.
* AnimalsIndex.js is a list of 10 randomly generated animals. If the user clicks on the animal, that animal is spotlighted at the same /animals endpoint. 
* All clicked animals are added to the MyJourney.js page, in case the user wants revisit an animal she specifically liked. As with AnimalsIndex.js, in MyJourney.js, a clicked animal is spotlighted at the same /myjourney endpoint 

Are you curious to see the end result? [Check out the site.](https://a-day-at-the-zoo.netlify.app/) 

---
### Brief
---
* Render a site in the browser that consumes a public API.
* Create a React site that utilizes components-based structure.
* Stick with KISS (Keep It Simple Stupid) and DRY (Don't Repeat Yourself) principles.
* Write a readme.
* Commit early and often to Github.
* Complete it in under 48 hours.

---
### Technologies Used
---
* HTML
* CSS
* JavaScript
* Git and GitHub
* React
  - React hooks: useState, useEffect, BrowserRouter, Route, Routes, Link, useNavigate
* Bootstrap
  - Components: Container, Row, Col, Card, Button
* Axios

---
### Approach
---


#### State Variables
In order to manipulate the data and keep it current, it was important to define state variables and useEffects. The state variables that needed to be used across multiple components were defined in the App.js and then passed down as props into the components. These were: 
* myJourney: an array of objects that tracks every animal that the user has clicked
* currentAnimal: an object with the data containing the recently-clicked animal. When currentAnimal is not null, this is a trigger to change the page from an animal list to a spotlight on the specific animal.
* filters: an object that tracks values in the dropdown menu and searchbar for filtering.
* filteredJourney: an array that only contains the elements in the myJourney array that match the filters. 
* types: A list of the types (mammal, reptile, etc) of animals that have been selected, which is useful for creating the filters dropdown menu.

There are also component-specific state variables. In AnimalsIndex, there is:
* animals: a list of 10 random animals that were returned from the API call. The API always returns random animals, so this list is updated every time the users navigates in and out of the page, using the navigate dependency in a useEffect.


#### Passing and Updating Data
As said above, the data is called from the API in the useEffect in AnimalsIndex.js that has navigate as a dependency. The API gives us a list of 10 animals with a lot of information. The variables we keep end up using are are id, image link, name, Latin name, habitat, type, geographic range, and diet.

In AnimalsIndex, we destructure and display the animals inside a .map() method. 

A user then clicks on a specific animal, and the state for currentAnimal is updates, as is the myJourney array. It is important to pass in an implicit arrow function into onClick so that the function does not run when it's called:

```onClick={() => handleClick(animal)}```

The ternary at the beginning of the AnimalsIndex return triggers when currentAnimal is updated to a non-null value, and the view is changed to one that spotlights the clicked animal. When the user clicks "Back to animals", the currentAnimal is reset to null, and the animalsIndex list shows with a different set of 10 random animals. The myJourney array updates with ever animal spotlighted, and if a random animal is shown that was already viewed, a checkmark appears next to it.

In the My Journey section, a user is shown a list of animals they have already visited. This list is populated from the myJourney state variable. At the bottom of the page, the user can press the "Reset journey" button to empty the myJourney array, and users can remove any animal from the journey by clicking the "remove from journey" button when the animal is spotlighted. The my journey section has a search bar and dropdown menu to filter by type or name of animal.

---
### Screenshots
---
![Homepage](/home-screen.png)
![Animals](/animals-index.png)
![My Journey](/my-journey.png)
![Show Animal](/animal-show.png)

---
### Challenges
---
The biggest challenge was that our API wouldn't let us fetch data by ID — we were only allowed to "get" a collection of random animals. To solve this we had to save data to arrays using useState and useEffect defined in the App.js.

---
### Wins
---
Creating a site using React is a huge confidence boost for us! We also love the zoo and animals, so it was a win in terms of being able to look at animal photos for 48 hours.

---
### Learning
---
The most important thing we learned was how to keep track of state variables across multiple pages.

It was also important learn how to use implicit onClick methods such that they don't run every time they are called an so that information can be passed into them.

---
### Ideas for Future Improvements
---
The images were all different sizes, so we made a standardized size for the image element in the Cards, but sometimes it cuts off important image elements, so figuring this out would really help.

We also didn't do any error handling. Given more time, this is the first thing we would add in.