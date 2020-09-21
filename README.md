# auth-demo
A demo project demonstrating authentication flow, including local authentication and OAuth with Google 

### Functionality
- users can register with an email and provide a password.
- users can login with email & password.
- users can authenticate with a google account.
- users who aren't authenticated can't access /protected page.
- passwords must be more than 8 chars containing capital/small letters, numbers and special chars.

### Prerequisite
- Node.js & mongod
- MongoDB

### Usage
1. clone the repo.
2. run **npm install**.
3. run **npm run dev**.
4. go to **http://localhost:3000/**
