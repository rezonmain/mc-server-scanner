class ParsedPlayer {
	name;
	uuid;
	servers: string[];
	constructor() {
		this.name = '';
		this.uuid = '';
		this.servers = [];
	}
}

export default ParsedPlayer;
