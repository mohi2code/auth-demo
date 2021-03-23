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

* [x] User can register with new account.
    * [x] POST /api/register.
        * [x] validate req body.
        * [x] check if user already exists.
        * [x] hash the password.
        * [x] store user in db.
    * [x] /register screen.
        * [x] implement screen design.
        * [x] configure form submition.
        * [x] client side validation.
            * [x] handle input onKeyUp.
            * [x] handle inputs on submition.
            * [x] handle ajax errors.

* [x] User can login.
    * [x] POST /api/login.
        * [x] validate req body.
        * [x] check if user exists in db.
        * [x] check if password matches.
        * [x] set cookie / jwt
    * [x] /login screen.
        * [x] implement screen design.
        * [x] configure form submition.
        * [x] client side validation.
            * [x] handle input onKeyUp.
            * [x] handle inputs submition
            * [x] handle ajax errors;
        

* [ ] User can login or register with google.
    * [ ] Passport.js

* [ ] User can sign out.
    * [ ] delete token from client side.

* [x] User can view profile details.
    * [x] GET /api/profile.
    * [x] /user/profile screen

* [x] User can edit profile details.
    * [x] PUT /api/user/:id
        * [x] validate request body.
        * [x] new email already exists ? if updated
        * [x] update document.
    * [x] /user/profile/edit

* [ ] User can upload avatar.
    * [x] PUT /profile/image.
        * [x] get image file from req.body (Base64UrlEncoded).
        * [x] upload imgage file to a cloud storage server.
        * [x] output image file URL. 
    * view on /user/profile screen.

* [x] User can change password.
    * [x] PUT /profile/password
