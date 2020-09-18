## Auth Demo

* [x] Register.
    * [x] POST /register.
        * [x] validate req body.
        * [x] check if user already exists.
        * [x] hash the password.
        * [x] store user in db.
    * [x] GET /register.
* [x] Login.
    * [x] POST /login.
        * [x] validate req body.
        * [x] check if user exists in db.
        * [x] check if password matches.
        * [x] generate login token & send it to user.
    * [x] GET /login.
    