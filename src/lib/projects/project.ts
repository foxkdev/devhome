import { Logger } from '$lib/utils/logger';
import Repository from './repository';
import type { RepositoryType } from './repository';

export interface ProjectType {
	name: string;
	repositories: Repository[];
}

export class Project implements ProjectType {
	name: string;
	repositories: Repository[];

	constructor({ name, repositories }: ProjectType) {
		if (name != '') {
			Logger.error('Project name cannot be empty');
			throw new Error('Project name cannot be empty');
		}
		this.name = name;
		this.repositories = repositories.map((r) => new Repository(r));
	}
	async getRepository(repositoryUrl: string): Promise<Repository | undefined> {
		return this.repositories.find((r) => r.url === repositoryUrl);
	}

	async addRepository(repository: RepositoryType): Promise<void> {
		const repo = new Repository(repository);
		this.repositories.push(repo);
	}

	async removeRepository(repositoryUrl: string): Promise<void> {
		const repo = await this.getRepository(repositoryUrl);
		if (repo) {
			this.repositories = this.repositories.filter((r) => r.url !== repositoryUrl);
		}
	}

	toJSON() {
		return {
			name: this.name,
			repositories: this.repositories.map((r) => r.toJSON())
		};
	}
}
