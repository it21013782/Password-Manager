const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const port = 8010;

const {encrypt, decrypt} = require('./EncryptionHandler');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'pass123',
    database: 'passwordmanager',
    authPlugins: {
      mysql_clear_password: () => () => Buffer.from('pass123\0')
    }
  });
  
app.post('/addpassword', (req, res) => {
    const { password, website, username } = req.body;
    const { encryptedPassword, iv } = encrypt(password);

    db.query(
        'INSERT INTO passwords (password, website, username, iv) VALUES (?, ?, ?, ?)',
        [encryptedPassword, website, username, iv],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send('Values Inserted');
            }
        }
    );
});

app.post('/decryptpassword', (req, res) => {
    const { password, iv } = req.body;
    const decryptedPassword = decrypt({ encryptedPassword: password, iv });

    res.send(decryptedPassword);
});

app.delete('/deletepassword/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM passwords WHERE id = ?', [id], (err, result) => {
        if (err) {
        console.log(err);
        } else {
        res.send('Password deleted');
        }
    });
});
  
app.get('/showpasswords', (req, res) => {
    db.query('SELECT * FROM passwords', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    }
);