import * as THREE from "three";

import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertexParticles.glsl";
import * as dat from "dat.gui";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import texture from "./img/point.svg";
import backend from "./img/large/bed.svg";
import frontend from "./img/large/fed.svg";
import brand from "./img/large/br.svg";
import ux from "./img/large/ux.svg";
import ui from "./img/large/ui.svg";
import ma from "./img/large/ma.svg";
import ts from "./img/large/ts.svg";
import td from "./img/large/td.svg";
import md from "./img/large/md.svg";
import dm from "./img/large/dm.svg";




class Scene {
  constructor() {
    this.buttons = document.querySelectorAll(".links");
    this.services = document.querySelectorAll("button");
    this.btns = Array.from(this.buttons);
    this.srvcs = Array.from(this.services);
    this.time = 0;
    this.hovered = false;
    this.container = document.getElementById("scene");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(
      35,
      this.width / this.height,
      0.1,
      700
    );
    this.camera.position.z = 1.7;

    this.scene = new THREE.Scene();


    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(2 || window.devicePixelRatio);

    this.guiParams = {
      speed: 0.0,
      posY: 0,
      partNum: 4635,
      distance: 0.1,
      count: 17,
      color: [1.0, 1.0, 1.0],
      bgColor: 0x000000,
    };
    this.colors = {
      red: 1,
      green: 1,
      blue: 1,
    };
    this.sizes = [];
    this.defSizes = [];

    this.group = new THREE.Group();
    this.scene.background = new THREE.Color(this.guiParams.bgColor);
    this.scene.add(this.group);
    this.mouse = new THREE.Vector2();
    this.loader = new THREE.TextureLoader();

    this.texture = this.loader.load(texture);
    this.texture_1 = this.loader.load(ux);
    this.texture_2 = this.loader.load(ui);
    this.texture_3 = this.loader.load(frontend);
    this.texture_4 = this.loader.load(backend);
    this.texture_5 = this.loader.load(brand);
    this.texture_6 = this.loader.load(ma);
    this.texture_7 = this.loader.load(ts);
    this.texture_8 = this.loader.load(td);
    this.texture_9 = this.loader.load(md);
    this.texture_10 = this.loader.load(dm);

    this.scale = {
      partSize: 2,
      changedPartSize: 10,
    };

    this.resize();
    this.addObject();

    this.parts = {
      first: 3,
      second: 3,
      third: 3,
      fourth: 3,
      five: 3,
      six: 3,
      seven: 3,
      eight: 3,
      nine: 3,
      ten: 3,
    };
    this.endAnim = false;
    this.bindEvents();
    this.render();
    // this.addGUI();
    // this.test()
  }

