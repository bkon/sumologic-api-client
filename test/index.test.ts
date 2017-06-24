import "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import * as chaiAsPromised from "chai-as-promised";

import * as request from "request-promise-native";
import * as sumo from "../src/index";
import * as types from "../src/types";

chai.use(sinonChai);
chai.use(chaiAsPromised);

let sandbox : sinon.SinonSandbox;
let client: any;
let subject: any;
let httpClient: types.HttpClient;
const clientParams: types.IClientOptions = {
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
    const result: types.IJob = {
      status: 200,
      id: "SAMPLE JOB ID",
      code: "",
      message: "Success"
    };

    const params: types.IJobOptions = {
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

    it("returns a promise resolving with the call data", () => {
      return chai.expect(subject()).to.eventually.deep.equal(result)
    })
  });

  describe("#status", () => {
    const result: types.IStatus = {
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

    it("returns a promise resolving with the call data", () => {
      return chai.expect(subject()).to.eventually.deep.equal(result);
    });
  });

  describe("#messages", () => {
    const result: types.IMessages = {
      fields: [],
      messages: []
    };

    context("when pagination options are provided", () => {
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

      it("returns a prmise resolving with the call data", () => {
        return chai.expect(subject()).to.eventually.deep.equal(result);
      });
    });

    context("when pagination options are not provided", () => {
      beforeEach(() => {
        subject = () => client().messages("JOB_ID");
        sandbox
          .stub(httpClient, "get")
          .returns(Promise.resolve(result));
      })

      it("fetches the list of messages for this job", () => {
        subject();
        chai
          .expect(httpClient.get)
          .to.have.been.calledWith(sinon.match({
            uri: "http://fake.endpoint.com/api/search/jobs/JOB_ID/messages?limit=10000&offset=0"
          }))
      });

      it("returns a prmise resolving with the call data", () => {
        return chai.expect(subject()).to.eventually.deep.equal(result);
      });
    });
  });

  describe("#records", () => {
    const result: types.IRecords = {
      fields: [],
      records: []
    };

    context("when pagination options are provided", () => {
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

      it("returns a prmise resolving with the call data", () => {
        return chai.expect(subject()).to.eventually.deep.equal(result);
      });
    });

    context("when pagination options are not provided", () => {
      beforeEach(() => {
        subject = () => client().records("JOB_ID");
        sandbox
          .stub(httpClient, "get")
          .returns(Promise.resolve(result));
      })

      it("fetches the list of records for this job", () => {
        subject();
        chai.expect(httpClient.get).to.have.been.calledWith(sinon.match({
          uri: "http://fake.endpoint.com/api/search/jobs/JOB_ID/records?limit=10000&offset=0"
        }))
      });

      it("returns a prmise resolving with the call data", () => {
        return chai.expect(subject()).to.eventually.deep.equal(result);
      });
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
