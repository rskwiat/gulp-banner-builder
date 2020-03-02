module.exports = {
  parser: "babel-eslint",
  "extends": [
    "airbnb"
  ],
  "import/no-extraneous-dependencies": [
    "error", {
      "devDependencies": false,
      "optionalDependencies": false,
      "peerDependencies": false
    }
  ]

};
