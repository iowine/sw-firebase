export const environment = {
  production: false,
  name: 'IoWine DEV',
  version: require('../../package.json').version || "N/A",
  hash: require('../../git.version.json').raw || "N/A",
  firebase: {
    apiKey: "AIzaSyCmcVwxlgJgLGZxynIUN4VaMaJf9Lhw3vg",
    authDomain: "iowine-cloud.firebaseapp.com",
    databaseURL: "https://iowine-cloud.firebaseio.com",
    projectId: "iowine-cloud",
    storageBucket: "iowine-cloud.appspot.com",
    messagingSenderId: "329746497070",
  }
};