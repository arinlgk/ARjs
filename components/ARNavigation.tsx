'use client'

import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import * as turf from '@turf/turf'

const waypoints = [
  { id: 1, name: 'UMPSA Main Entrance', lat: 3.5424105381833333, lon: 103.42519353920233, color: 'red' },
  { id: 2, name: 'Faculty of Computing', lat: 3.5470578908910624, lon: 103.42766713303656, color: 'green' },
  { id: 3, name: 'Ditec UMPSA', lat: 3.5444022329295355, lon: 103.43162607338732, color: 'blue' },
  { id: 4, name: 'FTKEE Cafe', lat: 3.5395406456778633, lon: 103.4310681740305, color: 'yellow' },
  { id: 5, name: 'PAP', lat: 3.539176561005007, lon: 103.42781733683893, color: 'orange' },
  { id: 6, name: 'Dewan Serbaguna', lat: 3.541152253948052, lon: 103.42994164632783, color: 'purple' },
  { id: 7, name: 'He & She', lat: 3.5389632623719502, lon: 103.42746000826024, color: 'pink' },
  { id: 8, name: 'KK5 Basketball Court', lat: 3.5382039072479077, lon: 103.42795100526111, color: 'cyan' },
  { id: 9, name: 'Library', lat: 3.5427684944699585, lon: 103.43133217957656, color: 'brown' },
  { id: 10, name: 'University Health Centre', lat: 3.5487033301435926, lon: 103.43386164772174, color: 'gray' },
]

const campusWalkways = [
  [[103.42519, 3.5424], [103.42766, 3.5470]],
  [[103.42766, 3.5470], [103.43162, 3.5444]],
  [[103.43162, 3.5444], [103.43106, 3.5395]],
  [[103.43106, 3.5395], [103.42781, 3.5391]],
  [[103.42781, 3.5391], [103.42994, 3.5411]],
  [[103.42994, 3.5411], [103.42746, 3.5389]],
  [[103.42746, 3.5389], [103.42795, 3.5382]],
  [[103.42795, 3.5382], [103.43133, 3.5427]],
  [[103.43133, 3.5427], [103.43386, 3.5487]],
]

const ARNavigation: React.FC = () => {
  const [selectedDestination, setSelectedDestination] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [navigationInstructions, setNavigationInstructions] = useState<string>('')
  const [navigationPath, setNavigationPath] = useState<[number, number][]>([])
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  useEffect(() => {
    const setupAR = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          const orientationPermission = await DeviceOrientationEvent.requestPermission()
          if (orientationPermission !== 'granted') {
            throw new Error('Device orientation permission not granted')
          }
        }

        if ('geolocation' in navigator) {
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              })
              setIsLoading(false)
            },
            (error) => {
              console.error('Geolocation error:', error)
              setError(`Unable to get your location: ${error.message}. Please enable GPS and try again.`)
              setIsLoading(false)
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          )

          // Cleanup function to stop watching for location updates
          return () => navigator.geolocation.clearWatch(watchId)
        } else {
          throw new Error('Geolocation is not supported by this browser')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setIsLoading(false)
      }
    }

    setupAR()
  }, [])

  useEffect(() => {
    if (selectedDestination !== null && userLocation) {
      const destination = waypoints.find(wp => wp.id === selectedDestination)
      if (destination) {
        const path = findPath(userLocation, destination)
        setNavigationPath(path)
        updateNavigationInstructions(path)
      }
    }
  }, [selectedDestination, userLocation])

  const findPath = (start: { lat: number; lon: number }, end: { lat: number; lon: number }) => {
    const graph = turf.featureCollection(campusWalkways.map(path => turf.lineString(path)))
    const options = { obstacles: graph }
    const route = turf.shortestPath(turf.point([start.lon, start.lat]), turf.point([end.lon, end.lat]), options)
    return route.geometry.coordinates as [number, number][]
  }

  const updateNavigationInstructions = (path: [number, number][]) => {
    if (path.length < 2) return

    const start = turf.point(path[0])
    const end = turf.point(path[path.length - 1])
    const distance = turf.distance(start, end, { units: 'meters' })
    const bearing = turf.bearing(start, end)
    const direction = getCardinalDirection(bearing)

    setNavigationInstructions(`Head ${direction} for ${distance.toFixed(0)} meters`)
  }

  const getCardinalDirection = (bearing: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    return directions[Math.round(((bearing + 360) % 360) / 45) % 8]
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading AR Navigation...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-4">{error}</p>
        <p>Please ensure you've granted all necessary permissions and try refreshing the page.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <a-scene
        embedded
        arjs='sourceType: webcam; debugUIEnabled: false; sourceWidth: 1280; sourceHeight: 960; displayWidth: 1280; displayHeight: 960;'
        vr-mode-ui="enabled: false"
        ref={(el) => {
          if (el) {
            sceneRef.current = el.object3D
            cameraRef.current = el.camera
          }
        }}
      >
        <a-camera gps-camera rotation-reader></a-camera>
        
        {waypoints.map((waypoint) => (
          <a-entity
            key={waypoint.id}
            gps-entity-place={`latitude: ${waypoint.lat}; longitude: ${waypoint.lon};`}
            geometry="primitive: box; height: 2; width: 2; depth: 2"
            material={`color: ${selectedDestination === waypoint.id ? 'red' : waypoint.color}`}
            scale="20 20 20"
            look-at="[gps-camera]"
          >
            <a-text
              value={waypoint.name}
              look-at="[gps-camera]"
              scale="1 1 1"
              align="center"
              anchor="center"
              position="0 3 0"
            ></a-text>
          </a-entity>
        ))}

        {navigationPath.map((point, index) => (
          <a-entity
            key={index}
            gps-entity-place={`latitude: ${point[1]}; longitude: ${point[0]};`}
            geometry="primitive: sphere; radius: 0.5"
            material="color: yellow; opacity: 0.7"
            scale="5 5 5"
          ></a-entity>
        ))}
      </a-scene>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 p-4 rounded-lg">
        <select
          onChange={(e) => setSelectedDestination(Number(e.target.value))}
          className="w-full p-2 rounded-md text-base"
        >
          <option value="">Select Destination</option>
          {waypoints.map((waypoint) => (
            <option key={waypoint.id} value={waypoint.id}>
              {waypoint.name}
            </option>
          ))}
        </select>
      </div>

      {navigationInstructions && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 p-4 rounded-lg text-white max-w-xs">
          <h3 className="font-bold mb-2">Navigation Instructions:</h3>
          <p>{navigationInstructions}</p>
        </div>
      )}
    </div>
  )
}

export default ARNavigation

