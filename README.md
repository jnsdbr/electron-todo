# Basic electron todo app

Please note that this is just a test application. Its pretty rough at its current state!

## Installation

```
npm install
```

To compile sqlite3 for osx you have to run the following commands
```
cd node_modules/sqlite3
npm run republish
node-gyp configure --module_name=node_sqlite3 --module_path=../lib/binding/electron-v1.7-darwin-x64 && node-gyp rebuild --target=1.7.5 --arch=x64 --target_platform=darwin --dist-url=https://atom.io/download/atom-shell --module_name=node_sqlite3 --module_path=../lib/binding/electron-v1.7-darwin-x64
```
