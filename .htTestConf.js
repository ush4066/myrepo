const requestTypes = {
  HTTP: 'HTTP',
  GRAPHQL: 'GRAPHQL',
  KAFKA: 'KAFKA',
  GRPC: 'GRPC',
  AMQP: 'AMQP',
};

module.exports = {
  htBackendBaseUrl: 'http://v2-beta-external.hypertest.co:8001', // URL of HyperTest server (Required)
  serviceIdentifier: 'f6ff53ea-790f-433e-9d50-64d397900fa3',  // UUID for the service (Required)

  requestTypesToTest: [requestTypes.HTTP],  // What kind of requests to include in the test
  httpCandidateUrl: 'http://localhost:12300',  // Eg. 'http://localhost:9999' HTTP URL of App under test (Optional)
  // graphqlCandidateUrl: '',  // Eg. 'http://localhost:9999/graphql' GraphQL URL of App under test (Optional)

  appStartCommand: 'npm.exe',  // Command to start the app (Required)
  appStartCommandArgs: ['run', 'start-app-with-nyc'],  // App start command arguments (Required)
  appWorkingDirectory: __dirname,  // Working directory for the app (default: current working dir) (Optional)
  appStartTimeoutSec: 60,  // Timeout in seconds for the start command (default: 10) (Optional)

  testBatchSize: 50,  // Number of concurrent test requests (default: 50) (Optional)
  // testRequestsLimit: 100,  // Number requests to test (Optional)

  // httpReqFiltersArr: [],  // "<GET /users>", "<ANY REGEX:^/payments>" (Optional)
  htExtraHeaders: {  // Object containing additional headers for HyperTest server requests (Optional)
    authorization: 'Basic ' + Buffer.from('HyperTest-Demo:HyperTest-Demo').toString('base64'),
  },
  fastMode: true, // Default false. (aggregate requests only on the basis of request input and output schema - ignoring mock schemas)

  // shouldReportHeaderDiffs: false,  // Whether to report differences in headers (default: false) (Optional)
  // showAppLogs: true, // Whether to show app logs (default: false) (Optional)
  // showAppStdErrLogs: true,  // Whether to show stderr logs of the application (default: true) (Optional)
  // showAppStdOutLogs: false, // Whether to show stdout logs of the application (default: false) (Optional)

  // httpReqsToTest: [],  // specific http requests to be tested can be mentioned. Request Id can be taken from "All Requests" page in dashboard.
  // grpcReqsToTest: [],  // specific grpc requests to be tested can be mentioned.
  // graphqlReqsToTest: [],  // specific graphql requests to be tested can be mentioned.
  // kafkaReqsToTest: [],  // specific kafka requests to be tested can be mentioned.
  // amqpReqsToTest: [],  // specific amqp requests to be tested can be mentioned.
  // tags: [{name: '', value: ''}], // requests which contain the mentioned tags will be tested. Refer Tags under "User Guides/Node.js SDK" for more information.
  
   // filterFunctionToIgnoreMockDiffs:({ mockDiff, currentMock, requestObj }) => { 
  //  // if false is returned then the diff will be ignored
  //  if(mockDiff?.originalValue?.langType === 'Date') return false;
  //  if(mockDiff?.evaluatedPath?.at(-1) === "url" || mockDiff?.evaluatedPath?.at(-2) === "headers") return false;
  //  if(mockDiff?.evaluatedPath?.at(-1) === "host") return false;
  //  return true;
  //},
  
  // filterFunctionToIgnoreResponseDiffs: ({ responseDiff, requestObj }) => { // Param Types are mentioned in Type References page
  // // if false is returned then the response difference will be ignored  
  //  if(responseDiff?.evaluatedPath?.at(-1) === "url" || evaluatedPath?.evaluatedPath?.at(-2) === "headers") return false;
  //  if(responseDiff?.evaluatedPath?.at(-1) === "host") return false;
  //  return true;
  //},
  // exitCodeSetter({ testResult }) {
  //  console.log('==test results==')
  //  console.log(testResult)
  //  return 0;
  //},

  // initialTimestamp: "", // Initial timestamp in ISO format (Optional)
  // finalTimestamp: "", // Final timestamp in ISO format (Optional)
  // cliServerHost: "", // HT CLI server Host to be Used by Clients(server ignores this) (default: localhost) (Optional)
  // sdkServerHost: "", // HT SDK server Host to be Used by Clients(server ignores this)
  // autoAcceptChangesInCaseOnlyNoiseDetected: false,  // specifies whether to auto-accept changes with only noise (default: true) (Optional)
  // shouldIgnoreErrStackTraceDiffs: true,  // stack trace differences are ignored in errors (default: true) (Optional)
  // exclusionStringsForDifferences: [], // e.g., ['01.02.03.04', 'HyPeRtEsT'],
  // reservedAppPorts: [], // Ports used by the host application e.g., [3001,4001]
  
  // outputStatusesToTest: ['OKAY'],  //  optional array of statuses to test for, must be 'OKAY' or 'ERROR'
  // shouldEmitErrorInHttpOutbound: false,  // whether the SDK should throw and error during REPLAY in a HTTP outbound call (default: false) (Optional)
  // shouldReportRootMockDifferences: false,  // Whether to report root mock differences (default: false) (Optional)
};