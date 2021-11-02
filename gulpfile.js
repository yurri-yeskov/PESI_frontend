'use strict';

var gulp = require('gulp');
var wrench = require('wrench');
var pkg = require('./package.json');

var options = {
	dist: './dist',
	pkg: pkg,
	mavenDeploy:""
};

wrench
	.readdirSyncRecursive('./outillage')
	.filter(function (file) {
		return (/\.(js)$/i).test(file);
	})
	.map(function (file) {
		require('./outillage/' + file)(options);
	});

/**
 * Tâche par défaut
 * - Exécution de la tâche de vérification de la qualité du code.
 */
gulp.task('default', ['quality'], function () {
});
