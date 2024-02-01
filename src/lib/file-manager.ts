import { exists, createDir, writeFile, readTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import { appConfigDir } from '@tauri-apps/api/path';

export default class FileManager {
	static async createDir(dirPath: string) {
		if (!(await exists(dirPath))) {
			await createDir(dirPath);
		}
	}
	static async save(filePath: string, content: object) {
		await writeFile(filePath, JSON.stringify(content), {
			dir: BaseDirectory.AppConfig
		});
		return content;
	}
	static async get(filePath: string) {
		return readTextFile(filePath, {
			dir: BaseDirectory.AppConfig
		}).catch((err) => {
			console.error(err);
			return null;
		});
	}
}
