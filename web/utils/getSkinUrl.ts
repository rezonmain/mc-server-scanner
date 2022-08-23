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

const getSkingUrl = (response: MojangRes) => {
	const textureEncoded = response.properties.find(
		(props) => props.name === 'textures'
	)?.value;
	const buff = textureEncoded && Buffer.from(textureEncoded, 'base64');
	const textureDecoded = buff?.toString('utf-8');
	const texture: TexturesRes = textureDecoded ? JSON.parse(textureDecoded) : {};
	return texture.textures.SKIN.url;
};

export default getSkingUrl;
