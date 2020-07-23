var fire_buzzer = fire_buzzer || ((namespace) => {

    namespace.handleErrors = (error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
    }

    namespace.refs = {};

    namespace._get_refs = () => {
        namespace.refs.buzzerRef = firebase.database().ref('buzzer')
    }

    namespace.addEventListeners = () => {
        document.getElementById('btnBuzzer').addEventListener('click', namespace.handleClicks.btnBuzzer)
        document.getElementById('btnReset').addEventListener('click', namespace.handleClicks.btnReset)
        document.getElementById('btnAdminLogin').addEventListener('click', namespace.handleClicks.btnAdminLogin)
    }

    namespace.handleClicks = {
        btnBuzzer: () => namespace.refs.buzzerRef.set(true),
        btnReset: () => namespace.refs.buzzerRef.set(false),
        btnAdminLogin: () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                console.log(token);
                console.log(user);
              }).catch(namespace.handleErrors);
        }
    }

    namespace.onLoad = () => {
        let app = firebase.app();

        namespace._get_refs();
        namespace.addEventListeners();

        firebase.auth().signInAnonymously().then(() => {

            const uid = firebase.auth().currentUser.uid

            const buzzerRef = namespace.refs.buzzerRef;
            buzzerRef.on('value', (snapshot) => {
                const buzzerValue = snapshot.val();
                console.log(buzzerValue);
                // if (buzzerValue) {
                //     document.getElementById('btnBuzzer').style = "";
                // } else {
                //     document.getElementById('btnBuzzer').style = "disabled: true";
                // }
            });

          });
    }

    return namespace;
})({});