window.sampleStations = [{
  id: "1",
  name: "Kluane Lake Research Station",
  shortName: "KLRS",
  _links: {
    aina_info: {
      description: "AINA: KLRS",
      href: "http://arctic.ucalgary.ca/kluane-lake-research-station"
    },
    interact_info: {
      description: "INTER-ACT: KLRS",
      href: "http://www.eu-interact.org/field-sites/canada-9/kluane-lake/"
    }
  },
  geo: {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-138.4108, 61.0275, 793]
    },
    crs: {
      type: "link",
      properties: {
        href: "http://spatialreference.org/ref/epsg/4979/proj4/",
        type: "proj4"
      }
    },
    properties: {}
  }
}];