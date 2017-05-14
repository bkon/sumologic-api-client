import request = require("request");
import requestPromise = require("request-promise-native");

export interface Job {
  status: number,
  id: string,
  code: string,
  message: string
}

export interface HistogramBucket {
  length: number,
  count: number,
  startTimestamp: number
}

// Neither structure is specified at
// https://help.sumologic.com/APIs/02Search_Job_API/About_the_Search_Job_API
export type Error = any;
export type Warning = any;

export interface Status {
  state: string,
  messageCount: number,
  histogramBuckets: HistogramBucket[],
  pendingErrors: Error[],
  pendingWarnings: Warning[],
  recordCount: number
}

export interface Field {
  name: string,
  fieldType: string,
  keyField: boolean
}

export interface Message {
  map: { [key:string]: string }
}

export interface Messages {
  fields: Field[],
  messages: Message[]
}

export interface Records {
  fields: Field[],
  records: Message[]
}

export type HttpClient = request.RequestAPI<
  requestPromise.RequestPromise,
  requestPromise.RequestPromiseOptions,
  request.RequiredUriUrl
>

export interface ClientOptions {
  endpoint: string,
  sumoApiId: string,
  sumoApiKey: string
}

export interface JobOptions {
  query: string,
  from: string,
  to: string,
  timeZone: string
}

export interface HttpCallOptions {
  uri: string,
  body?: any
}

export interface PaginationOptions {
  offset: number,
  limit: number;
}

export type HttpClientOptions = request.Options;
