import { Logger } from '$lib/utils/logger';
import { exists, createDir, writeFile, readTextFile, BaseDirectory } from '@tauri-apps/api/fs';

export default class FileManager {
	static async exists(filePath: string) {
		return await exists(filePath);
	}
	static async createDir(dirPath: string) {
		await createDir(dirPath);
	}
	static async save(filePath: string, content: object) {
		await writeFile(filePath, JSON.stringify(content), {
			dir: BaseDirectory.AppConfig
		});
		return content;
	}
	static async get(filePath: string) {
		return await readTextFile(filePath, {
			dir: BaseDirectory.AppConfig
		})
			.then((file) => JSON.parse(file))
			.catch((err) => {
				Logger.error(err);
				return null;
			});
	}
}
