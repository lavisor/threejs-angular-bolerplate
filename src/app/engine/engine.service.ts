import * as THREE from 'three';
import * as dat from 'dat.gui';
import {ElementRef, Injectable, NgZone, OnDestroy, OnInit} from '@angular/core';

@Injectable({providedIn: 'root'})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private gui: any;
  private cube: THREE.Mesh;
  private cameraFolder: any;
  private cameraPos: any = {
    x: 0, 
    y: 0, 
    z: 5
  }
  private frameId: number = null;

  public constructor(private ngZone: NgZone) {
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public ngOnInit(){

  }
  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // create a gui element 
    this.gui = new dat.GUI();
    this.cameraFolder = this.gui.addFolder('Camera-position');


    this.cameraFolder.add(this.cameraPos, "x" , -1, 1).name("x");
    this.cameraFolder.add(this.cameraPos,"y" ,  -1, 1).name("y");
    this.cameraFolder.add(this.cameraPos,"z" ,  0, 5).name("z");
    // this.cameraFOlder.open();

    // this.gui.remember(this.cubeDimentions);


    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);

    // soft white light
    this.light = new THREE.AmbientLight(0x404040);
    this.light.position.z = 10;
    this.scene.add(this.light);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.z);
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
