import * as THREE from 'three';
import {
    Armature, DragonBones, EventObject, EventStringType, IArmatureProxy, Animation
} from '@flyskypie/dragonbones-js';

/**
 * @inheritDoc
 */
export class ThreeArmatureDisplay extends THREE.Group implements IArmatureProxy {
    /**
     * @private
     */
    public debugDraw: boolean = false;
    private _debugDraw: boolean = false;
    // private _disposeProxy: boolean = false;
    private _armature: Armature = null as any;
    private _debugDrawer: THREE.Group | null = null;
    /**
     * @inheritDoc
     */
    public dbInit(armature: Armature): void {
        this._armature = armature;
    }
    /**
     * @inheritDoc
     */
    public dbClear(): void {
        if (this._debugDrawer !== null) {
        }

        this._armature = null as any;
        this._debugDrawer = null;
    }
    /**
     * @inheritDoc
     */
    public dbUpdate(): void {
        const drawed = DragonBones.debugDraw || this.debugDraw;
        if (drawed || this._debugDraw) {
            this._debugDraw = drawed;
            if (this._debugDraw) {
                if (this._debugDrawer === null) {
                    this._debugDrawer = new THREE.Group();
                }

                this.add(this._debugDrawer);
            }
            else if (this._debugDrawer !== null && this._debugDrawer.parent === this) {
                this.remove(this._debugDrawer);
            }
        }
    }
    /**
     * @inheritDoc
     */
    public dispose(disposeProxy: boolean = true): void {
        // tslint:disable-next-line:no-unused-expression
        disposeProxy;
        if (this._armature !== null) {
            this._armature.dispose();
            this._armature = null as any;
        }
    }
    /**
     * @private
     */
    public dispatchDBEvent(type: EventStringType, eventObject: EventObject): void {
        // tslint:disable-next-line:no-unused-expression
        type;
        this.dispatchEvent(eventObject);
    }
    /**
     * @inheritDoc
     */
    public hasDBEventListener(type: EventStringType): boolean {
        const listeners = (this as any)._listeners; //
        return listeners !== undefined && type in listeners;
    }
    /**
     * @inheritDoc
     */
    public addDBEventListener(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
        listener.bind(target);
        this.addEventListener(type, listener as any);
    }
    /**
     * @inheritDoc
     */
    public removeDBEventListener(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
        // tslint:disable-next-line:no-unused-expression
        target;
        this.removeEventListener(type, listener as any);
    }
    /**
     * @inheritDoc
     */
    public get armature(): Armature {
        return this._armature;
    }
    /**
     * @inheritDoc
     */
    public get animation(): Animation {
        return this._armature.animation;
    }

    /**
     * @inheritDoc
     */
    public hasEvent(type: EventStringType): boolean {
        return this.hasDBEventListener(type);
    }
    /**
     * @inheritDoc
     */
    public addEvent(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
        this.addDBEventListener(type, listener, target);
    }
    /**
     * @inheritDoc
     */
    public removeEvent(type: EventStringType, listener: (event: EventObject) => void, target: any): void {
        this.removeDBEventListener(type, listener, target);
    }
}
