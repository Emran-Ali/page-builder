<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {regions} from "public/regions";
import {nextTick, onUnmounted, ref, watch} from "vue";
import {usePageBuilderStore} from "@layers/page-builder/stores/pageBuilder";

const props = defineProps({
  initialArea: {
    type: String,
    default: "California",
  },
});

const selectedArea = ref(props.initialArea);

watch(
  () => props.initialArea,
  (newVal) => {
    selectedArea.value = newVal;
    if (newVal) {
      searchCity();
    }
  },
);

const {is} = useGlobalStore();
const config = useRuntimeConfig();
const store = usePageBuilderStore();
const isPreview = computed(() => store.isPreview);

const emit = defineEmits<{
  (e: "on-search", area: string, zipCodes: string[]): void;
}>();

const selectedZips = ref<string[]>([]);
const loading = ref(false);
const error = ref("");
const successMessage = ref("");
const loadingMessage = ref("");
const showMap = ref(false);
const mapContainer = ref<HTMLElement | null>(null);
const totalZipCount = ref(0);

let map: mapboxgl.Map | null = null;

onUnmounted(() => {
  cleanup();
});

function cleanup() {
  try {
    if (map) {
      map.remove();
      map = null;
    }
  } catch (err) {
    console.warn("Cleanup error:", err);
  }
}

