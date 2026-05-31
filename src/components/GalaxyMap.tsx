import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SystemData } from '../data';
import { Html, Text } from '@react-three/drei';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorSource;
  uniform vec3 uColorTarget;
  uniform float uSpeed;
  uniform float uOpacity;
  uniform float uScale;
  
  varying vec2 vUv;

  float random (in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise (in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f*f*(3.0-2.0*f);

      return mix(a, b, u.x) +
              (c - a)* u.y * (1.0 - u.x) +
              (d - b) * u.x * u.y;
  }

  float fbm (in vec2 st) {
      float value = 0.0;
      float amplitude = .5;
      float frequency = 0.;
      for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= .5;
      }
      return value;
  }

  void main() {
      vec2 st = vUv * uScale;
      // Parallax scrolling movement
      st.x += uTime * uSpeed;
      st.y += uTime * (uSpeed * 0.4);

      float q = fbm(st);
      
      vec2 r = vec2(0.0);
      r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*uTime * 0.5 );
      r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*uTime * 0.5 );
      float f = fbm(st+r);

      vec3 color = mix(uColorSource, uColorTarget, f);
      
      // Radial fade to hide edges
      float dist = distance(vUv, vec2(0.5));
      float alpha = smoothstep(0.5, 0.0, dist) * f * uOpacity;

      gl_FragColor = vec4(color, alpha);
  }
`;

function NebulaPlane({ position, size, colorSource, colorTarget, speed, opacity, scaleParams }: {
  position: [number, number, number], size: number, colorSource: string, colorTarget: string, speed: number, opacity: number, scaleParams: number
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorSource: { value: new THREE.Color(colorSource) },
    uColorTarget: { value: new THREE.Color(colorTarget) },
    uSpeed: { value: speed },
    uOpacity: { value: opacity },
    uScale: { value: scaleParams }
  }), [colorSource, colorTarget, speed, opacity, scaleParams]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const warpVertexShader = `
  uniform vec3 uCameraPos;
  uniform vec3 uVelocity;
  attribute float aSize;
  varying float vAlpha;
  varying vec3 vViewPos;
  
  void main() {
    vec3 pos = position;
    
    // Wrap around camera
    vec3 localPos = pos - uCameraPos;
    float boxSize = 100.0;
    localPos = mod(localPos + boxSize/2.0, boxSize) - boxSize/2.0;

    vec3 worldPos = uCameraPos + localPos;
    vec4 mvPosition = viewMatrix * vec4(worldPos, 1.0);
    vViewPos = mvPosition.xyz;
    
    float speed = length(uVelocity);
    
    // Map speed ~[2..15] to alpha (visible only when dragging/moving fast)
    vAlpha = smoothstep(1.0, 10.0, speed);
    
    // Increase size based on speed to simulate motion trails/glows
    gl_PointSize = aSize * (200.0 / -mvPosition.z) * (1.0 + speed * 0.4);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const warpFragmentShader = `
  varying float vAlpha;
  varying vec3 vViewPos;
  
  void main() {
    vec2 st = gl_PointCoord - vec2(0.5);
    float dist = length(st);
    if (dist > 0.5) discard;
    
    // Soft core to simulate glow
    float intensity = pow(max(0.0, 1.0 - dist * 2.0), 1.5);
    
    vec3 color = vec3(0.5, 0.8, 1.0); // Electric light blue
    
    // Fade out elements very close to avoid clipping near plane
    float depthFade = smoothstep(0.0, 10.0, -vViewPos.z);
    
    gl_FragColor = vec4(color, intensity * vAlpha * depthFade);
  }
`;

function WarpParticles() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const [positions, sizes] = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    for(let i=0; i<count; i++) {
       pos[i*3] = (Math.random() - 0.5) * 100;
       pos[i*3+1] = (Math.random() - 0.5) * 100;
       pos[i*3+2] = (Math.random() - 0.5) * 100;
       size[i] = Math.random() * 2.0 + 1.0;
    }
    return [pos, size];
  }, []);

  const prevCamPos = useRef(new THREE.Vector3());
  const smoothedVelocity = useRef(new THREE.Vector3());
  const isInitialized = useRef(false);

  useFrame((state, delta) => {
    const camPos = state.camera.position;
    
    if (!isInitialized.current) {
      prevCamPos.current.copy(camPos);
      isInitialized.current = true;
      return;
    }

    const dt = Math.max(0.001, Math.min(delta, 0.1)); 
    const vel = new THREE.Vector3().subVectors(camPos, prevCamPos.current).divideScalar(dt);
    
    smoothedVelocity.current.lerp(vel, 0.1);
    prevCamPos.current.copy(camPos);

    if (materialRef.current) {
      materialRef.current.uniforms.uCameraPos.value.copy(camPos);
      materialRef.current.uniforms.uVelocity.value.copy(smoothedVelocity.current);
    }
  });

  const uniforms = useMemo(() => ({
    uCameraPos: { value: new THREE.Vector3() },
    uVelocity: { value: new THREE.Vector3() }
  }), []);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={sizes.length} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={warpVertexShader}
        fragmentShader={warpFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const bgStarVertexShader = `
  attribute float aSize;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const bgStarFragmentShader = `
  varying vec3 vColor;
  void main() {
    vec2 st = gl_PointCoord - vec2(0.5);
    float dist = length(st);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, dist);
    gl_FragColor = vec4(vColor, alpha * 0.6);
  }
