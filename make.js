const npm = require("npm");
const path = require('path');

npm.load((err, result)=>{
    npm.commands.install(path.resolve(__dirname, ""), [], ()=>{
        npm.commands.install(path.resolve(__dirname, "trunk/"), [], ()=>{
            npm.commands.install(path.resolve(__dirname, "branches/dom/"), [], ()=>{
                npm.commands.install(path.resolve(__dirname, "branches/egret/"), [], ()=>{
                    console.log("make done!");
                });
            });
        });
    });
});