async function searchCity() {
  if (!selectedArea.value.trim()) {
    error.value = "Please select both Area and Sub-region";
    return;
  }

  loading.value = true;
  error.value = "";
  successMessage.value = "";
  loadingMessage.value = "Searching for sub-region locations...";

  try {
    cleanup();

    selectedZips.value = [];
    showMap.value = false;

    emit("on-search", selectedArea.value, []);

    // Find the selected subRegion
    const area = regions.find((r) => r.value === selectedArea.value);
    // const selectedSubRegionData = area?.cities

    if (!area?.bbox) {
      throw new Error("No boundary data for selected area.");
    }

    const [minLon, minLat, maxLon, maxLat] = area.bbox;
    const avgLon = (minLon + maxLon) / 2;
    const avgLat = (minLat + maxLat) / 2;

    loadingMessage.value = "Initializing map...";
    showMap.value = true;
    await nextTick();
    await initializeMap(avgLat, avgLon);

    // if (!selectedSubRegionData) {
    //   throw new Error('Selected sub-region not found')
    // }

    // // Step 0: Parallelize geocoding for all cities to get bboxes and compute avg center
    // loadingMessage.value = 'Loading city boundaries...'
    // const geocodingPromises = selectedSubRegionData.map(async (city) => {
    //   try {
    //     const query = `${city}, ${selectedArea.value}, USA`
    //     const mapboxResponse = await fetchWithTimeout(
    //       `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${config.public.mapboxApiKey}`,
    //       10000
    //     )
    //     if (mapboxResponse.ok) {
    //       const mapboxData = await mapboxResponse.json()
    //       if (mapboxData.features && mapboxData.features.length > 0) {
    //         const feature = mapboxData.features[0]
    //         const bbox = feature.bbox
    //         // Validate bbox before returning
    //         if (
    //           bbox &&
    //           Array.isArray(bbox) &&
    //           bbox.length === 4 &&
    //           bbox.every((coord) => typeof coord === 'number')
    //         ) {
    //           return { city, bbox: bbox as [number, number, number, number] }
    //         }
    //       }
    //     }
    //     console.warn(
    //       `Geocoding failed for ${city}, skipping:`,
    //       mapboxResponse?.status
    //     )
    //     return null
    //   } catch (geocodeErr) {
    //     console.warn(`Geocoding failed for ${city}:`, geocodeErr)
    //     return null
    //   }
    // })

    // const geocodingResults = await Promise.all(geocodingPromises)
    // const validGeocodingResults = geocodingResults.filter(Boolean) as {
    //   city: string
    //   bbox: [number, number, number, number]
    // }[]
    // const bboxCount = validGeocodingResults.length

    // // Declare avgLat and avgLon outside the conditional blocks to fix scope issue
    // let avgLat: number
    // let avgLon: number

    // if (bboxCount === 0) {
    //   // Fallback to sub-region geocoding
    //   const fallbackQuery = ` ${selectedArea.value}, USA`
    //   const fallbackResponse = await fetchWithTimeout(
    //     `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fallbackQuery)}.json?access_token=${config.public.mapboxApiKey}&limit=1`,
    //     10000
    //   )
    //   avgLat = 0
    //   avgLon = 0
    //   if (fallbackResponse.ok) {
    //     const fallbackData = await fallbackResponse.json()
    //     if (fallbackData.features && fallbackData.features.length > 0) {
    //       ;[avgLon, avgLat] = fallbackData.features[0].center
    //     } else {
    //       throw new Error('No valid location found for this sub-region.')
    //     }
    //   } else {
    //     throw new Error('No valid location found for this sub-region.')
    //   }
    // } else {
    //   // Compute avg center from bboxes
    //   avgLat = 0
    //   avgLon = 0
    //   validGeocodingResults.forEach(({ bbox }) => {
    //     avgLat += (bbox[1] + bbox[3]) / 2
    //     avgLon += (bbox[0] + bbox[2]) / 2
    //   })
    //   avgLat /= bboxCount
    //   avgLon /= bboxCount
    // }

    // Define helper functions after map init (they rely on map)
    function ensureZipSourceAndLayers() {
      const sourceId = "zip-codes";
      if (!map) return;
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data: {type: "FeatureCollection", features: []},
        });
      }

      if (!map.getLayer("zip-fill")) {
        map.addLayer({
          id: "zip-fill",
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": [
              "case",
              ["in", ["get", "ZCTA5"], ["literal", selectedZips.value]],
              "#10B981",
              "#3B82F6",
            ],
            "fill-opacity": [
              "case",
              ["in", ["get", "ZCTA5"], ["literal", selectedZips.value]],
              0.4,
              0.2,
            ],
          },
        });
      }

      if (!map.getLayer("zip-border")) {
        map.addLayer({
          id: "zip-border",
          type: "line",
          source: sourceId,
          paint: {
            "line-color": [
              "case",
              ["in", ["get", "ZCTA5"], ["literal", selectedZips.value]],
              "#10B981",
              "#3B82F6",
            ],
            "line-width": 2,
          },
        });
      }

      if (!map.getLayer("zip-labels")) {
        map.addLayer({
          id: "zip-labels",
          type: "symbol",
          source: sourceId,
          layout: {
            "text-field": ["coalesce", ["get", "ZCTA5"], ["get", "GEOID"], ""],
            "text-anchor": "center",
            "text-size": 12,
            "text-allow-overlap": false,
            "text-ignore-placement": false,
          },
          paint: {
            "text-color": "#1F2937",
            "text-halo-color": "#ffffff",
            "text-halo-width": 2,
          },
        });
      }
    }

    const allZipGeoJSON: GeoJSON.Feature[] = [];
    const seenZips = new Set<string>();
    let incrementalBounds: mapboxgl.LngLatBounds | null = null;

    function addFeaturesIncrementally(features: GeoJSON.Feature[]) {
      let added = 0;
      for (const feature of features) {
        const props = feature.properties as Record<string, unknown> | undefined;
        const zipVal = props ? (props["ZCTA5"] ?? props["GEOID"]) : undefined;
        const zip = zipVal ? String(zipVal) : "";
        if (!zip) continue;
        if (seenZips.has(zip)) continue;
        seenZips.add(zip);
        allZipGeoJSON.push(feature);
        added++;

        // extend bounds
        try {
          if (!incrementalBounds) {
            incrementalBounds = new mapboxgl.LngLatBounds();
          }
          if (feature.geometry && "coordinates" in feature.geometry) {
            if (feature.geometry.type === "Polygon") {
              (feature.geometry as GeoJSON.Polygon).coordinates[0].forEach(
                (coord) => {
                  incrementalBounds!.extend(coord as [number, number]);
                },
              );
            } else if (feature.geometry.type === "MultiPolygon") {
              (feature.geometry as GeoJSON.MultiPolygon).coordinates.forEach(
                (polygon) => {
                  polygon[0].forEach((coord) => {
                    incrementalBounds!.extend(coord as [number, number]);
                  });
                },
              );
            }
          }
        } catch {
          // ignore
        }
      }

      totalZipCount.value = allZipGeoJSON.length;

      // update source data
      const source = map!.getSource("zip-codes") as
        | mapboxgl.GeoJSONSource
        | undefined;
      if (source) {
        try {
          source.setData({type: "FeatureCollection", features: allZipGeoJSON});
        } catch (e) {
          console.warn("Failed to set source data incrementally:", e);
        }
      }

      // update paint to reflect selectedZips
      if (map) {
        map.setPaintProperty("zip-fill", "fill-color", [
          "case",
          ["in", ["get", "ZCTA5"], ["literal", selectedZips.value]],
          "#10B981",
          "#3B82F6",
        ]);
        map.setPaintProperty("zip-fill", "fill-opacity", [
          "case",
          ["in", ["get", "ZCTA5"], ["literal", selectedZips.value]],
          0.4,
          0.2,
        ]);
        map.setPaintProperty("zip-border", "line-color", [
          "case",
          ["in", ["get", "ZCTA5"], ["literal", selectedZips.value]],
          "#10B981",
          "#3B82F6",
        ]);
      }
      try {
        if (incrementalBounds && allZipGeoJSON.length > 0) {
          map!.fitBounds(incrementalBounds, {padding: 20});
        }
      } catch {
        // ignore fit errors
      }

      return added;
    }

    ensureZipSourceAndLayers();

    // Attach click handlers once (after layers exist)
    map!.on("click", "zip-fill", (e) => {
      if (e.features && e.features[0]) {
        const zip =
          e.features[0].properties?.ZCTA5 || e.features[0].properties?.GEOID;
        if (zip) toggleZipSelection(zip.toString());
      }
    });
    map!.on(
      "mouseenter",
      "zip-fill",
      () => (map!.getCanvas().style.cursor = "pointer"),
    );
    map!.on(
      "mouseleave",
      "zip-fill",
      () => (map!.getCanvas().style.cursor = ""),
    );

    // Step 2: Parallelize Census ZIP queries, add incrementally on resolve
    loadingMessage.value = "Loading ZIP code boundaries...";
    const geometryJson = JSON.stringify({
      xmin: minLon,
      ymin: minLat,
      xmax: maxLon,
      ymax: maxLat,
      spatialReference: {wkid: 4326},
    });

    const zipResponse = await fetchWithTimeout(
      `${config.public.BACKEND_URL}offline/polygons?geometry=${encodeURIComponent(geometryJson)}`,
      60000,
    );

    if (!zipResponse.ok) {
      throw new Error(`Failed to fetch ZIP boundaries: ${zipResponse.status}`);
    }

    const zipGeojson = await zipResponse.json();
    addFeaturesIncrementally(zipGeojson?.features || []);

    if (allZipGeoJSON.length === 0) {
      throw new Error("No ZIP code boundaries found for this region.");
    }

    loadingMessage.value = "Displaying ZIP codes...";
    totalZipCount.value = allZipGeoJSON.length;
    successMessage.value = `Found ${allZipGeoJSON.length} unique ZIP code areas. Click to select.`;
    // let successfulCities = 0

    // const censusPromises = validGeocodingResults.map(async ({ city, bbox }) => {
    //   try {
    //     // Optional: Update loading message per city for UX, but since parallel, it might flicker—consider a global progress

    //     const geometryJson = JSON.stringify({
    //       xmin: bbox[0],
    //       ymin: bbox[1],
    //       xmax: bbox[2],
    //       ymax: bbox[3],
    //       spatialReference: { wkid: 4326 },
    //     })

    //     const backendUrl = `${config.public.BACKEND_URL}offline/polygons?geometry=${encodeURIComponent(geometryJson)}`
    //     const zipResponse = await fetchWithTimeout(backendUrl, 25000)

    //     if (!zipResponse.ok) {
    //       console.warn(
    //         `Backend ZIP query failed for ${city}:`,
    //         zipResponse.status
    //       )
    //       return { city, added: 0 }
    //     }

    //     const zipGeojson = await zipResponse.json()
    //     {
    //       ;('https://craft-music.dev/get-started?type=offline')
    //     }
    //     const added = addFeaturesIncrementally(zipGeojson?.features || [])
    //     if (added > 0) successfulCities++
    //     return { city, added }
    //   } catch (err) {
    //     console.warn(`Backend error for ${city}:`, err)
    //     return { city, added: 0 }
    //   }
    // })

    // // Wait for all Census promises to settle (parallel execution)
    // await Promise.allSettled(censusPromises)

    // if (allZipGeoJSON.length === 0) {
    //   throw new Error('No ZIP code boundaries found for this sub-region.')
    // }

    // loadingMessage.value = 'Displaying ZIP codes...'
    // totalZipCount.value = allZipGeoJSON.length
    // successMessage.value = `Found ${allZipGeoJSON.length} unique ZIP code areas across ${successfulCities} cities. Click to select.`
  } catch (err) {
    console.error("Search error:", err);
    showMap.value = false;
    error.value = err instanceof Error ? err.message : "Unexpected error";
  } finally {
    loading.value = false;
    loadingMessage.value = "";
  }
}

