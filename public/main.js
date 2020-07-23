var fire_buzzer = fire_buzzer || ((namespace) => {

    namespace.handleErrors = (error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
    }

    namespace.refs = {};

    namespace._get_refs = () => {
        namespace.refs.buzzerRef = firebase.database().ref('buzzer');
        namespace.refs.adminsRef = firebase.database().ref('admins');
    }

    namespace.addEventListeners = () => {
        document.getElementById('btnBuzzer').addEventListener('click', namespace.handleClicks.btnBuzzer);
        document.getElementById('btnReset').addEventListener('click', namespace.handleClicks.btnReset);
        document.getElementById('btnAdminLogin').addEventListener('click', namespace.handleClicks.btnAdminLogin);

        namespace.refs.buzzerRef.on('value', namespace.onBuzzerChange);
    }

    namespace.disableBuzzer = () => {
        document.getElementById("btnBuzzer").setAttribute('disabled', true)
    }

    namespace.enableBuzzer = () => {
        document.getElementById("btnBuzzer").removeAttribute('disabled')
    }

    namespace.handleClicks = {
        btnBuzzer: () => namespace.onBuzzerClick(),
        btnReset: () => namespace.refs.buzzerRef.set(''),
        btnAdminLogin: () => namespace.adminLogin()
    }

    namespace.adminLogin = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((response) => {
            namespace.refs.adminsRef.once('value').then((data) => {
                const admins = data.val().split(',');
                if (admins.includes(response.user.email)) {
                    namespace.activateResetButton()
                }
            }).catch(namespace.handleErrors);
        }).catch(namespace.handleErrors);
    }

    namespace.onBuzzerClick = () => {
        const name = document.getElementById('txtName').value || "Unknown";
        namespace.refs.buzzerRef.set(name);
    }

    namespace.activateResetButton = () => {
        document.getElementById('btnReset').classList.remove("hiddenButton");
    }

    namespace.onBuzzerChange = (snapshot) => {
        const buzzerValue = snapshot.val();
        console.log(buzzerValue);
        if (buzzerValue) {
            namespace.disableBuzzer();
        } else {
            namespace.enableBuzzer();
        }
    }

    namespace.onLoad = () => {
        firebase.auth().signInAnonymously().then(() => {
            namespace._get_refs();
            namespace.addEventListeners();
        });
    }

    return namespace;
})({});