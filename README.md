# SumoLogic API client

Convenience wrapper (with typescript declarations) around the [Search Job API](https://help.sumologic.com/APIs/02Search_Job_API/About_the_Search_Job_API).

See also: [rx-sumologic-api-client](https://github.com/bkon/rx-sumologic-api-client) - RxJS convenience wrapper.

## Installation

Use `npm` or `yarn`:
```
npm install --save sumologic-api-client
yarn add sumologic-api-client
```

## Usage

```
import * as moment from "moment";
import * as Sumo from "sumologic-api-client";

const client = Sumo.client({
  endpoint: "https://api.au.sumologic.com/api/v1",
  user: "SUMO_API_ID",
  pass: "SUMO_API_KEY"
});

client
  .job({
    query: "ERROR | count",
    from: moment().subtract(1, "day").format(),
    to: moment().format(),
    timeZone: "Australia/Sydney"
  })
  .then((data) => console.log("Created job: " + data.id));

const jobId = "SAMPLE JOB ID";

client
  .status(jobId)
  .then((data) => console.log("Job status: " + JSON.stringify(data)));

client
  .messages(jobId)
  .then((data) => console.log("Job data: " + JSON.stringify(data)));

client
  .records(jobId)
  .then((data) => console.log("Job data: " + JSON.stringify(data)));

client
  .delete(jobId);
```

### What is the `endpoint` parameter?

See [Sumo Logic Endpoints](https://help.sumologic.com/APIs/General_API_Information/Sumo_Logic_Endpoints) for the list of endpoints you can use.
