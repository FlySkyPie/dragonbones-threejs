import { AdditiveBlending, BufferAttribute, MeshBasicMaterial, Vector2, Vector3 } from 'three';
import {
    Slot, GeometryData, DisplayFrame, BinaryOffset, BlendMode, BoneType
} from '@flyskypie/dragonbones-js';

import { ThreeArmatureDisplay } from './ThreeArmatureDisplay';
import { ThreeTextureAtlasData, ThreeTextureData } from './ThreeTextureAtlasData';

/**
 * - The ThreeJS slot.
 * @version DragonBones 3.0
 * @language en_US
 */
/**
 * - ThreeJS 插槽。
 * @version DragonBones 3.0
 * @language zh_CN
 */
export class ThreeSlot extends Slot {
    public static toString(): string {
        return "[class ThreeSlot]";
    }

    public static readonly RAW_UVS: Array<number> = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];
    public static readonly RAW_INDICES: Array<number> = [0, 1, 2, 3, 2, 1];

    private _renderDisplay: THREE.Object3D | null = null;
    private _material: THREE.MeshBasicMaterial | null = null; // Initial value.


    protected _onClear(): void {
        super._onClear();

        if (this._material !== null) {
            this._material.dispose();
        }

        this._renderDisplay = null;
        this._material = null;
    }

    protected _initDisplay(value: any, isRetain: boolean): void {
        // tslint:disable-next-line:no-unused-expression
        value;
        // tslint:disable-next-line:no-unused-expression
        isRetain;
    }

    protected _disposeDisplay(value: any, isRelease: boolean): void {
        // tslint:disable-next-line:no-unused-expression
        value;

        if (!isRelease) {
            (value as THREE.Mesh).geometry.dispose(); //
        }
    }

    protected _onUpdateDisplay(): void {
        this._renderDisplay = (this._display ? this._display : this._rawDisplay) as THREE.Object3D;
        this._renderDisplay.matrixAutoUpdate = false;
    }

    protected _addDisplay(): void {
        if (this._armature === null) {
            throw new Error(`this._armature is null.`);
        }

        if (this._renderDisplay === null) {
            throw new Error(`this._renderDisplay is null.`);
        }

        const container = this._armature.display as ThreeArmatureDisplay;
        container.add(this._renderDisplay);
    }

    protected _replaceDisplay(value: any): void {
        if (this._armature === null) {
            throw new Error(`this._armature is null.`);
        }

        if (this._renderDisplay === null) {
            throw new Error(`this._renderDisplay is null.`);
        }

        const container = this._armature.display as ThreeArmatureDisplay;
        const prevDisplay = value as THREE.Object3D;
        container.add(this._renderDisplay);
        container.remove(prevDisplay);
    }

    protected _removeDisplay(): void {
        if (this._renderDisplay === null) {
            throw new Error(`this._renderDisplay is null.`);
        }

        if (this._renderDisplay.parent === null) {
            throw new Error(`this._renderDisplay.parent is null.`);
        }

        this._renderDisplay.parent.remove(this._renderDisplay);
    }

    protected _updateZOrder(): void {
        if (this._renderDisplay === null) {
            throw new Error(`this._renderDisplay is null.`);
        }


        this._renderDisplay.position.setZ(this._zOrder);
    }
    /**
     * @internal
     */
    public _updateVisible(): void {
        if (this._renderDisplay === null) {
            throw new Error(`this._renderDisplay is null.`);
        }

        if (this._parent === null) {
            throw new Error(`this._parent is null.`);
        }


        this._renderDisplay.visible = this._parent.visible && this._visible;
    }

    protected _updateBlendMode(): void {
        // switch (this._blendMode) {
        //     case BlendMode.Normal:
        //         break;

        //     case BlendMode.Add:
        //         break;

        //     case BlendMode.Darken:
        //         break;

        //     case BlendMode.Difference:
        //         break;

        //     case BlendMode.HardLight:
        //         break;

        //     case BlendMode.Lighten:
        //         break;

        //     case BlendMode.Multiply:
        //         break;

        //     case BlendMode.Overlay:
        //         break;

        //     case BlendMode.Screen:
        //         break;

        //     default:
        //         break;
        // }

        if (this._renderDisplay === this._rawDisplay) {
            const textureData = this._textureData as (ThreeTextureData | null);
            if (textureData === null) {
                return;
            }

            const textureAtlasData = textureData.parent as ThreeTextureAtlasData;
            if (textureAtlasData.renderTexture === null) {
                return;
            }

            if (textureAtlasData.material === null) {
                throw new Error(`textureAtlasData.material is null`);
            }

            const meshDisplay = this._renderDisplay as THREE.Mesh;

            if (this._blendMode !== BlendMode.Normal) {
                if (this._material === null) {
                    this._material = new MeshBasicMaterial();
                    this._material.copy(textureAtlasData.material);
                }

                this._material.blending = AdditiveBlending;
                meshDisplay.material = this._material;
            }
            else {
                meshDisplay.material = textureAtlasData.material;
            }
        }

        // TODO child armature.
    }

    protected _updateColor(): void {
        if (this._renderDisplay === this._rawDisplay) {
            const textureData = this._textureData as (ThreeTextureData | null);
            if (textureData === null) {
                return;
            }

            const textureAtlasData = textureData.parent as ThreeTextureAtlasData;
            if (textureAtlasData.renderTexture === null) {
                return;
            }

            if (textureAtlasData.material === null) {
                throw new Error(`textureAtlasData.material is null`);
            }

            const alpha = this._colorTransform.alphaMultiplier * this._globalAlpha;
            const meshDisplay = this._renderDisplay as THREE.Mesh;

            if (
                alpha !== 1.0 ||
                this._colorTransform.redMultiplier !== 1.0 ||
                this._colorTransform.greenMultiplier !== 1.0 ||
                this._colorTransform.blueMultiplier !== 1.0
            ) {
                if (this._material === null) {
                    this._material = new MeshBasicMaterial();
                    this._material.copy(textureAtlasData.material);
                }

                this._material.opacity = alpha;
                this._material.color.setRGB(
                    this._colorTransform.redMultiplier,
                    this._colorTransform.greenMultiplier,
                    this._colorTransform.blueMultiplier
                );
                meshDisplay.material = this._material;
            }
            else {
                meshDisplay.material = textureAtlasData.material;
            }
        }

        // TODO child armature.
    }

    /**
     * @todo Re-implementement with BufferGeometry.
     */
    protected _updateFrame(): void {
        const textureData = this._textureData as (ThreeTextureData | null);
        const meshDisplay = this._renderDisplay as THREE.Mesh;

        if (textureData === null) {
            meshDisplay.visible = false;
            meshDisplay.position.set(0.0, 0.0, meshDisplay.position.z);
            return;
        }

        const textureAtlasData = textureData.parent as ThreeTextureAtlasData;
        const renderTexture = textureAtlasData.renderTexture;

        if (textureAtlasData.material === null) {
            throw new Error(`textureAtlasData.material is null`);
        }

        if (renderTexture === null) {
            meshDisplay.visible = false;
            meshDisplay.position.set(0.0, 0.0, meshDisplay.position.z);
            return;
        }

        const textureAtlasWidth = textureAtlasData.width > 0.0 ? textureAtlasData.width : renderTexture.image.width;
        const textureAtlasHeight = textureAtlasData.height > 0.0 ? textureAtlasData.height : renderTexture.image.height;
        const textureX = textureData.region.x;
        const textureY = textureData.region.y;
        const textureWidth = textureData.region.width;
        const textureHeight = textureData.region.height;

        if (this._geometryData === null) {
            if (this._armature === null) {
                throw new Error(`this._armature is null.`);
            }

            if (this._armature._armatureData === null) {
                throw new Error(`this._armature._armatureData is null.`);
            }

            const scale = textureAtlasData.scale * this._armature._armatureData.scale;
            const rawUVs = ThreeSlot.RAW_UVS;
            const rawIndices = ThreeSlot.RAW_INDICES;
            const vertices: Vector3[] = [];
            const uvs: Vector2[] = [];

            for (let i = 0; i < 4; ++i) {
                const iD = i * 2;

                const uv = new Vector2(
                    rawUVs[iD],
                    rawUVs[iD + 1]);

                const vertex = new Vector3(
                    (uv.x * textureWidth * scale) - this._pivotX,
                    (uv.y * textureHeight * scale) - this._pivotY,
                    0.0
                );

                vertices.push(vertex);
                uvs.push(uv);

                if (textureData.rotated) {
                    uv.set(
                        (textureX + (1.0 - uv.y) * textureWidth) / textureAtlasWidth,
                        (textureY + uv.x * textureHeight) / textureAtlasHeight
                    );
                    continue;
                }

                uv.set(
                    (textureX + uv.x * textureWidth) / textureAtlasWidth,
                    1.0 - (textureY + uv.y * textureHeight) / textureAtlasHeight
                );
            }

            const indices: number[] = [];
            for (let i = 0; i < 2; ++i) {
                const iT = i * 3;

                indices.push(
                    rawIndices[iT],
                    rawIndices[iT + 1],
                    rawIndices[iT + 2]);
            }

            const _vertices = vertices.map(v => v.toArray()).flat();
            const _uvs = uvs.map(v => v.toArray()).flat();

            meshDisplay.geometry.setAttribute('position', new BufferAttribute(new Float32Array(_vertices), 3));
            meshDisplay.geometry.setAttribute('uv', new BufferAttribute(new Float32Array(_uvs), 2));
            meshDisplay.geometry.setIndex(indices);

            meshDisplay.geometry.attributes.position.needsUpdate = true;
            meshDisplay.geometry.attributes.uv.needsUpdate = true;
            meshDisplay.geometry.computeBoundingBox();

            if (this._material !== null) {
                this._material.copy(textureAtlasData.material);
            }

            meshDisplay.material = textureAtlasData.material;
            this._visibleDirty = true;
            return;
        }

        // Mesh.
        const data = this._geometryData.data;
        if (data === null) {
            throw new Error(`data is null.`);
        }

        const intArray = data.intArray;
        const floatArray = data.floatArray;
        if (intArray === null) {
            throw new Error(`intArray is null.`);
        }
        if (floatArray === null) {
            throw new Error(`floatArray is null.`);
        }

        const vertexCount = intArray[this._geometryData.offset + BinaryOffset.GeometryVertexCount];
        const triangleCount = intArray[this._geometryData.offset + BinaryOffset.GeometryTriangleCount];
        let vertexOffset = intArray[this._geometryData.offset + BinaryOffset.GeometryFloatOffset];

        if (vertexOffset < 0) {
            vertexOffset += 65536; // Fixed out of bouds bug. 
        }

        const uvOffset = vertexOffset + vertexCount * 2;
        const indexOffset = this._geometryData.offset + BinaryOffset.GeometryVertexIndices;

        if (this._armature === null) {
            throw new Error(`this._armature is null.`);
        }

        if (this._armature._armatureData === null) {
            throw new Error(`this._armature._armatureData is null.`);
        }

        const scale = this._armature._armatureData.scale;
        const vertices: Vector3[] = [];
        const uvs: Vector2[] = [];

        for (let i = 0, l = vertexCount; i < l; ++i) {
            let iD = i * 2
            const vertex = new Vector3(
                floatArray[vertexOffset + iD] * scale,
                floatArray[vertexOffset + iD + 1] * scale,
                0.0);

            const uv = new Vector2(
                floatArray[uvOffset + iD],
                floatArray[uvOffset + iD + 1]);

            vertices.push(vertex);
            uvs.push(uv);

            if (textureData.rotated) {
                uv.set(
                    (textureX + (1.0 - uv.y) * textureWidth) / textureAtlasWidth,
                    (textureY + uv.x * textureHeight) / textureAtlasHeight
                );
                continue;
            }

            uv.set(
                (textureX + uv.x * textureWidth) / textureAtlasWidth,
                1.0 - (textureY + uv.y * textureHeight) / textureAtlasHeight
            );
        }

        const indices: number[] = [];
        for (let i = 0; i < triangleCount; ++i) {
            const iT = i * 3;
            indices.push(
                intArray[indexOffset + iT],
                intArray[indexOffset + iT + 1],
                intArray[indexOffset + iT + 2]);
        }

        const _vertices = vertices.map(v => v.toArray()).flat();
        const _uvs = uvs.map(v => v.toArray()).flat();

        meshDisplay.geometry.setAttribute('position', new BufferAttribute(new Float32Array(_vertices), 3));
        meshDisplay.geometry.setAttribute('uv', new BufferAttribute(new Float32Array(_uvs), 2));
        meshDisplay.geometry.setIndex(indices);

        meshDisplay.geometry.attributes.position.needsUpdate = true;
        meshDisplay.geometry.attributes.uv.needsUpdate = true;
        meshDisplay.geometry.computeBoundingBox();

        if (this._material !== null) {
            this._material.copy(textureAtlasData.material);
        }

        meshDisplay.material = textureAtlasData.material;
        this._visibleDirty = true;
    }

    /**
     * @todo Re-implementement with BufferGeometry.
     */
    protected _updateMesh(): void {

        if (this._armature === null) {
            throw new Error(`this._armature is null.`);
        }

        if (this._armature._armatureData === null) {
            throw new Error(`this._armature._armatureData is null.`);
        }

        const scale = this._armature._armatureData.scale;
        const deformVertices = (this._displayFrame as DisplayFrame).deformVertices;
        const bones = this._geometryBones;
        const geometryData = this._geometryData as GeometryData;
        const weightData = geometryData.weight;

        const hasDeform = deformVertices.length > 0 && geometryData.inheritDeform;
        const meshDisplay = this._renderDisplay as THREE.Mesh;

        if (weightData !== null) {
            const data = geometryData.data;
            if (data === null) {
                throw new Error(`data is null.`);
            }

            const intArray = data.intArray;
            const floatArray = data.floatArray;
            if (intArray === null) {
                throw new Error(`intArray is null.`);
            }
            if (floatArray === null) {
                throw new Error(`floatArray is null.`);
            }

            const vertexCount = intArray[geometryData.offset + BinaryOffset.GeometryVertexCount];
            let weightFloatOffset = intArray[weightData.offset + BinaryOffset.WeigthFloatOffset];

            if (weightFloatOffset < 0) {
                weightFloatOffset += 65536; // Fixed out of bounds bug. 
            }

            const positions = Array.from(meshDisplay.geometry.getAttribute('position').array);
            let iB = weightData.offset + BinaryOffset.WeigthBoneIndices + bones.length,
                iV = weightFloatOffset,
                iF = 0;
            for (let i = 0; i < vertexCount; ++i) {
                const boneCount = intArray[iB++];
                let xG = 0.0, yG = 0.0;

                for (let j = 0; j < boneCount; ++j) {
                    const boneIndex = intArray[iB++];
                    const bone = bones[boneIndex];

                    if (bone !== null) {
                        const matrix = bone.globalTransformMatrix;
                        const weight = floatArray[iV++];
                        let xL = floatArray[iV++] * scale;
                        let yL = floatArray[iV++] * scale;

                        if (hasDeform) {
                            xL += deformVertices[iF++];
                            yL += deformVertices[iF++];
                        }

                        xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                        yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                    }
                }

                positions[3 * i] = xG;
                positions[3 * i + 1] = yG;
                positions[3 * i + 2] = this._zOrder * 0.1;
            }

            meshDisplay.geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
            meshDisplay.geometry.attributes.position.needsUpdate = true;
            meshDisplay.geometry.computeBoundingBox();

            return;
        }

        if (!hasDeform) {
            return;
        }

        const isSurface = (this._parent as any)._boneData.type !== BoneType.Bone;
        const data = geometryData.data;
        const intArray = (data as any).intArray;
        const floatArray = (data as any).floatArray;
        const vertexCount = intArray[geometryData.offset + BinaryOffset.GeometryVertexCount];
        let vertexOffset = intArray[geometryData.offset + BinaryOffset.GeometryFloatOffset];

        if (vertexOffset < 0) {
            vertexOffset += 65536; // Fixed out of bounds bug. 
        }

        const positions = Array.from(meshDisplay.geometry.getAttribute('position').array);

        for (let i = 0, l = vertexCount * 3; i < l; i += 3) {
            const x = floatArray[vertexOffset + i] * scale + deformVertices[i];
            const y = floatArray[vertexOffset + i + 1] * scale + deformVertices[i + 1];


            if (isSurface) {
                // @ts-ignore
                const matrix = (this._parent as Surface)._getGlobalTransformMatrix(x, y);
                positions[i] = matrix.a * x + matrix.c * y + matrix.tx;
                positions[i + 1] = matrix.b * x + matrix.d * y + matrix.ty;
                positions[i + 2] = 0;
            }
            else {
                positions[i] = x;
                positions[i + 1] = y;
                positions[i + 2] = 0;
            }
        }

        meshDisplay.geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
        meshDisplay.geometry.attributes.position.needsUpdate = true;
        meshDisplay.geometry.computeBoundingBox();
    }

    protected _updateTransform(): void {
        if (this._renderDisplay === null) {
            throw new Error(`this._renderDisplay is null.`);
        }

        const globalTransformMatrix = this.globalTransformMatrix;
        const displayMatrixElements = this._renderDisplay.matrix.elements;
        displayMatrixElements[0] = globalTransformMatrix.a;
        displayMatrixElements[1] = globalTransformMatrix.b;
        displayMatrixElements[4] = globalTransformMatrix.c;
        displayMatrixElements[5] = globalTransformMatrix.d;
        displayMatrixElements[12] = globalTransformMatrix.tx;
        displayMatrixElements[13] = globalTransformMatrix.ty;
        displayMatrixElements[14] = this._zOrder * 0.1;
        this._renderDisplay.matrixWorldNeedsUpdate = true;
    }

    protected _identityTransform(): void {
        if (this._renderDisplay === null) {
            throw new Error(`this._renderDisplay is null.`);
        }

        this._renderDisplay.matrix.identity();
    }
}