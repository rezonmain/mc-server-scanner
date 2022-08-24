class ParsedPlayer {
	name;
	uuid;
	servers: string[];
	mojangName: string | undefined;
	mojangUUID: string | undefined;
	skin: string | undefined;
	constructor() {
		this.name = '';
		this.uuid = '';
		this.servers = [];
		this.mojangName = undefined;
		this.skin = undefined;
	}

	static readonly STEVE =
		'data:image/png;base64,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';
}

export default ParsedPlayer;
