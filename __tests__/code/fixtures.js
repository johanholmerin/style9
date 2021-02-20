const path = require('path');
const pluginTester = require('babel-plugin-tester').default;
const plugin = require('../../babel.js');

pluginTester({
  plugin,
  pluginName: 'style9',
  fixtures: path.join(__dirname, 'fixtures')
});
