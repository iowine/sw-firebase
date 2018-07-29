document.addEventListener('DOMContentLoaded', function() {
    firebase.app().database().ref('/data').on('value', snapshot => {
        if (JSON.stringify(snapshot) != "null") {
            document.getElementById('data').innerHTML = JSON.stringify(snapshot)
        }
    })

    try {
        let app = firebase.app()
        let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function')
        document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`
    } catch (e) {
        console.error(e)
        document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.'
    }
});