async function fetchWithTimeout(url: string, timeout: number = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "TeacherAvailabilityApp/1.0",
      },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function initializeMap(lat: number, lon: number) {
  await nextTick();

  if (!mapContainer.value) {
    throw new Error("Map container not found");
  }

  if (map) {
    map.remove();
    map = null;
  }

  mapboxgl.accessToken = config.public.mapboxApiKey;

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: "mapbox://styles/mapbox/streets-v12",
    center: [lon, lat],
    zoom: 10,
    minZoom: 6,
    maxZoom: 18,
  });

  map.addControl(new mapboxgl.NavigationControl());

  // Wait for the map style to load before adding sources/layers
  return new Promise<void>((resolve, reject) => {
    if (map!.isStyleLoaded()) {
      resolve();
      return;
    }

    map!.on("load", () => {
      resolve();
    });

    map!.on("error", (e) => {
      reject(e.error);
    });
  });
}

function toggleZipSelection(zipCode: string) {
  const idx = selectedZips.value.indexOf(zipCode);

  if (idx > -1) {
    selectedZips.value.splice(idx, 1);
  } else {
    selectedZips.value.push(zipCode);
  }

  if (map) {
    map.setPaintProperty("zip-fill", "fill-color", [
      "case",
      ["in", ["get", "ZCTA5"], ["literal", selectedZips.value]],
      "#10B981",
      "#3B82F6",
    ]);
    map.setPaintProperty("zip-fill", "fill-opacity", [
      "case",
      ["in", ["get", "ZCTA5"], ["literal", selectedZips.value]],
      0.4,
      0.2,
    ]);
    map.setPaintProperty("zip-border", "line-color", [
      "case",
      ["in", ["get", "ZCTA5"], ["literal", selectedZips.value]],
      "#10B981",
      "#3B82F6",
    ]);
  }
  console.log("Toggled ZIP:", zipCode, "Selected ZIPs:", selectedZips.value);
}

