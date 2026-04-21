/**
 * @copyright 2026, FMR LLC
 * @file Model object for Status.
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
export class Status {
  /**
   * Contains request status code
   * (e.g. 403)
   *
   * @type {number}
   * @memberof Status
   */
  public code: number;

  /**
   * Contains request status messages
   * (e.g. The user is unauthorized for the requested action)
   *
   * @type {string[]}
   * @memberof Status
   */
  public messages: string[];

  /**
   * May or not contain request reference code
   * when failures occured
   * (e.g. 2OK 07 16:56:50)
   *
   * @type {string}
   * @memberof Status
   */
  public referenceCode: string;

  /**
   * error messages
   *
   * @type {string}
   * @memberof Status
   */
  public errorMsg?: string;

  /**
   * Indicates whether async call is finshed and promise is returned
   *
   * @type {boolean}
   * @memberof Status
   */
  public asyncCallFinished?: boolean = false;

  /**
   * Indicates whether async call is failed
   *
   * @type {boolean}
   * @memberof Status
   */
  public failedAsyncCall?: boolean = false;

  /**
   * Indicates whether required data is provided from the service call
   *
   * @type {boolean}
   * @memberof Status
   */
  public requiredDataProvided?: boolean = false;

  /**
   * Constructor for Status class.
   *
   * @param code succcess or error code.
   * @param messages list of error messages.
   * @param referenceCode code sharing more details about this status.
   */
  constructor(code: number, messages: string[], referenceCode: string) {
    this.code = code;
    this.messages = messages;
    this.referenceCode = referenceCode;
  }
}
