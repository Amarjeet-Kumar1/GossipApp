# GossipApp

<img src="https://github.com/Amarjeet-Kumar1/GossipApp/blob/main/screenshots/chat.png" width="100%">

A complete realtime messaging web app (Mobile responsive) with video call feature using React Js as the front end and Node Js as the back end, MongoDB as the database and Cloudinary as data storage.

## **Used Technologies:**<br/>

a) **Front End**: React Js, Axios, Socket Client, Peer JS, React Spring.<br/>
b) **Back End**: Node Js, Redis, Cluster, Socket.io, Mongo DB, Peer and Express, Cloudinary.

### Initial Setup:

Create a .env file inside of client and server folders respectively:

**- client/.env**

```
VITE_SERVER_URL=http://localhost:8080
VITE_FRONTEND_URL=http://localhost:5173
VITE_PEER_URL=localhost
VITE_PORT=8080
```

**- server/.env**

```
MONGO_PASSWORD=<your_mondodb_password>
MONGO_USERNAME=<your_mongo_username>

GAUTH_CLIENT_ID=<Your_gauth_client_id>
GAUTH_CLIENT_SECRET=<Your_gauth_client_secret>


JWT_REFRESH_SECRET=<Your_jwt_refresh_secret>
JWT_ACCESS_SECRET=<Your_jwt_access_secret>


CLOUD_NAME=<Your_cloudinary_name>
CLOUDINARY_KEY=<Your_cloudinary_key>
CLOUDINARY_SECRET=<Your_cloudinary_secret>

FRONTEND_URL="http://localhost:5173"
REDIS_URL=<Your_redis_url>

PORT=8080
```

## Installation:

- In server run:<br>
  `npm i && npm run dev`

- In client run:<br>
  `npm i && npm run dev`

<br>
<br>
