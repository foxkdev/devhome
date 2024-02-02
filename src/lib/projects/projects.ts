import { Project } from './project';
import type { ProjectType } from './project';

import Settings from '$lib/settings';
import { Logger } from '$lib/utils/logger';
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

	async add(project: ProjectType): Promise<void> {
		const exists = await this.get(project.name);
		if (exists) {
			Logger.error(`Project ${project.name} already exists`);
			throw new Error(`Project ${project.name} already exists`);
		}
		this.projects.push(new Project(project));
	}

	async remove(projectName: string): Promise<void> {
		this.projects = this.projects.filter((p) => p.name !== projectName);
	}
	async loadFromSettings() {
		const projects = (await settings.get('projects')) as object[];
		if (projects) {
			this.projects = projects.map((p) => new Project(p as ProjectType));
		}
	}
	exportToSettings() {
		const projects = this.projects.map((p) => p.toJSON());
		settings.set('projects', projects);
	}
}
