const path = require('path');
const {
	override,
	addDecoratorsLegacy,
	disableEsLint,
	fixBabelImports,
	addLessLoader,
	addWebpackAlias,
	removeModuleScopePlugin
} = require('customize-cra');

module.exports = override(
	fixBabelImports('import', {
		libraryName: 'antd',
		libraryDirectory: 'es',
		style: true,
	}),
	addLessLoader({
		javascriptEnabled: true,
		modifyVars: {
			'@primary-color': '#D4380D',
			'@text-color': '#44515F',
			'@text-color-secondary': 'rgba(68,81,95,0.65)',
			'@disabled-color': 'rgba(68,81,95,0.45)',
			'border-color-base': '#e8e8e8',
			'border-radius-base': '2px'
		},
	}),
	addWebpackAlias({
		['@']: `${__dirname}/src/`
	}),
	addDecoratorsLegacy(),
	disableEsLint(),
	removeModuleScopePlugin()
);