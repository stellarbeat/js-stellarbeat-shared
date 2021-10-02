export class NodeGeoData {
	public countryCode: string | null = null;
	public countryName: string | null = null;
	public latitude: number | null = null;
	public longitude: number | null = null;

	toJSON(): Record<string, unknown> {
		return {
			countryCode: this.countryCode,
			countryName: this.countryName,
			latitude: this.latitude,
			longitude: this.longitude
		};
	}

	static fromJSON(nodeGeo: string | Record<string, unknown>): NodeGeoData {
		if (nodeGeo === undefined) {
			return new NodeGeoData();
		}
		let nodeGeoObject;
		if (typeof nodeGeo === 'string') {
			nodeGeoObject = JSON.parse(nodeGeo);
		} else nodeGeoObject = nodeGeo;

		const newNodeGeo = new NodeGeoData();
		newNodeGeo.countryCode = nodeGeoObject.countryCode;
		newNodeGeo.countryName = nodeGeoObject.countryName;
		newNodeGeo.latitude = nodeGeoObject.latitude;
		newNodeGeo.longitude = nodeGeoObject.longitude;

		return newNodeGeo;
	}
}
