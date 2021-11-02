'use strict';

var PLUGIN_NAME = "build.js";
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var argv = require('yargs').argv;

module.exports = function (options) {

	/**
	 * Tâche clean : avec plugin gulp-clean.
	 * - Suppression des répertoires 'dist'
	 *
	 * Le return est important il permet d'attendre la fin de la tache avant d'en exécuter une autre.
	 */
	gulp.task('clean', function () {
		return gulp.src([options.dist, options.reports], {read: false})
			.pipe($.clean({force: true}));
	});

	/**
	 * Tâche maven-deploy : Déploiement des fichiers de distribution via Maven Deploy.
	 * @see mavenDeploy
	 * @see buildFileMavenDeployConf
	 */
	gulp.task('maven-deploy', function () {
		var config = {};
		var fileConf = buildFileMavenDeployConf();
		try {
			config = require(fileConf);
			$.util.log('Utilisation du fichier de configuration de déploiement : ' + fileConf);
		}
		catch (e) {
			// Le fichier est introuvable ... Tant pis, on ne s'en servira pas
		}

		$.util.log('config  pour mavenDeploy .. ');
		$.util.log(config);

		return mavenDeploy(config);
	});


	/**
	 * Construction le chemin et nom du fichier de configuration de déploiement.
	 * Par défaut le fichier est "maven-deploy-conf.json"
	 * Si le paramètre --deploy est présent en ligne de commande, la valeur de ce paramètre est ajouté au nom du fichier : "maven-deploy-conf[-[ValeurParamDeploy]].json"
	 * @returns {string}
	 */
	function buildFileMavenDeployConf() {
		var confDeploy = argv.deploy;
		var fileConf = '../maven-deploy-conf';
		if (confDeploy) {
			fileConf += '-' + confDeploy;
		}
		fileConf += '.json';
		return fileConf;
	}

	/**
	 * Déploiement des fichiers de distribution via Maven Deploy.
	 * Basé sur les plugins gulp-maven-deploy et maven-deploy.
	 * Pour la configuration voir le plugin maven-deploy pour plus de détail.
	 * Ci-dessous les différents éléments avec les priorités d'affectation :
	 * <ul>
	 *      <li>groupId : pConfig.groupId OU options.mavenDeploy.groupId OU options.pkg.groupId</li>
	 *      <li>artifactId : pConfig.artifactId OU options.mavenDeploy.artifactId OU options.pkg.artifactId OU options.pkg.name</li>
	 *      <li>buildDir : pConfig.buildDir OU options.mavenDeploy.buildDir OU options.dist</li>
	 *      <li>finalName : pConfig.finalName OU options.mavenDeploy.finalName OU options.pkg.name</li>
	 *      <li>type : pConfig.type OU options.mavenDeploy.type OU 'zip'</li>
	 *      <li>fileEncoding : pConfig.fileEncoding OU options.mavenDeploy.fileEncoding OU 'utf-8'</li>
	 *      <li>repositories : pConfig.repositories OU options.mavenDeploy.repositories</li>
	 * </ul>
	 * @param pConfig La configuration optionnelle
	 * @returns {*} Le flux
	 */
	function mavenDeploy(pConfig) {
		var TEXTE_ERREUR = 'Configuration de déploiement en erreur : ';
		var paramConfig = pConfig || {};


		var config = {};
		config.version = options.pkg.version ;
		$.util.log(' configuration (version): ' + JSON.stringify(config.version ));
		if (config.version) {
			var strVersion =config.version;
			paramConfig = pConfig || {};
		}

		if (options.mavenDeploy) {
			config.groupId = paramConfig.groupId || options.mavenDeploy.groupId || options.pkg.groupId;
			config.artifactId = paramConfig.artifactId || options.mavenDeploy.artifactId || options.pkg.artifactId || options.pkg.name;
			config.buildDir = paramConfig.buildDir || options.mavenDeploy.buildDir || options.dist;
			config.finalName = paramConfig.finalName || options.mavenDeploy.buildDir || options.pkg.name;
			config.type = paramConfig.type || options.mavenDeploy.type || 'zip';
			config.fileEncoding = paramConfig.fileEncoding || options.mavenDeploy.fileEncoding || 'utf-8';
			config.repositories = paramConfig.repositories || options.mavenDeploy.repositories;
		} else {
			config.groupId = paramConfig.groupId || options.pkg.groupId;
			config.artifactId = paramConfig.artifactId || options.pkg.artifactId || options.pkg.name;
			config.buildDir = paramConfig.buildDir || options.dist;
			config.finalName = paramConfig.finalName || options.pkg.name;
			config.type = paramConfig.type || 'zip';
			config.fileEncoding = paramConfig.fileEncoding || 'utf-8';
			config.repositories = paramConfig.repositories;
		}

		$.util.log('Déploiement configuration : ' + JSON.stringify(config));
		if (!config.groupId) {
			throw new $.util.PluginError(PLUGIN_NAME, TEXTE_ERREUR + '"groupId" manquant');
		}
		if (!config.repositories) {
			throw new $.util.PluginError(PLUGIN_NAME, TEXTE_ERREUR + '"repositories" manquant');
		}

		return gulp.src('.').pipe($.mavenDeploy.deploy({config: config}));
	}

	// Définition des fonctions publiques
	return {
		mavenDeploy: mavenDeploy
	};
};
