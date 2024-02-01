import { appConfigDir } from '@tauri-apps/api/path';
import FileManager from './file-manager';

type SettingsType = {
	[key: string]: object | object[];
};
export default class Settings {
	settingsFile: string;
	pathFile: string;
	settings: SettingsType;
	defaultSettings: SettingsType;
	constructor() {
		this.settingsFile = 'settings.json';
		this.settings = {};
		this.pathFile = '';
		this.defaultSettings = {};
		this.init();
	}
	async get(key: string) {
		return this.settings[key];
	}
	async set(key: string, value: object | object[] | string | number | boolean) {
		console.log('SET', key, value);
		this.settings = {
			...this.settings,
			[key]: value
		};

		await FileManager.save(this.settingsFile, this.settings);
	}
	async remove(key: string) {
		delete this.settings[key];
		await FileManager.save(this.settingsFile, this.settings);
	}
	async init() {
		this.pathFile = `${await appConfigDir()}${this.settingsFile}`;
		this.loadSettings();
	}

	async loadSettings() {
		await FileManager.createDir(await appConfigDir());
		const settings = await FileManager.get(this.pathFile);
		if (settings) {
			this.settings = {
				...this.settings,
				...JSON.parse(settings)
			};
		} else {
			await FileManager.save(this.settingsFile, this.defaultSettings);
			this.settings = this.defaultSettings;
		}
		console.info('Settings Loaded');
		return this.settings;
	}
}
