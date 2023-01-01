import { BaseObject, TextureAtlasData, TextureData } from '@flyskypie/dragonbones-js';

/**
 * - The ThreeJS texture atlas data.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - ThreeJS 贴图集数据。
 * @version DragonBones 3.0
 * @language zh_CN
 */
export class ThreeTextureAtlasData extends TextureAtlasData {
    public static toString(): string {
        return "[class ThreeTextureAtlasData]";
    }
    /**
     * @private
     */
    public material: THREE.MeshBasicMaterial | null = null; // Initial value.
    private _renderTexture: THREE.Texture | null = null; // Initial value.

    protected _onClear(): void {
        super._onClear();

        if (this.material !== null) {
            this.material.dispose();
        }

        if (this._renderTexture !== null) {
            // this._renderTexture.dispose();
        }

        this.material = null as any;

        this._renderTexture = null;
    }
    /**
     * @inheritDoc
     */
    public createTexture(): TextureData {
        return BaseObject.borrowObject(ThreeTextureData);
    }
    /**
     * - The ThreeJS texture.
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - ThreeJS 贴图。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    public get renderTexture(): THREE.Texture | null {
        return this._renderTexture;
    }
    public set renderTexture(value: THREE.Texture | null) {
        if (this._renderTexture === value) {
            return;
        }

        this._renderTexture = value;
    }
}
/**
 * @internal
 */
export class ThreeTextureData extends TextureData {
    public static toString(): string {
        return "[class ThreeTextureData]";
    }
}