function removeZip(zipCode: string) {
  try {
    const index = selectedZips.value.indexOf(zipCode);
    if (index > -1) {
      selectedZips.value.splice(index, 1);

      if (map) {
        map.setPaintProperty("zip-fill", "fill-color", [
          "case",
          ["in", ["get", "ZCTA5"], ["literal", selectedZips.value]],
          "#10B981",
          "#3B82F6",
        ]);
        map.setPaintProperty("zip-fill", "fill-opacity", [
          "case",
          ["in", ["get", "ZCTA5"], ["literal", selectedZips.value]],
          0.4,
          0.2,
        ]);
        map.setPaintProperty("zip-border", "line-color", [
          "case",
          ["in", ["get", "ZCTA5"], ["literal", selectedZips.value]],
          "#10B981",
          "#3B82F6",
        ]);
      }
    }
  } catch (err) {
    console.error("Error removing ZIP:", err);
    error.value = "Error removing ZIP code";
  }
}

function clearSelection() {
  try {
    selectedZips.value = [];

    // Update map layers
    if (map) {
      map.setPaintProperty("zip-fill", "fill-color", "#3B82F6");
      map.setPaintProperty("zip-fill", "fill-opacity", 0.2);
      map.setPaintProperty("zip-border", "line-color", "#3B82F6");
    }

    successMessage.value = "All selections cleared";
  } catch (err) {
    console.error("Error clearing selection:", err);
    error.value = "Error clearing selections";
  }
}

async function searchTeacher() {
  if (selectedZips.value.length === 0) {
    error.value = "Please select at least one ZIP code";
    return;
  }

  emit("on-search", selectedArea.value, [...selectedZips.value]);
}

