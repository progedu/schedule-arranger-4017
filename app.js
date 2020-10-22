var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');


// モデルの読み込み
var User = require('./models/user');
var Schedule = require('./models/schedules');
var Availability = require('./models/availability');
var Candidate = require('./models/candidate');
var Comment = require('./models/comment');

User.sync().then(() => {    // sync関数：モデルに合わせてデータベースのテーブルを作成する関数. テーブルの作成が終わった後に行う処理を無名関数で記述
  Schedule.belongsTo(User, {foreignKey: 'creatdeBy'})    // schedule が user の従属エンティティと記述. schedule の createdBy を user の外部キー 
  Schedule.sync();    
  Comment.belongsTo(User, {foreignKey: 'userId'});    // Comment の userId は user の 外部キーとして、テーブルを作成
  Comment.sync();
  Availability.belongsTo(User, {foreignKey: 'userId'});    // Availability の userId は　user の外部キーとしてテーブルを設定
  Candidate.sync().then(() => {    // 候補日のデータテーブルを作成
    Availability.belongsTo(Candidate, {foreignKey: 'candidateId'});    // availability の candidateId を candidate の外部キーとして設定
    Availability.sync();
  });
});

var GitHubStrategy = require('passport-github2').Strategy;
var GITHUB_CLIENT_ID = '2f831cb3d4aac02393aa';
var GITHUB_CLIENT_SECRET = '9fbc340ac0175123695d2dedfbdf5a78df3b8067';

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});


passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/auth/github/callback'
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      User.upsert({    // upsert：update と insert の造語. 渡されたデータがすでにテーブルにあれば更新 / なければ挿入
        userId: profile.id,    // userId に 取得したID
        username: profile.username   // userId に取得した名前
      }).then(() => {
        done(null, profile);
      });
    });
  }
));

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'e55be81b307c1c09', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
  });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