`;

function BackgroundStars() {
  const [positions, sizes, colors] = useMemo(() => {
    const layerCount = 3;
    const starsPerLayer = 2000;
    const totalStars = layerCount * starsPerLayer;
    const pos = new Float32Array(totalStars * 3);
    const size = new Float32Array(totalStars);
    const cols = new Float32Array(totalStars * 3);
    
    const colorChoices = [
      new THREE.Color('#ffffff'), 
      new THREE.Color('#93c5fd'), 
      new THREE.Color('#fbbf24'), 
      new THREE.Color('#8b5cf6')
    ];

    let idx = 0;
    for (let layer = 0; layer < layerCount; layer++) {
      const radius = 100 + layer * 100; // layers at distances 100, 200, 300
      for (let i = 0; i < starsPerLayer; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        const r = radius + (Math.random() - 0.5) * 50; 

        pos[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[idx * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[idx * 3 + 2] = r * Math.cos(phi);

        size[idx] = Math.random() * 2.0 + 0.5;

        const baseColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
        cols[idx * 3] = baseColor.r;
        cols[idx * 3 + 1] = baseColor.g;
        cols[idx * 3 + 2] = baseColor.b;

        idx++;
      }
    }
    return [pos, size, cols];
  }, []);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={sizes.length} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={bgStarVertexShader}
        fragmentShader={bgStarFragmentShader}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function GalaxyMap({ systems, onSelectSystem }: { systems: SystemData[], onSelectSystem: (system: SystemData) => void }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random stars for the background galaxy (Milky Way representation)
  const [starPositions, starColors] = useMemo(() => {
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    const colorChoices = [
      new THREE.Color('#38BDF8'), // Electric Blue
      new THREE.Color('#8B5CF6'), // Galactic Violet
      new THREE.Color('#FBBF24'), // Core Gold
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#93c5fd'), // Light Blue
    ];

    for (let i = 0; i < starCount; i++) {
      // Create a spiral galaxy shape roughly
      const radius = Math.random() * 50;
      const t = Math.random() * Math.PI * 2; // angle
      const armOffset = Math.random() * 2; // spiral arm thickness
      
      const theta = t + (radius * 0.1); // spiral effect
      
      const x = Math.cos(theta) * radius + (Math.random() - 0.5) * armOffset;
      const y = (Math.random() - 0.5) * (10 / (radius + 1)); // flatter at edges, thicker in middle
      const z = Math.sin(theta) * radius + (Math.random() - 0.5) * armOffset;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const baseColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      // core stars are more gold/white
      if (radius < 10) {
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.9;
          colors[i * 3 + 2] = 0.6;
      } else {
          colors[i * 3] = baseColor.r;
          colors[i * 3 + 1] = baseColor.g;
          colors[i * 3 + 2] = baseColor.b;
      }
    }
    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group>
      <BackgroundStars />
      <WarpParticles />
      {/* Background Nebula Layers for Parallax Depth */}
      <NebulaPlane position={[0, -10, 0]} size={200} colorSource="#38BDF8" colorTarget="#8B5CF6" speed={0.02} opacity={0.3} scaleParams={2.5} />
      <NebulaPlane position={[0, -25, 0]} size={280} colorSource="#8B5CF6" colorTarget="#FBBF24" speed={0.012} opacity={0.2} scaleParams={1.8} />
      <NebulaPlane position={[0, -40, 0]} size={360} colorSource="#0f172a" colorTarget="#38BDF8" speed={0.005} opacity={0.15} scaleParams={1.2} />

      {/* Background galaxy points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={starPositions.length / 3} array={starPositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={starColors.length / 3} array={starColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.15} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.8} />
      </points>

      {/* Interactive Systems */}
      {systems.map((sys) => (
        <group key={sys.id} position={sys.position} onClick={(e) => { e.stopPropagation(); onSelectSystem(sys); }}>
          <mesh>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshBasicMaterial color={sys.starColor} />
          </mesh>
          <pointLight color={sys.starColor} intensity={2} distance={10} />
          {/* Subtle glow / halo */}
          <mesh>
             <sphereGeometry args={[1.6, 16, 16]} />
             <meshBasicMaterial color={sys.starColor} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false}/>
          </mesh>
          <Text
            position={[0, -2, 0]}
            fontSize={1.2}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="#020308"
            renderOrder={2}
          >
            {sys.name}
          </Text>
        </group>
      ))}
    </group>
  );
}
