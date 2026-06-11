const express = require ('express');
const app = express();
app.use(express.json());
const cors = require('cors')
app.use(express.json())
app.use(cors())                  
app.get('/users', (req, res) => {// res.json() 
 res.json([
        { id: 1, name: 'Ahmed', email: 'ahmed@example.com' },
        { id: 2, name: 'Sara',  email: 'sara@example.com' }
    ]);
});
app.post('/users', (req, res) => {
    const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email required' });
    }
     const newUser = { id: 3, name, email };
    res.status(201).json(newUser);

});
app.listen(3000, () => {
    console.log('Server running on  http://localhost:3000');
});
