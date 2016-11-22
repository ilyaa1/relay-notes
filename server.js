import chokidar from 'chokidar';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { clean } from 'require-clean';
import { exec } from 'child_process';

const cssnext = require('postcss-cssnext');
const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

let graphQLServer;
let appServer;

function startAppServer (callback) {
    // Serve the Relay app
    const compiler = webpack({
        entry: path.resolve(__dirname, 'js', 'app.js'),
        postcss: () => [
            postcssFocus(),
            cssnext({ browsers: ['last 2 versions', 'IE > 10'] }),
            postcssReporter({ clearMessages: true }),
        ],
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel',
                },
                {
                    test: /\.css$/,
                    include: [path.join(__dirname, 'js'), 'node_modules'],
                    loader: 'style!css?modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss'
                },
                {
                    test: /\.scss$/,
                    include: [path.join(__dirname, 'js'), 'node_modules'],
                    loaders: [
                        'style',
                        'css?modules&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap!postcss',
                        'sass?sourceMap!postcss'
                    ]
                },
                { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
                { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
            ]
        },
        output: { filename: '/app.js', path: '/', publicPath: '/js/' },
        stats: false,
    });
    
    appServer = new WebpackDevServer(compiler, {
        contentBase: '/public/',
        proxy: { '/graphql': `http://localhost:${GRAPHQL_PORT}` },
        publicPath: '/js/',
        stats: false
    });
    
    // Serve static resources
    appServer.use('/', express.static(path.resolve(__dirname, 'public')));
    
    appServer.listen(APP_PORT, () => {
        console.log(`App is now running on http://localhost:${APP_PORT}`);
        
        if (callback) {
            callback();
        }
    });
}

function startGraphQLServer (callback) {
    // Expose a GraphQL endpoint
    clean('./data/schema');
    
    const { Schema } = require('./data/schema');
    const graphQLApp = express();
    
    graphQLApp.use('/', graphQLHTTP({
        graphiql: true,
        pretty: true,
        schema: Schema,
    }));
    
    graphQLServer = graphQLApp.listen(GRAPHQL_PORT, () => {
        console.log(`GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`);
        
        if (callback) {
            callback();
        }
    });
}

function startServers (callback) {
    // Shut down the servers
    if (appServer) {
        appServer.listeningApp.close();
    }
    
    if (graphQLServer) {
        graphQLServer.close();
    }
    
    // Compile the schema
    exec('npm run update-schema', (error, stdout) => {
        console.log(stdout);
        let doneTasks = 0;
        
        function handleTaskDone () {
            doneTasks++;
            if (doneTasks === 2 && callback) {
                callback();
            }
        }
        
        startGraphQLServer(handleTaskDone);
        startAppServer(handleTaskDone);
    });
}
const watcher = chokidar.watch('./data/{database,schema}.js');

watcher.on('change', path => {
    console.log(`\`${path}\` changed. Restarting.`);
    startServers(() =>
        console.log('Restart your browser to use the updated schema.')
    );
});

startServers();
