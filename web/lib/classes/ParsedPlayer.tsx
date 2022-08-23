class ParsedPlayer {
	name;
	uuid;
	servers: string[];
	skinURL: string;
	constructor() {
		this.name = '';
		this.uuid = '';
		this.servers = [];
		this.skinURL = '';
	}
}

export default ParsedPlayer;
