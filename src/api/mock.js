const delay = () => new Promise((r) => setTimeout(r, 350))

// ── Soil ────────────────────────────────────────────────────────────────────

const soilByLatitude = (lat) => {
  if (Math.abs(lat) < 23.5) return { ipccSoilClass: 'Tropical Moist', wrbSoilClass: 'Ferralsols' }
  if (Math.abs(lat) < 45) return { ipccSoilClass: 'High Activity Clay', wrbSoilClass: 'Cambisols' }
  if (Math.abs(lat) < 60) return { ipccSoilClass: 'High Activity Clay', wrbSoilClass: 'Luvisols' }
  return { ipccSoilClass: 'Organic', wrbSoilClass: 'Histosols' }
}

// ── Farms ────────────────────────────────────────────────────────────────────

const FARMS = [
  {
    id: 'f1a2b3c4-0001-0000-0000-000000000001',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-03-15T11:20:00Z',
    name: 'Green Acres Farm',
    farmIdentifier: 'GA-001',
    country: 'United Kingdom of Great Britain and Northern Ireland',
    latitude: 51.28,
    longitude: 0.52,
    climate: 'Cool Temperate Moist',
    annualAverageTemperature: { value: 10, unit: '°C' },
    owner: 'farmer@greenacres.co.uk',
  },
  {
    id: 'f1a2b3c4-0002-0000-0000-000000000002',
    createdAt: '2024-02-05T08:30:00Z',
    updatedAt: '2024-04-01T14:00:00Z',
    name: 'Schiphol Polder Farm',
    farmIdentifier: 'NL-SPF-22',
    country: 'Netherlands (Kingdom of the)',
    latitude: 52.31,
    longitude: 4.76,
    climate: 'Cool Temperate Moist',
    annualAverageTemperature: { value: 9.5, unit: '°C' },
    owner: 'boer@polderfarm.nl',
  },
  {
    id: 'f1a2b3c4-0003-0000-0000-000000000003',
    createdAt: '2024-03-18T10:00:00Z',
    updatedAt: '2024-05-22T16:45:00Z',
    name: 'Prairie Fields Co.',
    farmIdentifier: 'US-IA-PFC',
    country: 'United States of America',
    latitude: 42.0,
    longitude: -93.5,
    climate: 'Cool Temperate Dry',
    annualAverageTemperature: { value: 8.2, unit: '°C' },
    owner: 'info@prairiefields.com',
  },
  {
    id: 'f1a2b3c4-0004-0000-0000-000000000004',
    createdAt: '2024-04-02T07:15:00Z',
    updatedAt: '2024-06-10T09:00:00Z',
    name: 'Fazenda Cerrado',
    farmIdentifier: 'BR-GO-FC01',
    country: 'Brazil',
    latitude: -15.8,
    longitude: -49.2,
    climate: 'Tropical Dry',
    annualAverageTemperature: { value: 22.5, unit: '°C' },
    owner: 'gestao@fazendacerrado.com.br',
  },
]

// ── Assessment list ───────────────────────────────────────────────────────────

const ASSESSMENTS = [
  {
    id: 'a0000001-0000-0000-0000-000000000001',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-05-14T15:30:00Z',
    name: 'Winter Barley 2024',
    farmId: FARMS[0].id,
    farm: FARMS[0],
    purposes: ['Corporate reporting'],
    createdBy: 'farmer@greenacres.co.uk',
    status: 'Submitted',
    pathway: 'Annuals v3',
    oldRunsSummary: [],
    aggregationGroups: [],
    downstreamAssessments: [],
  },
  {
    id: 'a0000002-0000-0000-0000-000000000002',
    createdAt: '2024-04-10T09:00:00Z',
    updatedAt: '2024-06-01T11:00:00Z',
    name: 'Apple Orchard — Year 5',
    farmId: FARMS[1].id,
    farm: FARMS[1],
    purposes: ['Research'],
    createdBy: 'boer@polderfarm.nl',
    status: 'In progress',
    pathway: 'Perennials v3',
    oldRunsSummary: [],
    aggregationGroups: [],
    downstreamAssessments: [],
  },
  {
    id: 'a0000003-0000-0000-0000-000000000003',
    createdAt: '2024-02-20T08:00:00Z',
    updatedAt: '2024-04-18T13:20:00Z',
    name: 'Irrigated Rice Block A',
    farmId: FARMS[3].id,
    farm: FARMS[3],
    purposes: ['Scenarios - actual data'],
    createdBy: 'gestao@fazendacerrado.com.br',
    status: 'Submitted',
    pathway: 'Paddy Rice v3',
    oldRunsSummary: [],
    aggregationGroups: [],
    downstreamAssessments: [],
  },
  {
    id: 'a0000004-0000-0000-0000-000000000004',
    createdAt: '2024-05-05T11:00:00Z',
    updatedAt: '2024-05-05T11:00:00Z',
    name: 'Spring Wheat Trial',
    farmId: FARMS[2].id,
    farm: FARMS[2],
    purposes: ['Testing'],
    createdBy: 'info@prairiefields.com',
    status: 'Not started',
    pathway: 'Annuals v3',
    oldRunsSummary: [],
    aggregationGroups: [],
    downstreamAssessments: [],
  },
  {
    id: 'a0000005-0000-0000-0000-000000000005',
    createdAt: '2024-03-25T14:00:00Z',
    updatedAt: '2024-06-12T10:00:00Z',
    name: 'Dairy Herd — Q1 2024',
    farmId: FARMS[0].id,
    farm: FARMS[0],
    purposes: ['Corporate reporting'],
    createdBy: 'farmer@greenacres.co.uk',
    status: 'Submitted',
    pathway: 'Dairy v3',
    oldRunsSummary: [],
    aggregationGroups: [],
    downstreamAssessments: [],
  },
]

