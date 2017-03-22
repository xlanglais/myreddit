Michel's Reddit
===============

## Intro
Sorry it took so long, I am still learning and wanted to try a few different options.
My application is probably a lot more complicated than it should but I tried to include as many features as I could.
This project was really good for this purpose.

There are a few bugs here and there.
I also had problems with setting my testing environment.
But it is time to submit it!!!

Development
* Linux Ubuntu 16.10 (Windows VirtualBox)
* IntelliJ
* Tested on Chrome (Linux+Windows)

## Features

Required
* title
* link to the post/site
* thumbnail if it exists
* user who posted it
* time submitted
* link to the comments
* auto refresh every minute with page position

Added
* save current tab (localStorage)
* save current subreddit/topic (localStorage)
* add/remove subreddits and update combobox (localStorage)
* save list of subreddits (localStorage)
* 6 different ways of showing lists
* time remaining shown before update
* manual update button

To do
* add buttons to get next/previous 25 entries
* add options (number of retrieved entries, size of text/image, ...)
* preview when available (like original reddit)
* add menu items to the triple bar icon in the tab section
* complete the Slideshow properly
* optimize for mobile

## Bugs/Problems
* sometimes the page is not shown (URI signature match failed), need to investigate
* problem in UL/Display when description is too long
* problem in Slideshow when there is no image, an underscore is added
* the styles are sometimes directly in the html, move them to the <style> tag
* button tooltips leave a rectangle after the tooltip disappears

## Design
To hold the data I decided to go with a class that I would instantiate as a singleton every time the page is loaded.
I am not sure if this is the proper way to do this, but it seemed the simplest and cleanest.
When I need to "massage" the server call data, I can do it inside that class.

Because I wanted to practice with different UI designs, I have 6 different ways of showing the reddit stories.
I wanted to see the pros and cons for each.
The "flex" one seems to be the easiest to implement with the best result.
It probably depends how compatible it is with the older browsers that need to be supported.

I did not spend a lot of time with the widgets at the top of the page to load the subreddit/topic.
I think I can do much better than this.
On update, I remove all the old reddit rows and add the new ones dynamically, I am not sure if there is a better way of doing this.

##  Testing
I had problems setting my design environment.
I have the file to do the testing.
I will be working on this, but in the meantime here is what I would do.

I only have one server call with optional parameters.
I would like to test the different possibilities for the parameters.
Also if the call does not complete properly, I would like to handle it which I do not right now.

I created a few generic methods to create/remove html elements.
I would like to test them so that I am sure they are working in all the different scenarios.

Concurrency problems can happen with this program, I read about testing frameworks that support concurrency.
But I would need to read more on this.
Using reactive programming should fix this problem (I would hope so).

## Reactive Programming
I have no experience with reactive programming, but I started to read about it and I am very excited.
I really want to start working on this as soon as possible.
I am afraid that your questions are too specific, for now I would only be guessing the answers.
While I think I understand the broad principles, I am still not sure how to approach reactive design.
Also one thing I know with paradigm shifts is that it usually brings new problems and the learning curve can be very steep.
Having experts knowing the new technology would be a great advantage.

a. What events should exist? Include meaningful names and a schema of the event.
UI events (click, drag, resize, ...), server events (new data, error, ...)

b. How should application views be rendered?
Reacting to events. When the data changes the UI should update automatically.

c. What would the applications state look like and how would state changes be handled?

d. What reactive-friendly patterns might help manage asynchronous logic?

## Github
I did not have any experience with Github, but this is something I wanted to do for a long time.
This was a great opportunity for me to learn, I want to do all my home development on it.

## Conclusion
I really enjoyed working on this project, it got me to work on a few things I really wanted to do.
I am also very interested in reactive programming, that is what I am going to try next.
I have some experience with ember.js and from what I read the computed properties and observers are really reactive programming techniques.


Michel