class ParsedPlayer {
	name;
	uuid;
	servers: string[];
	mojangName: string | undefined;
	skinURL: string | undefined;
	modelType: 'slim' | 'classic' | undefined;
	constructor() {
		this.name = '';
		this.uuid = '';
		this.servers = [];
		this.skinURL = undefined;
		this.modelType = undefined;
		this.mojangName = undefined;
	}
}

export default ParsedPlayer;
