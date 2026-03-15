import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function ProfileVisualizer({ profile, analyserDataRef, isPlaying }) {
  if (profile === "aggressive") {
    return <AggressiveBeatCrown analyserDataRef={analyserDataRef} isPlaying={isPlaying} />
  }

  if (profile === "soft") {
    return <SoftRibbon analyserDataRef={analyserDataRef} isPlaying={isPlaying} />
  }

  if (profile === "relax") {
    return <RelaxOrb analyserDataRef={analyserDataRef} isPlaying={isPlaying} />
  }

  return <EdmPulseRings analyserDataRef={analyserDataRef} isPlaying={isPlaying} />
}

function getBassEnergy(data) {
  if (!data) return 0

  return (
    ((data[1] || 0) * 0.2 +
      (data[2] || 0) * 0.24 +
      (data[3] || 0) * 0.22 +
      (data[4] || 0) * 0.18 +
      (data[5] || 0) * 0.16) /
    255
  )
}

function AggressiveBeatCrown({ analyserDataRef, isPlaying }) {
  const crownRef = useRef(null)
  const innerShellRef = useRef(null)
  const outerShellRef = useRef(null)
  const envelopeRef = useRef(0)
  const previousEnvelopeRef = useRef(0)
  const innerBasePositionsRef = useRef(null)
  const innerNormalsRef = useRef(null)
  const outerBasePositionsRef = useRef(null)
  const outerNormalsRef = useRef(null)
  const bars = useMemo(() => Array.from({ length: 72 }), [])

  useEffect(() => {
    const innerGeometry = innerShellRef.current?.geometry
    const outerGeometry = outerShellRef.current?.geometry

    if (innerGeometry) {
      innerBasePositionsRef.current = new Float32Array(innerGeometry.attributes.position.array)
      innerNormalsRef.current = new Float32Array(innerGeometry.attributes.normal.array)
    }

    if (outerGeometry) {
      outerBasePositionsRef.current = new Float32Array(outerGeometry.attributes.position.array)
      outerNormalsRef.current = new Float32Array(outerGeometry.attributes.normal.array)
    }
  }, [])

  useFrame(({ clock }) => {
    if (!crownRef.current || !innerShellRef.current || !outerShellRef.current) return

    const data = analyserDataRef.current
    const elapsed = clock.getElapsedTime()
    const innerGeometry = innerShellRef.current.geometry
    const outerGeometry = outerShellRef.current.geometry
    const innerPositions = innerGeometry.attributes.position.array
    const outerPositions = outerGeometry.attributes.position.array
    const innerBase = innerBasePositionsRef.current
    const innerNormals = innerNormalsRef.current
    const outerBase = outerBasePositionsRef.current
    const outerNormals = outerNormalsRef.current

    const bassEnergy = getBassEnergy(data)
    const attack = isPlaying ? 0.84 : 0.2
    const decay = isPlaying ? 0.28 : 0.12
    const currentEnvelope = envelopeRef.current

    envelopeRef.current =
      bassEnergy > currentEnvelope
        ? THREE.MathUtils.lerp(currentEnvelope, bassEnergy, attack)
        : THREE.MathUtils.lerp(currentEnvelope, bassEnergy, decay)

    const transient = Math.max(0, envelopeRef.current - previousEnvelopeRef.current)
    previousEnvelopeRef.current = envelopeRef.current

    const punch = envelopeRef.current + transient * 3.8

    if (innerBase && innerNormals) {
      for (let i = 0; i < innerPositions.length; i += 3) {
        const vertexIndex = i / 3
        const sample = data ? data[(vertexIndex % 18) + 1] / 255 : 0
        const phase = vertexIndex * 0.12
        const blast = Math.sin(elapsed * 9.6 + phase) * (sample * 0.36 + punch * 0.26)

        innerPositions[i] = innerBase[i] + innerNormals[i] * blast
        innerPositions[i + 1] = innerBase[i + 1] + innerNormals[i + 1] * blast
        innerPositions[i + 2] = innerBase[i + 2] + innerNormals[i + 2] * blast
      }

      innerGeometry.attributes.position.needsUpdate = true
    }

    if (outerBase && outerNormals) {
      for (let i = 0; i < outerPositions.length; i += 3) {
        const vertexIndex = i / 3
        const sample = data ? data[(vertexIndex % 24) + 1] / 255 : 0
        const phase = vertexIndex * 0.08
        const blast = Math.cos(elapsed * 7.1 + phase) * (sample * 0.24 + punch * 0.18)

        outerPositions[i] = outerBase[i] + outerNormals[i] * blast
        outerPositions[i + 1] = outerBase[i + 1] + outerNormals[i + 1] * blast
        outerPositions[i + 2] = outerBase[i + 2] + outerNormals[i + 2] * blast
      }

      outerGeometry.attributes.position.needsUpdate = true
    }

    innerShellRef.current.rotation.y = elapsed * 0.44
    innerShellRef.current.rotation.x = Math.sin(elapsed * 0.72) * 0.16
    outerShellRef.current.rotation.y = -elapsed * 0.25
    outerShellRef.current.rotation.z = elapsed * 0.19

    const innerScale = 1 + punch * 0.21
    const outerScale = 1 + punch * 0.14
    innerShellRef.current.scale.setScalar(THREE.MathUtils.lerp(innerShellRef.current.scale.x, innerScale, 0.24))
    outerShellRef.current.scale.setScalar(THREE.MathUtils.lerp(outerShellRef.current.scale.x, outerScale, 0.2))

    const shellHue = 0.56 + Math.min(0.16, punch * 0.2)
    innerShellRef.current.material.color.setHSL(shellHue, 0.95, 0.62)
    innerShellRef.current.material.opacity = THREE.MathUtils.lerp(
      innerShellRef.current.material.opacity,
      0.24 + punch * 0.28,
      0.22,
    )
    outerShellRef.current.material.color.setHSL(0.05 + Math.min(0.15, transient * 0.35), 0.96, 0.58)
    outerShellRef.current.material.opacity = THREE.MathUtils.lerp(
      outerShellRef.current.material.opacity,
      0.16 + punch * 0.2,
      0.2,
    )

    crownRef.current.rotation.y = elapsed * 0.18

    crownRef.current.children.forEach((mesh, index) => {
      const sample = data ? data[(index % 22) + 1] / 255 : 0
      const targetHeight = 0.45 + sample * 2.4 + punch * 1.15

      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, targetHeight, 0.42)
      mesh.position.y = mesh.scale.y * 0.48 - 0.2
      const barHue = 0.02 + Math.min(0.17, sample * 0.2 + transient * 0.25)
      mesh.material.color.setHSL(barHue, 0.98, 0.6)
      mesh.material.emissive.setHSL(0.62, 0.95, 0.36)
      mesh.material.emissiveIntensity = THREE.MathUtils.lerp(
        mesh.material.emissiveIntensity,
        0.45 + sample * 1.8 + punch * 0.9,
        0.35,
      )
    })
  })

  return (
    <group position={[0, 0.2, 0]}>
      <mesh ref={innerShellRef}>
        <icosahedronGeometry args={[1.45, 5]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.28} />
      </mesh>

      <mesh ref={outerShellRef}>
        <sphereGeometry args={[2.15, 42, 42]} />
        <meshBasicMaterial color="#f97316" wireframe transparent opacity={0.18} />
      </mesh>

      <group ref={crownRef}>
        {bars.map((_, index) => {
          const angle = (index / bars.length) * Math.PI * 2
          const radius = 3.2

          return (
            <mesh
              key={index}
              position={[Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius]}
              rotation={[0, -angle, 0]}
              castShadow
            >
              {/* <boxGeometry args={[0.11, 1, 0.34]} /> */}
              <meshStandardMaterial color="#f97316" emissive="#22d3ee" emissiveIntensity={0.52} roughness={0.22} metalness={0.18} />
            </mesh>
          )
        })}
      </group>
      
    </group>
  )
}

