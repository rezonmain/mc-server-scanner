type MojangRes = {
	id: string;
	name: string;
	properties: { name: string; value: string }[];
};

type TexturesRes = {
	timestamp: number;
	profileId: string;
	profileName: string;
	textures: { SKIN: { url: string; metadata: { model: string } } };
};

const parseMojangRes = (response: MojangRes) => {
	const mojangName = response.name;
	const mojangUUID = response.id;
	const textureEncoded = response.properties.find(
		(props) => props.name === 'textures'
	)?.value;
	const buff = textureEncoded && Buffer.from(textureEncoded, 'base64');
	const textureDecoded = buff?.toString('utf-8');
	const texture: TexturesRes = textureDecoded ? JSON.parse(textureDecoded) : {};
	const url = texture.textures.SKIN.url;
	const modelType = texture.textures.SKIN.metadata
		? texture.textures.SKIN.metadata.model
		: 'classic';
	return { mojangName, url, mojangUUID };
};

export default parseMojangRes;
