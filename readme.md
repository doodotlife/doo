<img src="/assets/images/logo.jpg" width="144px">

Manage your time,
together with your friends.
<hr>
## Intro
Link to live site:

[http://www.doo.life/](http://www.doo.life/)

doo. is a online platform for you to manage your time,
along with your friends. Users are allowed to create their personal deadlines and anniversaries as events. The events will be displayed in the form of cards, with a optimized count down provided. Users are also allowed to search among events by title, or search among users by username or email, follow other users, and see their countdowns. Interactions like comments and likes are also provided.

## Design
The website is consist of login page, sign up page, home page, search page, single event page, single user page, and settings page. Admin panel is also provided for admin users, to provide a overview of the site.

### Components
#### Right navigation bar
Right navigation bar is rendered up on user's identity. If user is not logged in, the nav bar displays login and sign up. When user is logged in, the nav bar displays links to user's personal page, search page and settings page. A log out link is also provided. For admins, there is also a link to admin panel. Whenever the user wants to got back to home page, click on the logo.

#### Event card
Event card provides a heading of event title, a text display of event's date (and time), tags and a countdown.

#### Interaction bar
Interaction bar provides interaction buttons for users to interact with the card. For events, there are comment and like buttons. Delete buttons shows up when user owns the event, or when user is a admin. On home page, comment button calls a comment input bar that allows user to send comments. To view comments, users need to click on the event body to single event page. (Yes we took TA's advice! Thank you! :) ) For users on search page, interaction bar provides a follow/unfollow button. Delete button is shown when user is admin. For users on single users page, interaction bar provides event counts and follower counts, works as tabs. Delete button is shown when user is admin.

### Pages
#### Login page
![00](/readme/00.png)
^ Login page

The login page contains a logo, a description, a login form, and a hyperlink to sign up page.

#### Sign up page
![01](/readme/01.png)
^ Sign up page

The sign up page contains a sign up form. Password confirmation is provided for both client side and server side in case that some browsers does not support client side validation. User are also allowed to choose a color, which will be used to set UI background color.

#### Home page
![02](/readme/02.png)
^ Home page

The home page contains a add-event input bar, which calls a add event table on clicks. The add event table provides entry of event title, event date, event type and privacy option. Event time will show up on the selection of type "deadline".

The following part contains user's events and user's followed users' events. each event is provided with a interaction bar.

#### Search page
![08](/readme/08.png)
^ Search page

The search page contains a search input bar, and a area of text hints. In case of response, the area below the search bar is used to display search result, divided into Events and Users.
![09](/readme/09.png)
^ Event results

![10](/readme/10.png)
^ User results

There is also a little tile that shows the color selection of the user. The search bar uses regular expression, and is case insensitive.

#### Single event page
![04](/readme/04.png)
^ Single event page

![05](/readme/05.png)
^ Edit event page

The single event page is and extension of event card. Besides information provided o event cards, it also displays all the comments of the event.

#### Single user page
![06](/readme/06.png)
^ Single user page (events)

Single user page provides information of a user, including username, email, birthday, gender.

![07](/readme/07.png)
^ Single user page (followers)

Admins will get an admin tag on the upper right corner. The background color of the page is of the target user's selection, instead of current user's color.

#### Settings page
![11](/readme/11.png)
^ Settings page

Settings page is where we let user update their information. critical information like username and email are not allowed for changing. However, change of password is also allowed.

There is also a section where users are allowed to email issue reports to our group email. Credit information is also provided here.

#### Admin Panel
![14](/readme/14.png)
^ Admin Panel

Admin panel provides three tables. The first one is the table for user counts and event counts.

![15](/readme/15.png)
^ Admin Panel

The second table provides information of all users, and the last one provides information of all events. Users table provides links to user page, and email hyperlink. Date the user joined doo and admin tag is also displayed. Event table provides a short ID of event(just like github commit IDs, but mongoDB has the first few chars duplicated, but it doesn't matter).

### Other Details

#### Multi-platform support
<img src="/readme/mobile-00.png" width="32%">
<img src="/readme/mobile-01.png" width="32%">
<img src="/readme/mobile-02.png" width="32%">

- App made with responsive design. A mobile nav bar will show on mobile devices.
- App is also made to be a iOS Web App. By visiting site on mobile Safari, user can add app to home screen, and works like a local app. (Works on Android as well, other platforms not tested)
- Display issue may occur when using iPads (landscape), iPad Pro 12 inch (portrait)

#### Admin privilege
- Admins are granted to delete events, delete users, and access the admin panel.
- Admin permission are given by accessing the database and change the adminPriviledge boolean value.
- Admin are not allowed change user's information, as well as event info and user's password.

#### Error handling
![18](/readme/18.png)
^ Error handling page
- Errors are sent to clients with a user-friendly error message.
- In some pages where there is a AJAX call, error may be displayed in a error bar, which shows up on errors, with a user-friendly error message.
- Errors may also be sent with a error handling page, with a user-friendly error message.

#### Privacy and security
- Passwords are stored as a hashed value. Event admins and developers cannot access user's password.
- For each action user's identity is checked.
- Private Events will be filtered in actions like search or getting home page. Will be displayed if session user is the owner of the event. Admins are also blocked from looking into user's private events.
- Without logging in, users are allowed to visit another user's page and event page. However, actions like follow/unfollow, like, comment are blocked.

#### Compatibility issues
- App works perfectly on Google Chrome
- For Safari:
    -   Nav bar text won't change color until user hovers on it.
- For Mozilla Firefox on CDF machines (not recommended):
    -   Clicking on new event button won't call add event table.

## Credits and quotes
- notfound.jpg sketched by Jiang Jiacheng (Ajax), inspired by Japanese Manga __Ajin Vol.44__
<img src="/assets/images/notfound.jpg">
- All icons, styles designed and illustrated by Jiang Jiacheng (Ajax)
- jscolor Colorpicker   [http://jscolor.com](http://jscolor.com)
- rgb2hex Converter [http://jsfiddle.net/Mottie/xcqpF/1/light/](http://jsfiddle.net/Mottie/xcqpF/1/light/)
- getContrastYIQ function   [https://24ways.org/2010/calculating-color-contrast/](https://24ways.org/2010/calculating-color-contrast/)
- formatDate function [http://jsfiddle.net/abdulrauf6182012/2Frm3/](http://jsfiddle.net/abdulrauf6182012/2Frm3/)
- parseTimezone function (modified) [http://stackoverflow.com/a/7423831](http://stackoverflow.com/a/7423831)
