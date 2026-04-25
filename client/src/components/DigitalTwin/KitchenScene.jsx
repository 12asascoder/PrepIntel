import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cylinder } from '@react-three/drei';

// Generic solid zone platform
function ZonePlatform({ position, size, color, label }) {
  return (
    <group position={position}>
      <mesh position={[0, size[1]/2, 0]} receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} transparent opacity={0.15} />
      </mesh>
      {/* Floor boundary */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0], size[2]]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
      </mesh>
      <Text position={[0, size[1] + 0.8, 0]} fontSize={0.4} color="white" anchorX="center" anchorY="middle" outlineWidth={0.05} outlineColor="#0f1a2e">
        {label}
      </Text>
    </group>
  );
}

// 3D Furniture components
function PrepCounter({ position }) {
  return (
    <group position={position}>
      {/* Counter Base */}
      <Box args={[3, 0.9, 1]} position={[0, 0.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#475569" />
      </Box>
      {/* Counter Top */}
      <Box args={[3.2, 0.1, 1.2]} position={[0, 0.95, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.1} />
      </Box>
    </group>
  );
}

function CookingStation({ position }) {
  return (
    <group position={position}>
      <Box args={[5, 0.9, 1.5]} position={[0, 0.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#334155" />
      </Box>
      <Box args={[5.2, 0.1, 1.6]} position={[0, 0.95, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </Box>
      {/* Hood */}
      <Box args={[5, 0.5, 1.5]} position={[0, 2.5, 0]} castShadow>
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
      </Box>
      {/* Burners */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <Cylinder key={i} args={[0.2, 0.2, 0.05, 16]} position={[x, 1.02, 0]} castShadow>
          <meshStandardMaterial color="#1e293b" />
        </Cylinder>
      ))}
    </group>
  );
}

function ServingLine({ position }) {
  return (
    <group position={position}>
      <Box args={[7, 0.9, 1]} position={[0, 0.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e2e8f0" />
      </Box>
      {/* Glass shield */}
      <Box args={[7, 0.6, 0.1]} position={[0, 1.2, 0.4]} transparent opacity={0.3}>
        <meshStandardMaterial color="#93c5fd" transmission={0.9} />
      </Box>
    </group>
  );
}

function DiningTable({ position }) {
  return (
    <group position={position}>
      {/* Table */}
      <Box args={[2, 0.05, 1]} position={[0, 0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#d97706" roughness={0.8} />
      </Box>
      <Cylinder args={[0.1, 0.1, 0.75, 8]} position={[0, 0.375, 0]} castShadow>
        <meshStandardMaterial color="#1e293b" />
      </Cylinder>
      {/* Chairs */}
      {[-0.5, 0.5].map((x, i) => (
        <group key={`chair1-${i}`} position={[x, 0, 0.8]}>
          <Box args={[0.4, 0.45, 0.4]} position={[0, 0.225, 0]} castShadow>
            <meshStandardMaterial color="#3b82f6" />
          </Box>
        </group>
      ))}
      {[-0.5, 0.5].map((x, i) => (
        <group key={`chair2-${i}`} position={[x, 0, -0.8]}>
          <Box args={[0.4, 0.45, 0.4]} position={[0, 0.225, 0]} castShadow>
            <meshStandardMaterial color="#3b82f6" />
          </Box>
        </group>
      ))}
    </group>
  );
}

function ColdStorage({ position }) {
  return (
    <group position={position}>
      <Box args={[1.5, 2.5, 2]} position={[0, 1.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.2} />
      </Box>
      {/* Handle */}
      <Box args={[0.05, 0.8, 0.1]} position={[0.75, 1.25, 0.8]} castShadow>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </Box>
    </group>
  );
}

function StatusNode({ position, status }) {
  const meshRef = useRef();
  const color = status === 'danger' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#10b981';
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * 3) * 0.2;
    meshRef.current.scale.setScalar(1 + Math.sin(t * 5) * 0.1);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} />
    </mesh>
  );
}

export default function KitchenScene({ zones = [], height = "h-[400px]" }) {
  // Layout representation
  const layout = {
    prep: { pos: [-4, 0, -3], size: [4, 1.5, 3] },
    cooking: { pos: [2, 0, -3], size: [6, 1.5, 3] },
    serving: { pos: [0, 0, 1], size: [8, 1.5, 2] },
    dining: { pos: [0, 0, 5], size: [12, 1.5, 4] },
    storage: { pos: [-7, 0, -3], size: [2, 3, 3] }
  };

  return (
    <div className={`w-full ${height} bg-gradient-to-b from-[#162344] to-[#0f1a2e] rounded-xl overflow-hidden relative shadow-inner`}>
      <Canvas camera={{ position: [0, 12, 14], fov: 45 }} shadows>
        <fog attach="fog" args={['#0f1a2e', 10, 30]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#93c5fd" />
        
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <gridHelper args={[30, 30, '#31446c', '#223357']} position={[0, 0, 0]} />

        {/* Solid Furniture Models */}
        <PrepCounter position={[-4, 0, -3]} />
        <CookingStation position={[2, 0, -3]} />
        <ServingLine position={[0, 0, 1]} />
        
        {/* Dining Tables Layout */}
        {[-3.5, 0, 3.5].map(x => (
          <group key={`row-${x}`}>
            <DiningTable position={[x, 0, 4]} />
            <DiningTable position={[x, 0, 6.5]} />
          </group>
        ))}
        
        <ColdStorage position={[-7, 0, -3]} />

        {/* Zones and Status Indicators */}
        {zones.map(z => {
          const l = layout[z.id];
          if (!l) return null;
          const statusMap = { critical: 'danger', warning: 'warning', optimal: 'success' };
          const mappedStatus = statusMap[z.status] || 'success';
          const nodeColor = mappedStatus === 'danger' ? '#ef4444' : mappedStatus === 'warning' ? '#f59e0b' : '#10b981';
          
          return (
            <group key={z.id}>
              <ZonePlatform position={l.pos} size={l.size} color={nodeColor} label={z.name} />
              <StatusNode position={[l.pos[0], l.size[1] + 1.5, l.pos[2]]} status={mappedStatus} />
            </group>
          );
        })}
        
        <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 2 - 0.1} minDistance={5} maxDistance={25} />
      </Canvas>
    </div>
  );
}
