/**
 * @copyright 2026, FMR LLC
 * @file Model object for Spark Nav Bar Context.
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
export class SparkNavBarContext {
  /**
   * SPS Client Id.
   *
   * @type {string}
   * @memberof SparkNavBarContext
   */
  public clientId: string;

  /**
   * Spark Host according to environment.
   *
   * @type {string}
   * @memberof SparkNavBarContext
   */
  public host: string;

  /**
   * Participant search string.
   *
   * @type {string}
   * @memberof SparkNavBarContext
   */
  public participantSearchString: string;

  /**
   * Participant search type.
   *
   * @type {string}
   * @memberof SparkNavBarContext
   */
  public participantSearchType: string;

  /**
   * User id.
   *
   * @type {string}
   * @memberof SparkNavBarContext
   */
  public userId: string;

  /**
   * Creates an instance of SparkNavBarContext.
   *
   * @param clientId SPS client id.
   * @param host host name.
   * @param participantSearchString Participant search string.
   * @param participantSearchType Participant search type.
   * @param userId user id.
   * @memberof SparkNavBarContext
   */
  constructor(
    clientId: string,
    host: string,
    participantSearchString: string,
    participantSearchType: string,
    userId: string,
  ) {
    this.clientId = clientId;
    this.host = host;
    this.participantSearchString = participantSearchString;
    this.participantSearchType = participantSearchType;
    this.userId = userId;
  }
}
