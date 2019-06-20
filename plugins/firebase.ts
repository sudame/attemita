import firebase from 'firebase';

if (!firebase.apps.length) {
    console.log(        {
        apiKey: process.env.APIKEY,
        authDomain: process.env.AUTHDOMAIN,
        databaseURL: process.env.DATABASEURL,
        projectId: process.env.PROJECTID,
        storageBucket: process.env.STORAGEBUCKET,
        messagingSenderId: process.env.MESSAGINGSENDERID,
        appId: process.env.APPID,
    });
    firebase.initializeApp(
        {
            apiKey: process.env.APIKEY,
            authDomain: process.env.AUTHDOMAIN,
            databaseURL: process.env.DATABASEURL,
            projectId: process.env.PROJECTID,
            storageBucket: process.env.STORAGEBUCKET,
            messagingSenderId: process.env.MESSAGINGSENDERID,
            appId: process.env.APPID,
        }
    );
}

export default firebase;
