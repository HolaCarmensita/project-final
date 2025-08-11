**11.08**
- [] set up the project, install dependenices 
- [] define slices 
- [] deploy
- [] a name for the project

=== 


**Slices** 

- seting up project architecture and components 
- install dependecies 

- navigating the 3D enviroment
- implementing the design of an idea card & navigate through the ideas using arrow btns 



- user register / log in forms 
- like/ save an idea

- a user should be able to post an idea
- a user should be able to open and edit an idea
- a user should be able to open connected idea

- Connect through an idea to other user 
- click on a sphere to oepn an idea
- the user should be able to navigate in the 3d space in mobie with the joystick
- user should be able to navigate through their profile - liked ideas, connections –  
- user shuld be ablte to get to their profile and change their details







**project architecure**


PROJECT-FINAL/
├─ frontend/ # React app (Vite or CRA)
│ ├─ public/
│ └─ src/
│ ├─ app/
│ │ ├─ App.jsx
│ │ ├─ main.jsx
│ │ └─ router.jsx # React Router config
│ ├─ pages/ # Route-level views
│ │ ├─ Home3D/ # Landing with 3D space
│ │ │ ├─ Home3D.jsx
│ │ │ └─ Home3D.test.jsx
│ │ ├─ Idea/ # /idea/:id
│ │ │ └─ IdeaPage.jsx
│ │ ├─ Profile/
│ │ │ └─ ProfilePage.jsx # tabs: My Ideas / Liked / Connections
│ │ └─ Auth/
│ │ ├─ Login.jsx
│ │ └─ Signup.jsx
│ ├─ features/ # Domain slices
│ │ ├─ ideas/
│ │ │ ├─ components/ # IdeaCard, IdeaForm, IdeaList
│ │ │ ├─ api.js # fetchIdeas, createIdea, toggleLike
│ │ │ ├─ hooks/ # useIdeas, useIdea, useLike (custom hook ✔)
│ │ │ └─ types.js
│ │ ├─ connections/
│ │ │ ├─ components/ # ConnectModal
│ │ │ └─ api.js # createConnection
│ │ └─ auth/
│ │ ├─ api.js # login, signup, me
│ │ └─ hooks/ # useAuth (context wrapper)
│ ├─ components/ # Reusable, app-wide
│ │ ├─ ui/ # Button, Modal, Tabs, Toast, Skeleton
│ │ ├─ three/ # 3D: Scene, Bubbles, CameraRig
│ │ └─ a11y/ # FocusTrap, VisuallyHidden, SkipLink
│ ├─ context/
│ │ ├─ AuthContext.jsx # Global state (Context API ✔)
│ │ └─ UIContext.jsx
│ ├─ store/ # (If you use Zustand instead of/besides Context)
│ │ └─ useUIStore.js
│ ├─ services/
│ │ ├─ http.js # axios/fetch base (ext lib ✔)
│ │ └─ email.js # (if frontend triggers email via API)
│ ├─ assets/
│ │ ├─ models/ # .glb/.gltf if any
│ │ ├─ textures/
│ │ └─ icons/
│ ├─ styles/
│ │ ├─ tokens.css # spacing/typography/color scale
│ │ ├─ globals.css
│ │ └─ theme.css
│ ├─ utils/
│ │ ├─ formatters.js # date/time “Today/Now” helpers
│ │ └─ constants.js
│ ├─ tests/
│ └─ index.css
│
└─ backend/ # Node + Express + MongoDB
├─ src/
│ ├─ app.js
│ ├─ index.js
│ ├─ config/
│ │ └─ env.js # loads env, cors, rate-limit
│ ├─ db/
│ │ ├─ connect.js
│ │ └─ models/
│ │ ├─ User.js
│ │ ├─ Idea.js
│ │ └─ Connection.js
│ ├─ middleware/
│ │ ├─ auth.js # JWT verify
│ │ ├─ validate.js # request body validation
│ │ └─ error.js
│ ├─ routes/
│ │ ├─ auth.routes.js
│ │ ├─ ideas.routes.js
│ │ ├─ connections.routes.js
│ │ └─ users.routes.js
│ ├─ controllers/
│ │ ├─ auth.controller.js
│ │ ├─ ideas.controller.js
│ │ ├─ connections.controller.js
│ │ └─ users.controller.js
│ ├─ services/
│ │ ├─ email.service.js # Nodemailer/Resend (ext lib ✔)
│ │ └─ idea.service.js
│ ├─ utils/
│ │ └─ jwt.js
│ ├─ seed/
│ │ └─ seed.js # demo data for presentation
│ └─ docs/
│ └─ api.md # endpoints for README (VG ✔)
├─ .env.example
└─ README.md








