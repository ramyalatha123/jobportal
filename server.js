const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const Application = require('./models/Application');
const Job = require('./models/job');
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://bodduramyalatha22csm:ramya@cluster0.0zp4v3l.mongodb.net/jobportal?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected ✅');
}).catch((err) => {
    console.error('MongoDB connection error ❌', err);
});

// User Schema
// User Schema
const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }  // <-- add role field
}));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
})


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(session({
    secret: 'secretkey123', // change to a strong secret key
    resave: false,
    saveUninitialized: false
}));
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next(); // user is logged in, go ahead
    } else {
        res.redirect('/signin.html'); // user not logged in, send to signin
    }
}
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        next(); // User is admin, continue
    } else {
        // If it's an API call (fetch), return JSON
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            res.status(403).json({ success: false, message: 'Access Denied ❌ Admins Only' });
        } else {
            // If it's a normal browser request, send alert
            res.status(403).send(`<script>alert('Access Denied ❌ Admins Only'); window.location.href='/index.html';</script>`);
        }
    }
}


app.get('/index.html', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



// Serve signin page
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

// Serve signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Handle signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.send(`<script>alert('User already exists ❌'); window.location.href='/signup';</script>`);
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.send(`<script>alert('Registration Successful! 🎉'); window.location.href='/signin';</script>`);
});

// Handle signin
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email, password: password });

    if (user) {
        req.session.user = user; // Save user info in session
        res.redirect('/index.html');  // Redirect to portal
    } else {
        res.send(`<script>alert('Invalid email or password ❌'); window.location.href='/signin';</script>`);
    }
});
// server.js

app.get('/check-admin', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        res.json({ isAdmin: true });
    } else {
        res.json({ isAdmin: false });
    }
});

app.post('/apply', async (req, res) => {
    const { name, email, message } = req.body;
  
    try {
      const newApplication = new Application({ name, email, message });
      await newApplication.save();
      res.json({ success: true, message: 'Application submitted successfully' });
    } catch (error) {
      console.error('Error saving application:', error);
      res.status(500).json({ success: false, message: 'Failed to submit application' });
    }
  });
// Add new Job
app.post('/add-job', isAuthenticated, isAdmin, async (req, res) => {
    const { title, company, location, experience, description, category, lastDate } = req.body;  // added location, experience
  
    try {
      const newJob = new Job({
        title,
        company,
        location,
        experience,
        description,
        category,
        lastDate
      });
  
      await newJob.save();
      res.json({ success: true, message: 'Job added successfully' });
    } catch (error) {
      console.error('Error adding job:', error);
      res.status(500).json({ success: false, message: 'Failed to add job' });
    }
  });
  
  
  



// Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Session destroy error', err);
        }
        res.send(`<script>alert('Logged out successfully ✅'); window.location.href='/signin';</script>`);
    });
});
// Show all applications - Admin dashboard
app.get('/admin/applications', isAuthenticated, async (req, res) => {
    try {
        const applications = await Application.find();
        res.json(applications); // send all applications as JSON
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/admin', isAuthenticated, isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Route to get all jobs by category
app.get('/get-jobs', async (req, res) => {
    try {
        const fresherJobs = await Job.find({ category: 'fresher jobs' });
        const partTimeJobs = await Job.find({ category: 'part-time' });
        const internshipJobs = await Job.find({ category: 'internships' });

        res.json({
            fresherJobs,
            partTimeJobs,
            internshipJobs,
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).send('Server Error');
    }
});




// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


