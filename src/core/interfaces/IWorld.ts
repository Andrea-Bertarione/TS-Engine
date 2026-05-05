export interface IWorld {
    name: string;

    characters: object; // object until i implement characters
    entities: object; // object until i implement entities
    maps: Record<string, object>

    selectedMap: string;
}