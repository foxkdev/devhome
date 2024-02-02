export interface RepositoryType {
	name: string;
	path: string;
	url: string;
	provider: string;
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
	constructor({ name, path, url, provider }: RepositoryType) {
		this.name = name;
		this.path = path;
		this.url = url;
		this.provider = provider;
	}

	set provider(provider: string) {
		if (Object.values(PROVIDERS).includes(provider)) {
			this.provider = provider;
		} else {
			throw new Error('Invalid provider');
		}
	}

	async clone() {
		console.log('Cloning', this.url, 'to', this.path);
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
