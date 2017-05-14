import "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as request from "request-promise-native";
import * as sumo from "../src/index";
import * as types from "../src/types";

chai.use(sinonChai);

let sandbox : sinon.SinonSandbox;
let client: any;
let subject: any;
let httpClient: types.HttpClient;
const clientParams: types.ClientOptions = {
  endpoint: "http://fake.endpoint.com/api",
  sumoApiId: "ID",
  sumoApiKey: "KEY"
}

beforeEach(() => {
  sandbox = sinon.sandbox.create();
})

afterEach(() => {
  sandbox.restore();
});

describe("index.client", () => {
  beforeEach(() => {
    subject = () => sumo.client(clientParams);
  });

  it("constructs a new Sumo client instance", () => {
    chai.expect(subject()).to.be.instanceof(sumo.Client);
  });
});

describe("index.Client", () => {
  beforeEach(() => {
    httpClient = request;
    client = () => new sumo.Client(httpClient, clientParams)
  });

  describe("#job", () => {
    const result: types.Job = {
      status: 200,
      id: "SAMPLE JOB ID",
      code: "",
      message: "Success"
    };

    const params: types.JobOptions = {
      query: "ERROR",
      from: "2017-01-01",
      to: "2017-01-02",
      timeZone: "Australia/Sydney"
    };

    beforeEach(() => {
      subject = () => client().job(params);
      sandbox
        .stub(httpClient, "post")
        .returns(Promise.resolve(result));
    });

    it("calls create a new job API ", () => {
      subject();
      chai.expect(httpClient.post).to.have.been.calledWith(sinon.match({
        uri: "http://fake.endpoint.com/api/search/jobs",
        body: {
          query: "ERROR",
          from: "2017-01-01",
          to: "2017-01-02",
          timeZone: "Australia/Sydney"
        }
      }));
    });
  });

  describe("#status", () => {
    const result: types.Status = {
      state: "DONE GATHERING RESULTS",
      messageCount: 1,
      histogramBuckets: [],
      pendingErrors: [],
      pendingWarnings: [],
      recordCount: 1
    };

    beforeEach(() => {
      subject = () => client().status("JOB_ID");
      sandbox
        .stub(httpClient, "get")
        .returns(Promise.resolve(result));
    })

    it("calls get job status API", () => {
      subject();
      chai.expect(httpClient.get).to.have.been.calledWith(sinon.match({
        uri: "http://fake.endpoint.com/api/search/jobs/JOB_ID"
      }))
    });
  });

  describe("#messages", () => {
    const result: types.Messages = {
      fields: [],
      messages: []
    };

    beforeEach(() => {
      subject = () => client().messages("JOB_ID", { limit: 10, offset: 0 });
      sandbox
        .stub(httpClient, "get")
        .returns(Promise.resolve(result));
    })

    it("fetches the list of messages for this job", () => {
      subject();
      chai.expect(httpClient.get).to.have.been.calledWith(sinon.match({
        uri: "http://fake.endpoint.com/api/search/jobs/JOB_ID/messages?limit=10&offset=0"
      }))
    });
  });

  describe("#records", () => {
    const result: types.Records = {
      fields: [],
      records: []
    };

    beforeEach(() => {
      subject = () => client().records("JOB_ID", { limit: 10, offset: 0 });
      sandbox
        .stub(httpClient, "get")
        .returns(Promise.resolve(result));
    })

    it("fetches the list of records for this job", () => {
      subject();
      chai.expect(httpClient.get).to.have.been.calledWith(sinon.match({
        uri: "http://fake.endpoint.com/api/search/jobs/JOB_ID/records?limit=10&offset=0"
      }))
    });
  })

  describe("#delete", () => {
    beforeEach(() => {
      subject = () => client().delete("JOB_ID");
      sandbox
        .stub(httpClient, "delete")
        .returns(Promise.resolve());
    })

    it("removes the job", () => {
      subject();
      chai.expect(httpClient.delete).to.have.been.calledWith(sinon.match({
        uri: "http://fake.endpoint.com/api/search/jobs/JOB_ID"
      }))
    });
  })
});