function SoftRibbon({ analyserDataRef, isPlaying }) {
  const knotRef = useRef(null)
  const haloRef = useRef(null)

  useFrame(({ clock }) => {
    if (!knotRef.current || !haloRef.current) return

    const data = analyserDataRef.current
    const elapsed = clock.getElapsedTime()
    const bassEnergy = getBassEnergy(data)

    const pulse = isPlaying ? 1 + bassEnergy * 0.08 : 1

    knotRef.current.rotation.x = Math.sin(elapsed * 0.18) * 0.2
    knotRef.current.rotation.y = elapsed * 0.16
    knotRef.current.scale.setScalar(THREE.MathUtils.lerp(knotRef.current.scale.x, pulse, 0.1))

    haloRef.current.rotation.z = -elapsed * 0.09
    haloRef.current.material.opacity = THREE.MathUtils.lerp(haloRef.current.material.opacity, 0.2 + bassEnergy * 0.12, 0.08)
  })

  return (
    <group position={[0, 0.15, 0]}>
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[1.35, 0.22, 160, 24, 2, 5]} />
        <meshStandardMaterial color="#a5f3fc" emissive="#155e75" emissiveIntensity={0.3} roughness={0.48} metalness={0.14} />
      </mesh>

      <mesh ref={haloRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.45, 2.62, 80]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function EdmPulseRings({ analyserDataRef, isPlaying }) {
  const waveLineRef = useRef(null)
  const glowLineRef = useRef(null)
  const pointCount = 160

  const { initialMainPositions, initialGlowPositions, xPositions } = useMemo(() => {
    const main = new Float32Array(pointCount * 3)
    const glow = new Float32Array(pointCount * 3)
    const x = new Float32Array(pointCount)
    const width = 12

    for (let index = 0; index < pointCount; index += 1) {
      const t = pointCount > 1 ? index / (pointCount - 1) : 0
      const xValue = (t - 0.5) * width
      const i3 = index * 3

      x[index] = xValue
      main[i3] = xValue
      main[i3 + 1] = 0
      main[i3 + 2] = 0

      glow[i3] = xValue
      glow[i3 + 1] = 0
      glow[i3 + 2] = -0.08
    }

    return {
      initialMainPositions: main,
      initialGlowPositions: glow,
      xPositions: x,
    }
  }, [])

  useFrame(({ clock }) => {
    if (!waveLineRef.current || !glowLineRef.current) return

    const data = analyserDataRef.current
    const elapsed = clock.getElapsedTime()
    const bassEnergy = getBassEnergy(data)
    const wavePositions = waveLineRef.current.geometry.attributes.position.array
    const glowPositions = glowLineRef.current.geometry.attributes.position.array

    for (let index = 0; index < pointCount; index += 1) {
      const i3 = index * 3
      const sampleIndex = data ? Math.min(data.length - 1, Math.floor((index / (pointCount - 1)) * 50)) : 0
      const sample = data ? data[sampleIndex] / 255 : 0
      const ripple = Math.sin(elapsed * 4.6 + index * 0.22) * 0.05
      const waveStrength = isPlaying ? sample * 1.35 + bassEnergy * 0.8 : sample * 0.22
      const y = ripple + waveStrength * 0.85

      wavePositions[i3] = xPositions[index]
      wavePositions[i3 + 1] = y
      wavePositions[i3 + 2] = Math.sin(elapsed * 0.5 + index * 0.08) * 0.06

      glowPositions[i3] = xPositions[index]
      glowPositions[i3 + 1] = y * 1.2
      glowPositions[i3 + 2] = -0.1
    }

    waveLineRef.current.geometry.attributes.position.needsUpdate = true
    glowLineRef.current.geometry.attributes.position.needsUpdate = true

    const hue = 0.54 + Math.min(0.12, bassEnergy * 0.16)
    waveLineRef.current.material.color.setHSL(hue, 0.95, 0.62)
    glowLineRef.current.material.color.setHSL(0.06 + Math.min(0.1, bassEnergy * 0.14), 0.95, 0.58)
    waveLineRef.current.material.opacity = THREE.MathUtils.lerp(
      waveLineRef.current.material.opacity,
      0.8 + bassEnergy * 0.18,
      0.16,
    )
    glowLineRef.current.material.opacity = THREE.MathUtils.lerp(
      glowLineRef.current.material.opacity,
      0.34 + bassEnergy * 0.22,
      0.14,
    )
  })

  return (
    <group position={[0, 0.2, 0]}>
      <line ref={waveLineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={initialMainPositions}
            count={pointCount}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.86} />
      </line>

      <line ref={glowLineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={initialGlowPositions}
            count={pointCount}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#f97316" transparent opacity={0.38} />
      </line>

      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([-6, 0, -0.12, 6, 0, -0.12])}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#0e7490" transparent opacity={0.25} />
      </line>
    </group>
  )
}

function RelaxOrb({ analyserDataRef, isPlaying }) {
  const orbRef = useRef(null)
  const shellRef = useRef(null)
  const shellBasePositionsRef = useRef(null)
  const shellNormalsRef = useRef(null)

  useEffect(() => {
    const geometry = shellRef.current?.geometry
    if (!geometry) return

    shellBasePositionsRef.current = new Float32Array(geometry.attributes.position.array)
    shellNormalsRef.current = new Float32Array(geometry.attributes.normal.array)
  }, [])

  useFrame(({ clock }) => {
    if (!orbRef.current || !shellRef.current) return

    const data = analyserDataRef.current
    const elapsed = clock.getElapsedTime()
    const geometry = shellRef.current.geometry
    const positions = geometry.attributes.position.array
    const basePositions = shellBasePositionsRef.current
    const normals = shellNormalsRef.current
    const bassEnergy = getBassEnergy(data)
    const midEnergy = data ? ((data[10] || 0) * 0.5 + (data[11] || 0) * 0.5) / 255 : 0

    const pulse = isPlaying ? 1 + bassEnergy * 0.05 : 1

    orbRef.current.rotation.y = elapsed * 0.08
    orbRef.current.rotation.x = Math.sin(elapsed * 0.11) * 0.16
    orbRef.current.scale.setScalar(THREE.MathUtils.lerp(orbRef.current.scale.x, pulse, 0.06))

    shellRef.current.rotation.z = elapsed * 0.04
    shellRef.current.scale.setScalar(
      THREE.MathUtils.lerp(shellRef.current.scale.x, 1 + bassEnergy * 0.03, 0.06),
    )
    shellRef.current.material.opacity = THREE.MathUtils.lerp(
      shellRef.current.material.opacity,
      0.12 + bassEnergy * 0.07,
      0.08,
    )

    if (basePositions && normals) {
      for (let i = 0; i < positions.length; i += 3) {
        const vertexIndex = i / 3
        const sample = data ? data[(vertexIndex * 3) % data.length] / 255 : 0
        const phase = vertexIndex * 0.08
        const ripple = Math.sin(elapsed * 2.8 + phase) * (sample * 0.14 + bassEnergy * 0.11)
        const breath = Math.cos(elapsed * 1.6 + phase * 0.7) * (midEnergy * 0.06)
        const spread = ripple + breath

        positions[i] = basePositions[i] + normals[i] * spread
        positions[i + 1] = basePositions[i + 1] + normals[i + 1] * spread
        positions[i + 2] = basePositions[i + 2] + normals[i + 2] * spread
      }

      geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group position={[0, 0.1, 0]}>
      <mesh ref={orbRef}>
        <icosahedronGeometry args={[1.6, 4]} />
        <meshStandardMaterial color="#67e8f9" emissive="#155e75" emissiveIntensity={0.22} roughness={0.62} metalness={0.06} flatShading />
      </mesh>

      <mesh ref={shellRef}>
        <sphereGeometry args={[2.25, 48, 48]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  )
}
