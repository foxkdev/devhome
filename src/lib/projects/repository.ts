import { Logger } from '$lib/utils/logger';
import { invoke } from '@tauri-apps/api';
export interface RepositoryType {
	name: string;
	path: string;
	url?: string;
	provider?: string;
}

const PROVIDERS = {
	GITHUB: 'github',
	GITLAB: 'gitlab',
	BITBUCKET: 'bitbucket',
	URL: 'url'
};
export default class Repository implements RepositoryType {
	name: string;
	path: string;
	url: string;
	provider: string;
	constructor({ name, path, url = '', provider = 'url' }: RepositoryType) {
		this.name = name;
		this.path = path;
		this.url = url;
		this.provider = provider;
	}
	async setup() {
		await invoke('plugin:git_manager|get_remote', {
			path: this.path
		})
			.then((remote) => {
				this.url = remote as string;
				this.setNameFromUrl();
				this.setProviderFromUrl();
			})
			.catch((e) => {
				Logger.error(e);
			});
		await this.getBranch();
	}
	setNameFromUrl() {
		this.name = this.url.split('/').pop()?.replace('.git', '') as string;
	}
	setProviderFromUrl() {
		const providerPath = this.url.split('/')[2].split('.')[0];
		this.setProvider(providerPath);
	}
	setProvider(provider: string) {
		if (Object.values(PROVIDERS).includes(provider)) {
			this.provider = provider;
		} else {
			Logger.error(`Invalid provider ${provider}`);
			throw new Error(`Invalid provider ${provider}`);
		}
	}

	async clone() {
		Logger.info(`Cloning ${this.url} to ${this.path}`);
	}

	async getBranch() {
		return await invoke('plugin:git_manager|get_branch', {
			path: this.path
		});
	}

	toJSON() {
		return {
			name: this.name,
			path: this.path,
			url: this.url,
			provider: this.provider
		};
	}
}
