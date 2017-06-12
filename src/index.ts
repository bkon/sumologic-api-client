import * as qs from "query-string";
import * as R from "ramda";
import * as httpClient from "request-promise-native";

import * as types from "./types";

export class Client {
  private httpClient: types.HttpClient;
  private params: types.IClientOptions;

  constructor(httpClient: types.HttpClient, params: types.IClientOptions) {
    this.httpClient = httpClient;
    this.params = params;
  }

  public job(params: types.IJobOptions): PromiseLike<types.IJob> {
    return this.httpClient.post(this.options({
      body: params,
      uri: "/search/jobs"
    }));
  }

  public status(id: string): PromiseLike<types.IStatus> {
    return this.httpClient.get(this.options({ uri: `/search/jobs/${id}` }));
  }

  public messages(
    id: string,
    params: types.IPaginationOptions
  ): PromiseLike<types.IMessages> {
    const query = this.paginationQuery(params);
    return this.httpClient.get(this.options({
      uri: `/search/jobs/${id}/messages?${query}`
    }));
  }

  public records(
    id: string,
    params: types.IPaginationOptions
  ): PromiseLike<types.IRecords> {
    const query = this.paginationQuery(params);
    return this.httpClient.get(this.options({
      uri: `/search/jobs/${id}/records?${query}`
    }));
  }

  public delete(id: string): PromiseLike<void> {
    return this.httpClient.delete(this.options({ uri: `/search/jobs/${id}` }));
  }

  private paginationQuery(params: types.IPaginationOptions): string {
    return qs.stringify(params);
  }

  private options(options: types.IHttpCallOptions): types.HttpClientOptions {
    const defaultOptions = {
      auth: {
        pass: this.params.sumoApiKey,
        user: this.params.sumoApiId
      },
      jar: true,
      json: true
    };

    return R.pipe<
      types.IHttpCallOptions,
      R.Nested<types.IHttpCallOptions>,
      types.HttpClientOptions
    >(
      R.evolve<types.IHttpCallOptions>(
        { uri: R.concat(this.params.endpoint) }
      ),
      R.merge(defaultOptions)
    )(options);
  }
}

const client = (params: types.IClientOptions): Client =>
  new Client(httpClient, params);

export { client };
