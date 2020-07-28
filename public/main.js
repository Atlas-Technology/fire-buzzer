var fire_buzzer = fire_buzzer || ((namespace) => {

    ///////////////////////////////////////////
    // Variables
    ///////////////////////////////////////////
    namespace.refs = {
        buzzerRef: null,
        adminsRef: null
    };
    namespace.buzzer = null;
    namespace.name = null;


    ///////////////////////////////////////////
    // event handlers
    ///////////////////////////////////////////

    namespace.handleClicks = {
        btnBuzzer: () => namespace.onBuzzerClick(),
        btnReset: () => namespace.refs.buzzerRef.set(''),
        btnAdminLogin: () => namespace.adminLogin()
    }

    namespace.onBuzzerClick = () => {
        const name = document.getElementById('txtName').value || "Unknown";
        namespace.refs.buzzerRef.set(name);
    }

    namespace.handleNameUpdate = (e) => {
        namespace.name = e.target.value;
        namespace.revalidateBuzzerState();
        namespace.setBuzzerWinner();

    }

    ///////////////////////////////////////////
    // Methods
    ///////////////////////////////////////////

    namespace.handleErrors = (error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
    }

    namespace._get_refs = () => {
        namespace.refs.buzzerRef = firebase.database().ref('buzzer');
        namespace.refs.adminsRef = firebase.database().ref('admins');
    }

    namespace.trigger_element_change_event = (elementId) => {
        document.getElementById(elementId).dispatchEvent(new Event('change'));
    }

    namespace.addEventListeners = () => {
        document.getElementById('btnBuzzer').addEventListener('click', namespace.handleClicks.btnBuzzer);
        document.getElementById('btnReset').addEventListener('click', namespace.handleClicks.btnReset);
        document.getElementById('btnAdminLogin').addEventListener('click', namespace.handleClicks.btnAdminLogin);
        document.getElementById('txtName').addEventListener('input', namespace.handleNameUpdate);
        document.getElementById('txtName').addEventListener('change', namespace.handleNameUpdate);

        namespace.refs.buzzerRef.on('value', namespace.onBuzzerChange);
    }

    namespace.setBuzzerWinner = () => {
        document.getElementById('buzzerWinner').innerHTML = namespace.buzzerValue;
    }

    namespace.revalidateBuzzerState = () => {
        if (!namespace.buzzerValue && namespace.name) {
            return namespace.enableBuzzer();
        }
        return namespace.disableBuzzer();
    }

    namespace.disableBuzzer = () => {
        document.getElementById("btnBuzzer").setAttribute('disabled', true)
    }

    namespace.enableBuzzer = () => {
        document.getElementById("btnBuzzer").removeAttribute('disabled')
    }

    namespace.adminLogin = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((response) => {
            namespace.refs.adminsRef.once('value').then((data) => {
                const admins = data.val().split(',');
                if (admins.includes(response.user.email)) {
                    namespace.activateResetButton()
                    document.getElementById('btnAdminLogin').classList.add('hiddenButton')
                }
            }).catch(namespace.handleErrors);
        }).catch(namespace.handleErrors);
    }

    namespace.activateResetButton = () => {
        document.getElementById('btnReset').classList.remove("hiddenButton");
    }

    namespace.onBuzzerChange = (snapshot) => {
        namespace.buzzerValue = snapshot.val();
        namespace.revalidateBuzzerState();
        namespace.setBuzzerWinner();
    }

    namespace.onLoad = () => {
        firebase.auth().signInAnonymously().then(() => {
            namespace._get_refs();
            namespace.addEventListeners();
            namespace.trigger_element_change_event('txtName');
        });
    }

    return namespace;
})({});