onMounted(() => {
  if (selectedArea.value) {
    searchCity();
  }
});
</script>

<template>
  <BaseContainer class="bg-white px-4 py-6 rounded-lg">
    <!-- Area and sub region -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label class="block mb-2 font-semibold">Area</label>
        <Select
          v-model="selectedArea"
          :options="regions"
          option-label="area"
          option-value="value"
          placeholder="Select an Area"
          class="w-full"
          size="small"
        />
      </div>

      <div class="flex items-end">
        <Button
          severity="primary"
          :disabled="loading || !selectedArea"
          size="small"
          @click="searchCity"
        >
          {{ loading ? "Loading..." : "Show in map" }}
        </Button>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="mb-4 bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="pi pi-times-circle" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
        <div class="ml-auto pl-3">
          <button
            class="inline-flex rounded-md text-red-400 hover:text-red-600"
            @click="error = ''"
          >
            <i class="pi pi-times text-small" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-4">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      />
      <span class="ml-2 text-gray-600">{{ loadingMessage }}</span>
    </div>

    <!-- Map Container -->
    <div class="mb-4">
      <div
        class="my-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex gap-4"
      >
        <div
          class="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm"
        >
          <BaseLucide name="Info" :size="20" class="text-blue-500" />
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-semibold mb-2">
            How to request in-person music lessons
          </h4>
          <ul class="text-sm text-gray-600 space-y-2 list-none p-0 m-0">
            <li class="flex items-start gap-2">
              <span class="text-blue-500 font-bold">•</span>
              <span>
                Select your <span class="font-semibold">Area</span> and click
                <span class="font-semibold">"Show in map"</span> to see
                available regions.
              </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 font-bold">•</span>
              <span>
                Click on <span class="font-semibold">ZIP code areas</span> on
                the map to select locations. Selected areas will turn green.
              </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 font-bold">•</span>
              <span>
                Once selected, click
                <span class="font-semibold">"Search Teacher"</span> to find
                instructors in your area.
              </span>
            </li>
          </ul>
          <div
            v-if="totalZipCount > 0"
            class="mt-3 inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-md border border-blue-100/50 text-[11px] font-medium text-blue-600"
          >
            <BaseLucide name="MapPin" :size="12" />
            Found {{ totalZipCount }} ZIP code areas across cities
          </div>
        </div>
      </div>
      <div
        v-if="showMap"
        ref="mapContainer"
        class="w-full h-[30rem] border rounded-lg"
      />
    </div>

    <!-- Selected ZIP Codes Display -->
    <div v-if="showMap && isPreview" class="mb-6">
      <h3 class="font-semibold mb-3">
        Selected ZIP Codes ({{ selectedZips.length }}/{{ totalZipCount }}):
      </h3>
      <div
        class="flex flex-wrap gap-2 max-h-32 min-h-10 overflow-y-auto p-3 bg-gray-50 rounded-lg"
        :class="{
          'justify-center': selectedZips.length === 0,
        }"
      >
        <span
          v-for="zip in selectedZips"
          :key="zip"
          class="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm flex items-center gap-1 cursor-pointer hover:bg-blue-200 transition-colors"
          title="Click to remove"
          @click="removeZip(zip)"
        >
          {{ zip }}
          <i class="pi pi-times text-xs ml-2" />
        </span>
        <div v-if="selectedZips.length === 0" class="text-gray-500 text-sm">
          No ZIP codes selected
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div v-if="showMap && isPreview" class="flex justify-end gap-4">
      <Button
        outlined
        :disabled="selectedZips.length === 0"
        size="small"
        @click="clearSelection"
      >
        Clear All
      </Button>

      <Button
        severity="primary"
        label="Search Teacher"
        :disabled="is('fetchOfflineLessons') || selectedZips.length === 0"
        :loading="is('fetchOfflineLessons')"
        size="small"
        @click="searchTeacher"
      />
    </div>
  </BaseContainer>
</template>

<style scoped>
:deep(.zip-label) {
  background: none !important;
  border: none !important;
}

/* Map container styling */
:deep(.leaflet-container) {
  font-family: inherit;
}

/* Popup styling */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}

/* Control styling */
:deep(.leaflet-control-zoom) {
  border-radius: 6px;
}

:deep(.leaflet-control-zoom a) {
  border-radius: 6px;
}
</style>
