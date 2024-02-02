import { appConfigDir } from '@tauri-apps/api/path';
import FileManager from './fs/file-manager';
import { Logger } from './utils/logger';

type SettingsType = {
	[key: string]: object | object[];
};
export default class Settings {
	private static instance: Settings | null = null;
	settingsFile: string;
	pathFile: string = '';
	settings: SettingsType = {};
	defaultSettings: SettingsType;
	private constructor() {
		this.settingsFile = 'settings.json';
		this.defaultSettings = this.getDefaultSettings();
		this.getPathSettings();
	}
	public static getInstance(): Settings {
		if (!Settings.instance) {
			Settings.instance = new Settings();
		}
		return Settings.instance;
	}

	async get(key: string) {
		return this.settings[key];
	}
	async set(key: string, value: object | object[] | string | number | boolean) {
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
			Logger.info('[SETUP] Completed');
		} else {
			await this.loadSettings();
		}
	}

	private getDefaultSettings() {
		return {
			projects: []
		};
	}
	private async loadSettings() {
		this.settings = await FileManager.get(this.pathFile);
		Logger.info(`Settings Loaded from ${this.pathFile}`);
		return this.settings;
	}
	private async getPathSettings() {
		this.pathFile = `${await appConfigDir()}${this.settingsFile}`;
		return this.pathFile;
	}
}
