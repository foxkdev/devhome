import { Project } from './project';
import type { ProjectType } from './project';

import Settings from './settings';
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
			throw new Error('Project already exists');
		}
		this.projects.push(new Project(project));
	}

	async remove(projectName: string): Promise<void> {
		this.projects = this.projects.filter((p) => p.name !== projectName);
	}
	async loadFromSettings() {
		const projects = (await settings.get('projects')) as object[];
		console.log('LOAD FROM SETTINGS', projects);
		if (projects) {
			this.projects = projects.map((p) => new Project(p as ProjectType));
		}
	}
	exportToSettings() {
		const projects = this.projects.map((p) => p.toJSON());
		settings.set('projects', projects);
	}
}
