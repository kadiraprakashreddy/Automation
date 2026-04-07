/**
 * @copyright 2021, FMR LLC
 * @file Model object for Spark Nav Bar Context.
 * @author Kyle McCombs (a561810)
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
     * @param userId user id.
     * @memberof SparkNavBarContext
     */
    constructor(clientId: string, host: string, userId: string) {
        this.clientId = clientId;
        this.host = host;
        this.userId = userId;
    }

}
