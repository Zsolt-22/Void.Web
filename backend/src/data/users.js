const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'z4340742@gmail.com',
    password: 'Aatrox22', // Will be hashed in pre-save
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false,
  },
];

module.exports = users;
