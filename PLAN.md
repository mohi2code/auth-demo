# Development Plan

* [x] Setup.
    * [x] setup express json server.
    * [x] config .env variables.
    * [x] setup mongodb.
    * [x] config error handling & reporting.
    * [x] setup bootstrap.
    * [x] plan dark mode & start setup.

* [x] configure database.
    * [x] migrate db.
    * [x] seed db.

* [ ] User can register with new account.
    * [x] POST /api/register.
        * [x] validate req body.
        * [x] check if user already exists.
        * [x] hash the password.
        * [x] store user in db.
    * [ ] /register screen.
        * [ ] responsive grid layout.
        * [ ] dark mode switch button.
        * [ ] form.

* [ ] User can login.
    * [ ] POST /api/login.
        * [ ] validate req body.
        * [ ] check if user exists in db.
        * [ ] check if password matches.
        * [ ] set cookie / jwt
    * [ ] /login screen.

* [ ] User can login or register with google.
    * [ ] Passport.js

* [ ] User can sign out.
    * [ ] delete token from client side.

* [ ] User can view profile details.
    * [ ] GET /api/user/:id.
    * [ ] /user/profile screen

* [ ] User can edit profile details.
    * [ ] PUT /api/user/:id
    * [ ] /user/profile/edit

* [ ] User can upload avatar.
    * within PUT /api/user/:id
    * view on /user/profile screen.
