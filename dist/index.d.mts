type JSONPrimitive = string | number | boolean | null | undefined;
type GADMgeometry = JSONPrimitive | GADMgeometry[] | {
    [key: string]: GADMgeometry;
};
declare const GADMclient: {
    getNames: (country: string, level: number, parents?: string[], gpkg?: string) => Promise<GADMgeometry>;
    getGeometry: (country: string, level: number, parents?: string[], gpkg?: string) => Promise<GADMgeometry>;
    getFeatures: (country: string, level: number, parents?: string[]) => Promise<GADMgeometry>;
};

export { GADMclient as default };