// ── Assessment detail (full run with FLAG results) ────────────────────────────

const FLAG_RESULTS = [
  {
    flagCategory: 'Non-land emissions*, items incoming to farm for on-farm use',
    CO2: 18240.5,
    CH4: 312.8,
    N2O: 4820.3,
    CO2eqUnspecified: 0,
    CO2eq: 148760.4,
  },
  {
    flagCategory: 'Non-land emissions, within farm operations',
    CO2: 6130.2,
    CH4: 88.4,
    N2O: 9641.7,
    CO2eqUnspecified: 0,
    CO2eq: 292430.1,
  },
  {
    flagCategory: 'Non-land emissions, items dispatched from farm',
    CO2: 920.1,
    CH4: 14.2,
    N2O: 180.5,
    CO2eqUnspecified: 0,
    CO2eq: 5490.8,
  },
  {
    flagCategory: 'Non-land, unspecified relation to farm boundary',
    CO2: 430.0,
    CH4: 0,
    N2O: 0,
    CO2eqUnspecified: 0,
    CO2eq: 430.0,
  },
  {
    flagCategory: 'Land management, non-CO2 and non-biogenic CO2 emissions',
    CO2: 0,
    CH4: 0,
    N2O: 2105.6,
    CO2eqUnspecified: 0,
    CO2eq: 63898.2,
  },
  {
    flagCategory: 'Land management, net biogenic CO2 emissions',
    CO2: 1240.0,
    CH4: 0,
    N2O: 0,
    CO2eqUnspecified: 0,
    CO2eq: 1240.0,
  },
  {
    flagCategory: 'Land management, net biogenic CO2 removals',
    CO2: -2770643.52,
    CH4: 0,
    N2O: 0,
    CO2eqUnspecified: 0,
    CO2eq: -2770643.52,
  },
  {
    flagCategory: 'Soil Carbon Tier 1 model emissions*',
    CO2: 3820.4,
    CH4: 0,
    N2O: 0,
    CO2eqUnspecified: 0,
    CO2eq: 3820.4,
  },
]

