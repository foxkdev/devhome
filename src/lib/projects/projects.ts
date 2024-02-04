import Project from './project';
import type { ProjectType } from './project';

import Settings from '$lib/settings';
import { Logger } from '$lib/utils/logger';
import Repository from './repository';
const settings = Settings.getInstance();

export default class Projects {
	private static instance: Projects | null = null;
	projects: Project[];
	private constructor() {
		this.projects = [];
	}

	public static getInstance(): Projects {
		if (!Projects.instance) {
			Projects.instance = new Projects();
		}
		return Projects.instance;
	}

	getAll(): Project[] {
		return this.projects;
	}

	async get(projectName: string): Promise<Project | undefined> {
		return this.projects.find((p) => p.name === projectName);
	}

	async add(path: string) {
		const name = path.split('/').pop() || '';
		if (name == '') {
			Logger.error('Project name cannot be empty');
			throw new Error('Project name cannot be empty');
		}
		const exists = await this.get(name);
		if (exists) {
			Logger.error(`Project ${name} already exists`);
			throw new Error(`Project ${name} already exists`);
		}
		const project = new Project({ name, path, repository: undefined });
		await project.setup();
		this.projects.push(project);
		console.log('projects added', this.projects);
		this.syncSettings();
	}

	async remove(projectName: string): Promise<void> {
		this.projects = this.projects.filter((p) => p.name !== projectName);
		this.syncSettings();
	}

	async loadFromSettings() {
		const projects = (await settings.get('projects')) as object[];
		if (projects) {
			this.projects = projects.map((p: any) => {
				const project = new Project({
					name: p.name,
					path: p.path,
					repository: undefined
				});
				if (p.repository) {
					project.loadFromSettings(p.repository);
				}
				return project;
			});
		}
	}
	async syncSettings() {
		const projects = this.projects.map((p) => p.toJSON());
		console.log('SYNC SETTINGS', projects);
		await settings.set('projects', projects);
	}
}
