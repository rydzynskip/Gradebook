const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      Teacher = require('./models/teacher'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
      flash = require('connect-flash'),
      createError = require('http-errors'),
      path = require('path'),
      logger = require('morgan'),
      sassMiddleware = require('node-sass-middleware'),
      methodOverride = require('method-override'),
      seedDB = require('./data');

//==================================================================
// Database Setup
//==================================================================
mongoose.connect('mongodb://localhost/grade_book', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
seedDB(); // Seeds the database


//==================================================================
// View Engine Setup
//==================================================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//==================================================================
// General Setup
//==================================================================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));


//==================================================================
// Auth Setup
//==================================================================
app.use(session( {
  secret: 'This is the secret',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Teacher.authenticate()));
passport.serializeUser(Teacher.serializeUser());
passport.deserializeUser(Teacher.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});


//==================================================================
// Route Setup
//==================================================================
const indexRouter           = require('./routes/index'),
      classesRouter         = require('./routes/classes'),
      studentsRouter        = require('./routes/students'),
      classesStudentsRouter = require('./routes/classesStudents'),
      assignmentsRouter     = require('./routes/assignments');

app.use('/', indexRouter);
app.use('/classes', classesRouter);
app.use('/students', studentsRouter);
app.use('/classes/:id/students', classesStudentsRouter);
app.use('/classes/:id/assignments', assignmentsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