  bindEvents() {
    window.addEventListener("resize", this.resize.bind(this));
    document.addEventListener("mouseleave", (e) => {
      this.hovered = false;
      this.stopAllAnim();
    });
    this.srvcs.forEach((s) => {
      s.addEventListener("mouseleave", (e) => {
        this.hovered = false;
        this.stopAllAnim();
      });
    });
    this.btns.forEach((b, i) => {
      b.addEventListener("mouseover", (e) => {
        this.hovered = true;
        this.animateCube(e, i);
      });
      this.stopAllAnim();
      // });
    });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height
    this.camera.aspect = this.aspect
    if (this.aspect >= 1) this.camera.position.z = 1.7
    else if (this.aspect < 1) this.camera.position.z = 2.4

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  addObject() {
    this.geometry = new THREE.BufferGeometry();
    let count = this.guiParams.count;
    this.position = new Float32Array(count * count * count * 3);
    this.colors2 = [];
    this.color = new THREE.Color("#ffffff");
    this.textureIndex = [];
    let distance = this.guiParams.distance;
    let t = 0;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        for (let k = 0; k < count; k++) {
          this.position.set(
            [j * distance, k * distance, i * distance],
            i * count * count * 3 + count * 3 * j + k * 3
          );

          this.sizes[t] = this.scale.partSize;
          this.defSizes[t] = this.scale.partSize;
          this.textureIndex[t] = t;
          this.color.toArray(this.colors2, t * 3);
          t++;
        }
      }
    }
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.position, 3)
    );
    this.geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(this.sizes, 1)
    );
    this.geometry.setAttribute(
      "customColor",
      new THREE.Float32BufferAttribute(this.colors2, 3)
    );
    this.geometry.setAttribute(
      "textureIndex",
      new THREE.Float32BufferAttribute(this.textureIndex, 1)
    );
    this.uniforms = {
      // u_time: { value: this.clock.getElapsedTime() },
      // u_size: { value: 32.4 },
      u_color: { value: this.guiParams.color },
      textures: {
        value: [
          this.texture,
          this.texture_2,
          this.texture_1,
          this.texture_3,
          this.texture_4,
          this.texture_5,
          this.texture_6,
          this.texture_7,
          this.texture_8,
          this.texture_9,
          this.texture_10,
        ],
      },
      progress: { type: "f", value: 0 },
      progress_two: { type: "f", value: 0 },
      progress_three: { type: "f", value: 0 },
      progress_four: { type: "f", value: 0 },
      progress_five: { type: "f", value: 0 },
      progress_six: { type: "f", value: 0 },
      progress_seven: { type: "f", value: 0 },
      progress_eight: { type: "f", value: 0 },
      progress_nine: { type: "f", value: 0 },
      progress_ten: { type: "f", value: 0 },
    };
    this.geometry.colors = this.colors2;
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: this.uniforms,
    });
    this.cube = new THREE.Points(this.geometry, this.material);
    this.cube.position.set(
      -(((count - 1) * distance) / 2),
      (-(count - 1) * distance) / 2 - 0.02,
      (-(count - 1) * distance) / 2
    );
    this.group.add(this.cube);
  }

  animate() {
    this.time += 0.005;
    this.rotY = Math.sin(this.time) / 400;
    this.rotX = Math.cos(this.time) / 400;

    if (!this.hovered) {
      this.group.rotation.y -= this.rotY;
    } else {
      this.group.rotation.y += this.rotY / 20;
      this.group.rotation.x += this.rotX / 20;

    }

    this.cube.geometry.attributes.size.array[4671] = this.parts.first;
    this.cube.geometry.attributes.size.array[4634] = this.parts.second;
    this.cube.geometry.attributes.size.array[4741] = this.parts.third;
    this.cube.geometry.attributes.size.array[1596] = this.parts.fourth;
    this.cube.geometry.attributes.size.array[3279] = this.parts.five;
    this.cube.geometry.attributes.size.array[1572] = this.parts.six;
    this.cube.geometry.attributes.size.array[2683] = this.parts.seven;
    this.cube.geometry.attributes.size.array[4899] = this.parts.eight;
    this.cube.geometry.attributes.size.array[2707] = this.parts.nine;
    this.cube.geometry.attributes.size.array[3454] = this.parts.ten;

    this.cube.geometry.attributes.size.needsUpdate = true;

    this.cube.geometry.attributes.customColor.needsUpdate = true;
    this.cube.geometry.attributes.textureIndex.needsUpdate = true;

    this.material.uniforms.u_color.value[0] = this.colors.red;
    this.material.uniforms.u_color.value[1] = this.colors.green;
    this.material.uniforms.u_color.value[2] = this.colors.blue;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
    this.animate();
  }
  addGUI() {
    const gui = new GUI();
    const cubeFolder = gui.addFolder("Cube");
    cubeFolder.add(this.camera.position, "z", 0, 50, 0.01);
    cubeFolder.add(this.guiParams, "speed", -0.01, 0.01, 0.0002);
    cubeFolder.add(this.guiParams, "count", 1, 30, 1);
    cubeFolder.open();
    const colorFolder = gui.addFolder("Color");
    colorFolder.add(this.colors, "red", 0, 1, 0.001);
    colorFolder.add(this.colors, "green", 0, 1, 0.001);
    colorFolder.add(this.colors, "blue", 0, 1, 0.001);
    colorFolder.open();
    const positionFolder = gui.addFolder("Position");
    positionFolder.add(this.guiParams, "posY", -0.5, 0.5, 0.001);
    positionFolder.open();
    const bgFolder = gui.addFolder("Background");
    bgFolder.addColor(this.guiParams, "bgColor");
    bgFolder.open();
    const pointsFolder = gui.addFolder("Points");
    pointsFolder.add(this.guiParams, "partNum", 0, 4913, 1);
    pointsFolder.open();
  }

  animateCube(e, i) {
    if (e.target.attributes[1].value === "ux") {
      this.makeAnimation(4671, 0.4958, 0.5409, true, false);
    } else if (e.target.attributes[1].value === "ui") {
      this.makeAnimation(4634, 0.2002, 0.7004, true, false);
    } else if (e.target.attributes[1].value === "fed") {
      this.makeAnimation(4741, 0.7456, 0.1116, true, false);
    } else if (e.target.attributes[1].value === "bed") {
      this.makeAnimation(1596, 2.037, 0.595, true, false);
    } else if (e.target.attributes[1].value === "br") {
      this.makeAnimation(3279, 1.148, 0.405, true, false);
    } else if (e.target.attributes[1].value === "ma") {
      this.makeAnimation(1572, 1.0, 1.75, true, false);
    } else if (e.target.attributes[1].value === "ts") {
      this.makeAnimation(2683, 1.12, 0.89, true, false);
    } else if (e.target.attributes[1].value === "3d") {
      this.makeAnimation(4899, -0.4, -0.855, true, false);
    } else if (e.target.attributes[1].value === "md") {
      this.makeAnimation(2707, -1.4, -0.65, true, false);
    } else if (e.target.attributes[1].value === "dm") {
      this.makeAnimation(3454, -0.49, -1.355, true, false);
    }
  }
  stopAnimation(e, i) {
    if (e.target.attributes[0].value === "ux") {
      this.makeAnimation(4671, 0, 0, false, true, i);
    } else if (e.target.attributes[0].value === "ui") {
      this.makeAnimation(4634, 0, 0, false, true, i);
    } else if (e.target.attributes[0].value === "fed") {
      this.makeAnimation(4741, 0, 0, false, true, i);
    } else if (e.target.attributes[0].value === "bed") {
      this.makeAnimation(1596, 0, 0, false, true, i);
    } else if (e.target.attributes[0].value === "br") {
      this.makeAnimation(3279, 0, 0, false, true, i);
    } else if (e.target.attributes[0].value === "ma") {
      this.makeAnimation(1572, 0, 0, false, true);
    } else if (e.target.attributes[0].value === "ts") {
      this.makeAnimation(2683, 0, 0, false, true);
    } else if (e.target.attributes[0].value === "3d") {
      this.makeAnimation(4899, 0, 0, false, true);
    } else if (e.target.attributes[0].value === "md") {
      this.makeAnimation(2707, 0, 0, false, true);
    } else if (e.target.attributes[0].value === "dm") {
      this.makeAnimation(3454, 0, 0, false, true);
    }
  }
  makeAnimation(pointNumber, x, y, scale, finish, i) {
    this.timeline = new gsap.timeline();
    this.timeline.to(this.group.rotation, {
      onStart: () => {
        scale ? (this.endAnim = false) : null;
      },
      y: y,
      x: x,
      duration: 1,
      onComplete: () => {
        !scale ? (this.endAnim = true) : null;
      },
    });

    if (pointNumber === 4671) {
      this.defaultPosAnim();
      gsap.to(this.parts, {
        onStart: () => {
          this.animateProgress(this.material.uniforms.progress, scale);
        },
        first: scale ? this.scale.partSize * 180 : this.scale.partSize,
        duration: 1,
        ease: scale ? "power4.in" : "power4.out",
      });
    }
    if (pointNumber === 4634) {
      this.defaultPosAnim();
      gsap.to(this.parts, {
        onStart: () => {
          this.animateProgress(this.material.uniforms.progress_two, scale);
        },
        second: scale ? this.scale.partSize * 150 : this.scale.partSize,
        duration: 1,
        ease: scale ? "power4.in" : "power4.out",
      });
    }
    if (pointNumber === 4741) {
      this.defaultPosAnim();
      gsap.to(this.parts, {
        onStart: () => {
          this.animateProgress(this.material.uniforms.progress_three, scale);
        },
        third: scale ? this.scale.partSize * 150 : this.scale.partSize,
        duration: 1,
        ease: scale ? "power4.in" : "power4.out",
      });
    }
    if (pointNumber === 1596) {
      this.defaultPosAnim();
      gsap.to(this.parts, {
        onStart: () => {
          this.animateProgress(this.material.uniforms.progress_four, scale);
        },
        fourth: scale ? this.scale.partSize * 200 : this.scale.partSize,
        duration: 1,
        ease: scale ? "power4.in" : "power4.out",
      });
    }
    if (pointNumber === 3279) {
      this.defaultPosAnim();
      gsap.to(this.parts, {
        onStart: () => {
          this.animateProgress(this.material.uniforms.progress_five, scale);
        },
        five: scale ? this.scale.partSize * 200 : this.scale.partSize,
        duration: 1,
        ease: scale ? "power4.in" : "power4.out",
      });
    }
    if (pointNumber === 1572) {
      this.defaultPosAnim();
      gsap.to(this.parts, {
        onStart: () => {
          this.animateProgress(this.material.uniforms.progress_six, scale);
        },
        six: scale ? this.scale.partSize * 280 : this.scale.partSize,
        duration: 1,
        ease: scale ? "power4.in" : "power4.out",
      });
    }
    if (pointNumber === 2683) {
      this.defaultPosAnim();
      gsap.to(this.parts, {
        onStart: () => {
          this.animateProgress(this.material.uniforms.progress_seven, scale);
        },
        seven: scale ? this.scale.partSize * 200 : this.scale.partSize,
        duration: 1,
        ease: scale ? "power4.in" : "power4.out",
      });
    }
    if (pointNumber === 4899) {
      this.defaultPosAnim();
      gsap.to(this.parts, {
        onStart: () => {
          this.animateProgress(this.material.uniforms.progress_eight, scale);
        },
        eight: scale ? this.scale.partSize * 110 : this.scale.partSize,
        duration: 1,
        ease: scale ? "power4.in" : "power4.out",
      });
    }
    if (pointNumber === 2707) {
      this.defaultPosAnim();
      gsap.to(this.parts, {
        onStart: () => {
          this.animateProgress(this.material.uniforms.progress_nine, scale);
        },
        nine: scale ? this.scale.partSize * 280 : this.scale.partSize,
        duration: 1,
        ease: scale ? "power4.in" : "power4.out",
      });
    }
    if (pointNumber === 3454) {
      this.defaultPosAnim();
      gsap.to(this.parts, {
        onStart: () => {
          this.animateProgress(this.material.uniforms.progress_ten, scale);
        },
        ten: scale ? this.scale.partSize * 200 : this.scale.partSize,
        duration: 1,
        ease: scale ? "power4.in" : "power4.out",
      });
    }
  }
  stopAllAnim() {
    this.defaultPosAnim();
    gsap.to(this.group.rotation, {
      y: 0,
      x: 0,
      duration: 1,
    });

  }
  defaultPosAnim(target) {
    this.progresses = [
      this.material.uniforms.progress,
      this.material.uniforms.progress_two,
      this.material.uniforms.progress_three,
      this.material.uniforms.progress_four,
      this.material.uniforms.progress_five,
      this.material.uniforms.progress_six,
      this.material.uniforms.progress_seven,
      this.material.uniforms.progress_eight,
      this.material.uniforms.progress_nine,
      this.material.uniforms.progress_ten,
    ];
    this.animateProgress(this.progresses);
    gsap.to(this.parts, {
      first: this.scale.partSize,
      second: this.scale.partSize,
      third: this.scale.partSize,
      fourth: this.scale.partSize,
      five: this.scale.partSize,
      six: this.scale.partSize,
      seven: this.scale.partSize,
      eight: this.scale.partSize,
      nine: this.scale.partSize,
      ten: this.scale.partSize,
      duration: 1,
      ease: "power4.out",
    });
  }
  animateProgress(target, scale) {
    gsap.to(target, {
      value: scale ? 1 : 0,
      duration: 1,
      ease: scale ? "power4.in" : "power4.out",
    });
  }
}

new Scene();
