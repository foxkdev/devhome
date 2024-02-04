import { Logger } from '$lib/utils/logger';
// import FileManager from '$lib/fs/file-manager';
import Repository from './repository';
import { invoke } from '@tauri-apps/api';

export interface ProjectType {
	name: string;
	repository: Repository | undefined;
}

export default class Project implements ProjectType {
	name: string;
	path: string;
	repository: Repository | undefined = undefined;

	constructor({
		name,
		path,
		repository = undefined
	}: {
		name: string;
		path: string;
		repository: Repository | undefined;
	}) {
		if (name === '') {
			Logger.error('Project name cannot be empty');
			throw new Error('Project name cannot be empty');
		}
		this.name = name;
		this.path = path;
		this.repository = repository;
	}

	async setup() {
		const exists = await invoke('plugin:git_manager|has_repo', {
			path: this.path
		});
		if (exists) {
			this.repository = new Repository({ name: this.name, path: this.path });
			await this.repository.setup();
		}
	}
	async loadFromSettings(repository) {
		this.repository = new Repository(repository);
	}

	toJSON() {
		return {
			name: this.name,
			path: this.path,
			repository: this.repository?.toJSON()
		};
	}
}
