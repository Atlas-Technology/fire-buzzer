var fire_buzzer = fire_buzzer || ((namespace) => {

    namespace.handleErrors = (error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
    }

    namespace.onLoad = () => {

          let app = firebase.app();

          firebase.auth().signInAnonymously().then(() => {

            const uid = firebase.auth().currentUser.uid

            let buzzerRef = firebase.database().ref('buzzer')
            buzzerRef.on('value', (snapshot) => {
              console.log(snapshot.val())
            })


            document.getElementById('btnBuzzer').addEventListener('click', () => {
                buzzerRef.set(true);
            })

            document.getElementById('btnReset').addEventListener('click', () => {
              buzzerRef.set(false);
            })


          });
    }

    return namespace;
})({});
console.log(fire_buzzer);