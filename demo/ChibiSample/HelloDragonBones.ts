import { ThreeFactory } from '@dragonbones-threejs';

import { BaseDemo } from './BaseDemo';

import skeJson from './lyana/lyana_ske.json?url';
import texJson from './lyana/lyana_tex.json?url';
import texPng from './lyana/lyana_tex.png';

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

        console.log(this._loadedResources[texPng]);

        const armatureDisplay = factory.buildArmatureDisplay("Lyana");

        if (armatureDisplay === null) {
            return;
        }

        armatureDisplay.animation.play("attack", 0);

        armatureDisplay.position.setX(0.0);
        armatureDisplay.position.setY(200.0);
        this.add(armatureDisplay);
    }
}