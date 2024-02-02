import { appConfigDir } from '@tauri-apps/api/path';
import FileManager from './file-manager';

type SettingsType = {
	[key: string]: object | object[];
};
export default class Settings {
	private static instance: Settings | null = null;
	settingsFile: string;
	pathFile: string;
	settings: SettingsType;
	defaultSettings: SettingsType;
	constructor() {
		this.settingsFile = 'settings.json';
		this.defaultSettings = this.getDefaultSettings();
		this.getPathSettings();
		this.setup();
	}
	async get(key: string) {
		return this.settings[key];
	}
	async set(key: string, value: object | object[] | string | number | boolean) {
		console.log('SET', key, value);
		this.settings = Object.assign({}, this.settings, { [key]: value });

		await FileManager.save(this.settingsFile, this.settings);
	}
	async remove(key: string) {
		delete this.settings[key];
		await FileManager.save(this.settingsFile, this.settings);
	}

	async setup() {
		const exists = await FileManager.exists(await appConfigDir());
		if (!exists) {
			await FileManager.createDir(await appConfigDir());
			await FileManager.save(this.settingsFile, this.defaultSettings);
			this.settings = this.defaultSettings;
		} else {
			await this.loadSettings();
		}
		console.log('SETUP LOADED');
	}

	private getDefaultSettings() {
		return {
			projects: []
		};
	}
	private async loadSettings() {
		this.settings = await FileManager.get(this.pathFile);
		return this.settings;
	}
	private async getPathSettings() {
		this.pathFile = `${await appConfigDir()}${this.settingsFile}`;
		return this.pathFile;
	}
}
