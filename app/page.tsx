'use client'

import { useState, useEffect } from 'react'
import { Entity, Scene } from 'aframe-react'

export default function WebARNavigation() {
  const [isNavigating, setIsNavigating] = useState(false)
  const [destination, setDestination] = useState('')
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const locations = {
    library: [40.7128, -74.0060],
    studentCenter: [40.7130, -74.0062],
    scienceLab: [40.7132, -74.0064],
    sportsComplex: [40.7134, -74.0066]
  }

  useEffect(() => {
    let watchId: number | null = null;

    const successCallback = (position: GeolocationPosition) => {
      setUserPosition([position.coords.latitude, position.coords.longitude])
      setError(null)
    }

    const errorCallback = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error)
      let errorMessage = 'An unknown error occurred while trying to get your location.'
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location permission denied. Please enable location services and refresh the page."
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable. Please check your device's GPS settings."
          break
        case error.TIMEOUT:
          errorMessage = "The request to get your location timed out. Please try again."
          break
      }
      setError(errorMessage)
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    }

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, options)
    } else {
      setError('Geolocation is not supported by your browser')
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])

  const startNavigation = () => {
    if (destination && userPosition) {
      setIsNavigating(true)
    } else if (!destination) {
      setError('Please select a destination.')
    } else if (!userPosition) {
      setError('Unable to get your current location. Please ensure location services are enabled.')
    }
  }

  const resetNavigation = () => {
    setIsNavigating(false)
    setDestination('')
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!isNavigating ? (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center text-white z-50">
          <h1 className="text-3xl font-bold mb-6">University Campus Navigation</h1>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mb-4 p-2 text-black w-64 rounded"
          >
            <option value="">Select Destination</option>
            <option value="library">Library</option>
            <option value="studentCenter">Student Center</option>
            <option value="scienceLab">Science Lab</option>
            <option value="sportsComplex">Sports Complex</option>
          </select>
          <button
            onClick={startNavigation}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Start Navigation
          </button>
          {error && (
            <div className="mt-4 p-3 bg-red-500 text-white rounded max-w-md text-center">
              {error}
            </div>
          )}
        </div>
      ) : (
        <>
          <Scene
            vr-mode-ui="enabled: false"
            arjs="sourceType: webcam; debugUIEnabled: false;"
            renderer="antialias: true; alpha: true"
          >
            <Entity primitive="a-camera" look-controls-enabled={false} arjs-look-controls="smoothingFactor: 0.1" gps-camera rotation-reader />
            
            {userPosition && locations[destination as keyof typeof locations] && (
              <Entity
                primitive="a-box"
                color="red"
                scale={{ x: 20, y: 20, z: 20 }}
                gps-entity-place={`latitude: ${locations[destination as keyof typeof locations][0]}; longitude: ${locations[destination as keyof typeof locations][1]}`}
                look-at="[gps-camera]"
              />
            )}
          </Scene>
          <div className="fixed bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded">
            Follow the red box to reach your destination.
          </div>
          <button
            onClick={resetNavigation}
            className="fixed top-4 right-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Reset Navigation
          </button>
        </>
      )}
    </div>
  )
}

