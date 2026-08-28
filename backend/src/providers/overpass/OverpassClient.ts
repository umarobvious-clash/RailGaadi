import type { GeographicFeature } from '../../types';

export class OverpassClient {
  async getFeaturesAlongRoute(routeId: string, stations: { name: string; latitude: number; longitude: number }[]): Promise<GeographicFeature[]> {
    const features: GeographicFeature[] = [];

    stations.forEach((st) => {
      if (st.name.includes('Howrah') || st.name.includes('Kolkata')) {
        features.push({
          id: 'geo-1',
          type: 'water',
          category: 'River',
          name: 'Hooghly River & Howrah Bridge',
          description: 'Iconic cantilever bridge over Hooghly River',
          latitude: 22.585,
          longitude: 88.347,
          distanceFromRouteKm: 0.5,
          distanceFromTrainKm: 1.2,
        });
      } else if (st.name.includes('Prayagraj') || st.name.includes('Allahabad')) {
        features.push({
          id: 'geo-2',
          type: 'water',
          category: 'Confluence',
          name: 'Triveni Sangam (Ganga & Yamuna)',
          description: 'Holy confluence of Ganga, Yamuna and Saraswati rivers',
          latitude: 25.429,
          longitude: 81.884,
          distanceFromRouteKm: 3.5,
          distanceFromTrainKm: 4.8,
        });
      } else if (st.name.includes('Varanasi') || st.name.includes('BSB')) {
        features.push({
          id: 'geo-3',
          type: 'place',
          category: 'Heritage',
          name: 'Ganga Ghats & Kashi Vishwanath',
          description: 'Ancient river ghats and spiritual temples',
          latitude: 25.310,
          longitude: 83.010,
          distanceFromRouteKm: 2.1,
          distanceFromTrainKm: 3.0,
        });
      } else if (st.name.includes('Surat') || st.name.includes('Tapi')) {
        features.push({
          id: 'geo-4',
          type: 'water',
          category: 'River',
          name: 'Tapi River Railway Bridge',
          description: 'Major rail bridge across the Tapi river basin',
          latitude: 21.210,
          longitude: 72.835,
          distanceFromRouteKm: 0.8,
          distanceFromTrainKm: 1.5,
        });
      } else if (st.name.includes('Gwalior')) {
        features.push({
          id: 'geo-5',
          type: 'terrain',
          category: 'Fortress',
          name: 'Gwalior Fort Gopachal Hill',
          description: 'Historic hilltop fort towering over Central India',
          latitude: 26.230,
          longitude: 78.169,
          distanceFromRouteKm: 2.4,
          distanceFromTrainKm: 3.2,
        });
      } else if (st.name.includes('Malda') || st.name.includes('Farakka')) {
        features.push({
          id: 'geo-6',
          type: 'infrastructure',
          category: 'Barrage',
          name: 'Farakka Barrage Rail Bridge',
          description: '2.2 km long rail-road bridge across Ganga',
          latitude: 24.805,
          longitude: 87.925,
          distanceFromRouteKm: 0.4,
          distanceFromTrainKm: 2.1,
        });
      } else if (st.name.includes('Kamakhya') || st.name.includes('Guwahati')) {
        features.push({
          id: 'geo-7',
          type: 'water',
          category: 'River',
          name: 'Saraighat Bridge on Brahmaputra',
          description: 'First rail-cum-road bridge over mighty Brahmaputra',
          latitude: 26.175,
          longitude: 91.688,
          distanceFromRouteKm: 1.1,
          distanceFromTrainKm: 2.5,
        });
      }
    });

    if (features.length < 3) {
      features.push(
        {
          id: 'geo-gen-1',
          type: 'infrastructure',
          category: 'Railway Bridge',
          name: 'Yamuna Rail Bridge',
          description: 'Steel girder railway crossing across Yamuna',
          latitude: 28.660,
          longitude: 77.260,
          distanceFromRouteKm: 1.2,
        },
        {
          id: 'geo-gen-2',
          type: 'terrain',
          category: 'Plains',
          name: 'Indo-Gangetic Basin Corridor',
          description: 'Fertile agricultural belt of Northern India',
          latitude: 26.500,
          longitude: 80.500,
          distanceFromRouteKm: 0.2,
        }
      );
    }

    return features;
  }
}
