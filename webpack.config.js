const os = require("os");
const webpack = require("webpack");
const WebpackShellPlugin = require("webpack-shell-plugin");
const nodeExternals = require("webpack-node-externals");

const appName = "--" + require("./package.json").name;
const debug = process.argv.indexOf("--env.production") === -1 && (process.env.NODE_ENV || "development") === "development";
const serve = process.argv.indexOf("--env.serve") > -1;

let onBuildExitCommand = [];
let traceSyncFlag = "--trace-sync-io ";

switch (os.platform()) {
    case "win32":
        if (serve) {
            onBuildExitCommand.push(`wmic path win32_process Where "Caption Like '%node.exe%' AND CommandLine Like '%${traceSyncFlag}src/server.js ${appName}%'" Call Terminate >nul 2>&1 & node ${traceSyncFlag}src/server.js ${appName}`);
        }
        break;

    case "linux":
    case "darwin":
        if (serve) {
            // see also http://askubuntu.com/a/539293
            onBuildExitCommand.push({command: 'bash', args: ['-c', `PID=\`pgrep -f "node ${traceSyncFlag}src/server.js ${appName}"\` && kill $PID >/dev/null 2>/dev/null && while ps -p $PID; do sleep 0.1; done`]});
            onBuildExitCommand.push({command: 'bash', args: ['-c', `node ${traceSyncFlag}src/server.js ${appName}; exit`]});
        }
        break;

    default:
        console.log("Unsupported platform");
        process.exit();
        break;
}

module.exports = {

    entry: "./src/server.ts",

    output: {
        filename: "./src/server.js",
        // devtoolModuleFilenameTemplate: "[absolute-resource-path]?[loaders]"
        devtoolModuleFilenameTemplate: "[absolute-resource-path]"
    },

    target: "node",

    // when __dirname is false it will return the directory path of the entry point (server.js)
    // if __dirname is true (or if not set) it returns the root path '/' (or the root drive on windows)
    node: {
        __dirname: false,
        __filename: false
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            // see https://github.com/TypeStrong/ts-loader
            {test: /\.tsx?$/, loader: "ts-loader", exclude: [/node_modules/]}
        ]
    },

    // see https://github.com/liady/webpack-node-externals
    externals: [nodeExternals()],

    // devtool: debug ? "inline-sourcemap" : false,
    devtool: debug ? "source-map" : false,

    plugins: debug ? [

        // https://github.com/1337programming/webpack-shell-plugin
        new WebpackShellPlugin({onBuildExit: onBuildExitCommand})

    ] : [

        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: true},
            mangle: true,
            output: {comments: false},
            sourcemap: false
        })

    ]

};
