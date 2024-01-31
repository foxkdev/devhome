// import { SettingsManager } from 'tauri-settings';
import { writeTextFile, readTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import { appConfigDir } from '@tauri-apps/api/path';

type SettingsType = {
	[key: string]: object | object[];
};
export default class Settings {
	settingsFile: string;
	pathFile: string;
	settings: SettingsType;
	constructor() {
		this.settingsFile = 'settings.json';
		this.settings = {};
		this.pathFile = '';
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

		await this.syncSettings();
	}
	async remove(key: string) {
		delete this.settings[key];
		await this.syncSettings();
	}
	async init() {
		this.pathFile = `${await appConfigDir()}${this.settingsFile}`;
		this.loadSettings();
	}

	async syncSettings() {
		// await this.loadSettings();
		try {
			await writeTextFile(this.settingsFile, JSON.stringify(this.settings), {
				dir: BaseDirectory.AppConfig
			});
		} catch (err) {
			console.error(err);
		}
	}

	async loadSettings() {
		const content = await readTextFile(this.settingsFile, {
			dir: BaseDirectory.AppConfig
		});
		this.settings = {
			...this.settings,
			...JSON.parse(content)
		};
	}
}
