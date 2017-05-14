import * as R from "ramda";
import * as httpClient from "request-promise-native";
import * as qs from "query-string";

import * as types from "./types";

export class Client {
  private httpClient: types.HttpClient;
  private params: types.ClientOptions;

  constructor(httpClient: types.HttpClient, params: types.ClientOptions) {
    this.httpClient = httpClient;
    this.params = params;
  }

  job(params: types.JobOptions): PromiseLike<types.Job> {
    return this.httpClient.post(this.options({
      uri: "/search/jobs",
      body: params
    }));
  }

  status(id: string): PromiseLike<types.Status> {
    return this.httpClient.get(this.options({ uri: `/search/jobs/${id}` }));
  }

  messages(id: string, params: types.PaginationOptions): PromiseLike<types.Messages> {
    const query = this.paginationQuery(params);
    return this.httpClient.get(this.options({
      uri: `/search/jobs/${id}/messages?${query}`
    }));
  }

  records(id: string, params: types.PaginationOptions): PromiseLike<types.Records> {
    const query = this.paginationQuery(params);
    return this.httpClient.get(this.options({
      uri: `/search/jobs/${id}/records?${query}`
    }));
  }

  delete(id: string): PromiseLike<void> {
    return this.httpClient.delete(this.options({ uri: `/search/jobs/${id}` }));
  }

  private paginationQuery(params: types.PaginationOptions): string {
    return qs.stringify(params);
  }

  private options(options: types.HttpCallOptions): types.HttpClientOptions {
    const defaultOptions = {
      auth: {
        user: this.params.sumoApiId,
        pass: this.params.sumoApiKey
      },
      json: true,
      jar: true
    };

    return R.pipe<
      types.HttpCallOptions,
      R.Nested<types.HttpCallOptions>,
      types.HttpClientOptions
    >(
      R.evolve<types.HttpCallOptions>(
        { uri: R.concat(this.params.endpoint) }
      ),
      R.merge(defaultOptions)
    )(options);
  }
}

const client = (params: types.ClientOptions): Client => new Client(httpClient, params)

export { client };
