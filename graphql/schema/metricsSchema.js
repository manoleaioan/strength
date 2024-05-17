const MetricsTypes = `
  scalar Double

  type General {
    workouts:Int!,
    exercises:Int!,
    sets:Int!,
    reps:Int!
  }

  type PieChart {
    name: String!,
    val: Double!,
    color: String
  }

  type Metrics {
    general: General!
    exercises: [PieChart]
    routines: [PieChart]
  }

  input inputDate{
    gt:String!
    lte:String
  }
`;

const MetricsQuery = `
  getMetrics(date:inputDate):Metrics!
`;

const MetricsMutation = `

`;

module.exports = {
  MetricsTypes,
  MetricsQuery,
  MetricsMutation
}