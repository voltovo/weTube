import passport from "passport";
import GithubStrategy from "passport-github";
import KakaoStrategy from "passport-kakao";
import { githubLoginCallback } from "./controllers/userController";
import User from "./models/User";
import routes from "./routes";

passport.use(User.createStrategy());
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      redirect_uri: `http://localhost:4000${routes.githubCallback}`,
    },
    githubLoginCallback
  )
);
passport.use(
  new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    clientSecret: process.env.KAKAO_SECRET,
    callbakURL: `http://localhost:4000${routes.kakaoCallback}`,
  })
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
