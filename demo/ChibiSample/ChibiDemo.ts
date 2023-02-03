import { ThreeArmatureDisplay, ThreeFactory } from '@dragonbones-threejs';

import { BaseDemo } from './BaseDemo';

import skeJson from './lyana/lyana_ske.json?url';
import texJson from './lyana/lyana_tex.json?url';
import texPng from './lyana/lyana_tex.png';

export class ChibiDemo extends BaseDemo {
    armatureDisplay?: ThreeArmatureDisplay;

    public constructor() {
        super();

        this._resources.push(skeJson, texJson, texPng,);
        this.setUpControls();
    }

    protected _onStart(): void {
        const factory = ThreeFactory.factory;
        factory.parseDragonBonesData(this._loadedResources[skeJson]);
        factory.parseTextureAtlasData(this._loadedResources[texJson],
            this._loadedResources[texPng]);

        const armatureDisplay = factory.buildArmatureDisplay("Lyana");

        if (armatureDisplay === null) {
            return;
        }

        armatureDisplay.animation.play("wait", 0);

        armatureDisplay.position.setX(0.0);
        armatureDisplay.position.setY(180.0);
        this.add(armatureDisplay);
        this.armatureDisplay = armatureDisplay;
    }

    private setUpControls() {
        const idleBtn = document.querySelector("#idle");
        idleBtn?.addEventListener('click', () => {
            this.armatureDisplay?.animation.play("wait", 0);
        })

        const attackBtn = document.querySelector("#attack");
        attackBtn?.addEventListener('click', () => {
            this.armatureDisplay?.animation.play("attack", 0);
        })

        const moveBtn = document.querySelector("#move");
        moveBtn?.addEventListener('click', () => {
            this.armatureDisplay?.animation.play("move", 0);
        })
    }
}