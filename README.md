# Wetube Reloaded

/ -> Home  
/join -> Join  
/login -> Login  
/search -> Search

/users/:id -> See User  
/user/logout -> Log Out  
/users/edit -> Edit My Profile  
/users/delete -> Delete My Profile

/videos/:id -> See Video  
/videos/:id/edit -> Edit Video  
/videos/:id/delete -> Delete Video  
/videos/upload -> Upload Video

---

### Github Login recap

_web application flow to authorize users_

- GitHub ID를 요청하도록 리디렉션
- GitHub에 의해 wetube 사이트로 다시 리디렉션
- 앱이 사용자의 액세스 토큰으로 API에 액세스

_Required Settings_

- OAuth App
- Client ID of OAuth App

---

#### 1. Creating an OAuth App

- user profile > settings > Developer Settings > OAuth app > new OAuth app "click"
- 빈칸 채우고, **callback Url** 중요
- Register application "click"

#### 2. Request a user's GitHub identity

- url : https://github.com/login/oauth/authorize
- a tag의 href를 위의 url로 지정
- Github ID를 요청하기 위해서는 몇몇의 **parameter**가 필요
- sampleUrl : https://github.com/login/oauth/authorize?client_id=9fac726866be2ff14f36&allow_signup=false&scope=read:user%20user:email

##### parameters

| name         |  type  | description                                                                      |
| :----------- | :----: | :------------------------------------------------------------------------------- |
| client_id    | string | **필수**매개변수, OAtuh app 생성 시 부여 받은 Client ID                          |
| scope        | string | 공개된 public 데이터 범위를 넘어선 데이터를 얻고 싶을 때 사용, **공백**으로 구분 |
| allow_signup | string | 인증되지 않은 사용자에게 OAuth 흐름 중에 GitHub에 등록할 수 있는 옵션 여부       |
| user         |        | 프로필 정보에만 읽기/쓰기 액세스 권한을 부여합니다.                              |
| read:user    |        | 사용자의 프로필 데이터를 읽을 수있는 액세스 권한을 부여합니다.                   |
| user:email   |        | 사용자의 이메일 주소에 대한 읽기 액세스 권한을 부여합니다.                       |

#### 3. redirected back to your site by GitHub

- github Id를 sample Url로 요청 > github page에서 authorize "click"
- OAuth app 생성 시 기입했던 callback url로 return
  해당 url로 처리할 수 있도록 서버단의 작업 필요
  sample callback url : http://localhost:4000/users/github/finish
