/**
 * @format
 */
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';


global.Buffer = global.Buffer || Buffer;

import { AppRegistry } from 'react-native';
import App from './App';
import Root from './src/root';
import { name as appName } from './app.json';



AppRegistry.registerComponent(appName, () => Root);
