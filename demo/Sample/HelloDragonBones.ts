import { ThreeFactory } from '@dragonbones-threejs';

import { BaseDemo } from './BaseDemo';

import skeJson from '../assets/mecha_1004d_ske.json?url';
import texJson from '../assets/mecha_1004d_tex.json?url';
import texPng from '../assets/mecha_1004d_tex.png';

/**
 * How to use
 * 1. Load data.
 *
 * 2. Parse data.
 *    factory.parseDragonBonesData();
 *    factory.parseTextureAtlasData();
 *
 * 3. Build armature.
 *    armatureDisplay = factory.buildArmatureDisplay("armatureName");
 *
 * 4. Play animation.
 *    armatureDisplay.animation.play("animationName");
 *
 * 5. Add armature to stage.
 *    addChild(armatureDisplay);
 */
export class HelloDragonBones extends BaseDemo {
    public constructor() {
        super();

        this._resources.push(
            skeJson, texJson, texPng,
        );
    }

    protected _onStart(): void {
        const factory = ThreeFactory.factory;
        // factory.parseDragonBonesData(this._pixiResource["resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.json"].data);
        factory.parseDragonBonesData(this._loadedResources[skeJson]);
        factory.parseTextureAtlasData(this._loadedResources[texJson],
            this._loadedResources[texPng]);

        const armatureDisplay = factory.buildArmatureDisplay("mecha_1004d");

        if (armatureDisplay === null) {
            return;
        }

        armatureDisplay.animation.play("walk");

        armatureDisplay.position.setX(0.0);
        armatureDisplay.position.setY(200.0);
        this.add(armatureDisplay);
    }
}