const ASSESSMENT_DETAILS = {
  'a0000001-0000-0000-0000-000000000001': {
    ...ASSESSMENTS[0],
    submittedRun: {
      id: 'run-0001-0000-0000-0000-000000000001',
      createdAt: '2024-05-14T15:30:00Z',
      updatedAt: '2024-05-14T15:30:00Z',
      isDraft: false,
      pathway: 'Annuals v3',
      dataQuality: 'Mix of actual and estimated data',
      notes: 'Assessed using actual yield and fertiliser records for 2024.',
      upstreamAssessments: [],
      inputData: {
        cropDetails: {
          cropType: 'Barley',
          area: { value: 48, unit: 'hectares' },
          farmGate: { value: 192, unit: 'tonnes' },
          soilType: 'Medium',
          cropYield: { value: 192, unit: 'tonnes' },
          assessmentYear: 2024,
        },
        fertiliser: {
          fertilisers: [
            {
              type: 'Ammonium nitrate',
              amount: { value: 5280, unit: 'kg' },
              nitrogenPercentage: 34.5,
            },
          ],
        },
        residue: {
          aboveGroundResidue: 'left_on_field',
          residueManagementPractice: 'left_on_field',
        },
      },
      resultSummary: {
        assessmentYear: {
          CO2eq: {
            emissions: 516249.9,
            removals: -2770643.52,
            balance: -2254393.62,
          },
        },
      },
      resultAggregations: {
        assessmentYearGhgsByFlagCategory: { data: FLAG_RESULTS },
      },
      inputDataValidationReport: {
        userInput: {},
        modelInput: {
          fertiliser: [{ level: 'warning', message: 'Your Nitrogen Use Efficiency (NUE) is below 30%, suggesting possible issues with your yield or fertiliser data. This indicates excess nitrogen. NUE is the percentage of nitrogen removed in the harvest compared to nitrogen applied.' }],
        },
      },
    },
  },
  'a0000003-0000-0000-0000-000000000003': {
    ...ASSESSMENTS[2],
    submittedRun: {
      id: 'run-0003-0000-0000-0000-000000000003',
      createdAt: '2024-04-18T13:20:00Z',
      updatedAt: '2024-04-18T13:20:00Z',
      isDraft: false,
      pathway: 'Paddy Rice v3',
      dataQuality: 'All actual data',
      notes: '',
      upstreamAssessments: [],
      inputData: {
        cropDetails: {
          cropType: 'Rice',
          area: { value: 120, unit: 'hectares' },
          farmGate: { value: 480, unit: 'tonnes' },
          soilType: 'Fine',
          cropYield: { value: 480, unit: 'tonnes' },
          assessmentYear: 2024,
        },
        fertiliser: {
          fertilisers: [
            { type: 'Urea', amount: { value: 18000, unit: 'kg' }, nitrogenPercentage: 46 },
          ],
        },
      },
      resultSummary: {
        assessmentYear: {
          CO2eq: {
            emissions: 1243800.0,
            removals: -420000.0,
            balance: 823800.0,
          },
        },
      },
      resultAggregations: {
        assessmentYearGhgsByFlagCategory: {
          data: FLAG_RESULTS.map((r) => ({ ...r, N2O: r.N2O * 1.8, CO2eq: r.CO2eq * 1.6 })),
        },
      },
      inputDataValidationReport: { userInput: {}, modelInput: {} },
    },
  },
  'a0000005-0000-0000-0000-000000000005': {
    ...ASSESSMENTS[4],
    submittedRun: {
      id: 'run-0005-0000-0000-0000-000000000005',
      createdAt: '2024-06-12T10:00:00Z',
      updatedAt: '2024-06-12T10:00:00Z',
      isDraft: false,
      pathway: 'Dairy v3',
      dataQuality: 'All actual data',
      notes: 'Q1 herd assessment, 180 milking cows.',
      upstreamAssessments: [],
      inputData: {
        herdDetails: { numberOfAnimals: 180, milkYield: { value: 9200, unit: 'kg/cow/year' } },
        feedManagement: { dietType: 'Mixed grazing and TMR' },
      },
      resultSummary: {
        assessmentYear: {
          CO2eq: { emissions: 2104500.0, removals: -180000.0, balance: 1924500.0 },
        },
      },
      resultAggregations: {
        assessmentYearGhgsByFlagCategory: {
          data: FLAG_RESULTS.map((r) => ({ ...r, CH4: r.CH4 * 4.2, CO2eq: r.CO2eq * 2.1 })),
        },
      },
      inputDataValidationReport: { userInput: {}, modelInput: {} },
    },
  },
}

// ── Router ────────────────────────────────────────────────────────────────────

export const mockRequest = async (method, path, body) => {
  await delay()

  if (method === 'POST' && path === '/soil-characteristic') {
    return soilByLatitude(body?.latitude ?? 0)
  }

  if (method === 'GET' && path === '/farms') return FARMS

  if (method === 'GET' && path.startsWith('/farms/')) {
    const id = path.split('/')[2]
    return FARMS.find((f) => f.id === id) ?? null
  }

  if (method === 'POST' && path === '/farms') {
    const farm = {
      ...body,
      id: `mock-farm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: 'mock@user.com',
    }
    FARMS.push(farm)
    return farm
  }

  if (method === 'GET' && (path.startsWith('/assessments/') || path.startsWith('/assessment/'))) {
    const id = path.split('/')[2]
    return (
      ASSESSMENT_DETAILS[id] ?? ASSESSMENTS.find((a) => a.id === id) ?? null
    )
  }

  if (method === 'GET' && path.startsWith('/assessments')) {
    const params = new URLSearchParams(path.split('?')[1] ?? '')
    const pathway = params.get('pathway')
    const farmId  = params.get('farmId')
    let result = ASSESSMENTS
    if (pathway) result = result.filter((a) => a.pathway === pathway)
    if (farmId)  result = result.filter((a) => a.farmId === farmId)
    return result
  }

  throw new Error(`No mock handler for ${method} ${path}`)
}
