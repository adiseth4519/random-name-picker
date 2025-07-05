const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.urlencoded({ extended: true }));

const FILE = 'names.json';

function loadNames() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(FILE));
}

app.get('/join', (req, res) => {
  const user = req.query.user?.toLowerCase();
  if (!user) return res.send('No user');
  const names = loadNames();
  if (!names.includes(user)) {
    names.push(user);
    fs.writeFileSync(FILE, JSON.stringify(names, null, 2));
    return res.send(`${user} added ✅`);
  }
  res.send(`${user} is already joined`);
});

app.get('/pick', (req, res) => {
  const names = loadNames();
  if (names.length === 0) return res.send('No one has joined yet');
  const picked = names[Math.floor(Math.random() * names.length)];
  res.send(`🎉 Picked: ${picked}`);
});

app.get('/reset', (req, res) => {
  fs.writeFileSync(FILE, JSON.stringify([]));
  res.send('List has been reset');
});
app.get('/list', (req, res) => {
  const names = loadNames();
  res.send(names.join('\n')); // Plain text, one name per line
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
